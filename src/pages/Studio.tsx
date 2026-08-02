// Studio — batch face-scan content generator (internal tool, unlinked route).
// Drop N photos → scans each with the real engine → plays a vertical,
// screen-recordable reveal (hook → per-face score count-up → leaderboard → CTA).
// Not for public users; no nav link. See scan-content-scripts.md.

import { useState, useRef, useCallback, useEffect } from "react";
import { analyzeFace, loadFaceLandmarker, tierFor, type ScanResult } from "../lib/faceScan";
import { Output, Mp4OutputFormat, BufferTarget, CanvasSource, AudioBufferSource, QUALITY_HIGH, canEncodeVideo, canEncodeAudio } from "mediabunny";

const MAX_DIM = 1100;
const POOL_KEY = "studio_alltime_leaderboard";

// reveal pacing — shared by the on-screen sequencer and the auto-stop timer for recording
const HOOK_MS = 1800;
const SCAN_HOLD_MS = 900; // full-screen "scanning" moment before zooming out to the read-out
const FACE_MS = 2900; // includes SCAN_HOLD_MS + reveal + a hold after the rating finishes counting up
const BOARD_HOLD_MS = 3000; // how long the leaderboard holds before a recording auto-stops
const ZOOM_MS = 700; // duration of the full-screen -> small-band zoom, once scanning ends
const SCORE_DELAY_MS = 150; // pause after zoom before the score starts counting up
const SCORE_MS = 900; // score count-up duration
const CAT_DELAY_MS = 150; // pause before the first category row fades in
const CAT_STAGGER_MS = 50; // gap between each category row's fade-in
const CAT_FADE_MS = 260; // each category row's own fade-in duration

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

const fadeIn = (localT: number, delay = 0, dur = 450) => Math.max(0, Math.min(1, (localT - delay) / dur));

// "back out" easing — overshoots past 1 then settles, for a punchy pop-in
// rather than a flat fade (the hook has ~1s to grab attention before anyone
// scrolls past, a plain fade doesn't do that work)
function easeOutBack(t: number): number {
  const c1 = 1.7, c3 = c1 + 1;
  const x = Math.max(0, Math.min(1, t));
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

// which scan metrics roll up into which category — drives the compact per-category rating rows
const METRIC_CATEGORIES: { label: string; ids: string[] }[] = [
  { label: "Eyes & Brows", ids: ["canthal-tilt", "eye-spacing", "eye-aspect", "brow-tilt", "brow-density"] },
  { label: "Nose & Mouth", ids: ["chin-philtrum", "lip-ratio", "lip-fullness", "mouth-nose", "nose-width"] },
  { label: "Face & Ratios", ids: ["fwhr", "midface", "thirds", "jaw-taper", "face-index"] },
  { label: "Skin Clarity", ids: ["skin-clarity"] },
  { label: "Symmetry", ids: ["symmetry"] },
];

function categoryScores(result: ScanResult): { label: string; score: number }[] {
  return METRIC_CATEGORIES.map((c) => {
    const ms = result.metrics.filter((m) => c.ids.includes(m.id));
    const avg = ms.length ? ms.reduce((s, m) => s + m.score, 0) / ms.length : 0;
    return { label: c.label, score: avg };
  });
}

// face center as a 0-1 fraction of the source image — lets the zoomed-out crop actually center
// on the detected face instead of the image's raw geometric center (player cutouts vary a lot)
function faceFocus(result: ScanResult, imgW: number, imgH: number): { x: number; y: number } {
  const o = result.overlay;
  const x = (o.rCheek.x + o.lCheek.x) / 2 / imgW;
  // the crop band after zoom-out is short relative to most photos, so centering exactly
  // between the forehead landmark and chin — which is what a plain midpoint does — leaves
  // no room for hair above the hairline and clips the top of the head. Bias the center
  // upward by ~18% of face height for headroom.
  const faceHeight = o.chin.y - o.foreheadTop.y;
  const y = ((o.foreheadTop.y + o.chin.y) / 2 - faceHeight * 0.18) / imgH;
  return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) };
}

// content-only score remap: same underlying engine/analysis, just a wider, slightly
// less harsh display curve for leaderboard content. Does NOT touch the live /scan product.
function remapForContent(raw: number): number {
  const center = 5.5; // empirical midpoint of raw scores on real photos
  const mapped = center + 0.5 + (raw - center) * 2.15;
  return Math.max(0, Math.min(9.0, mapped));
}

// bright red (2.0) → dark green (9.0) heat color for on-screen score displays
function colorForScore(v: number): string {
  const t = Math.max(0, Math.min(1, (v - 2) / 7));
  const hue = t * 120;
  const light = 58 - t * 20;
  return `hsl(${hue.toFixed(0)}, 82%, ${light.toFixed(0)}%)`;
}

// ── canvas renderer for downloadable recording — mirrors the on-screen DOM/CSS reveal ──
const REC_W = 1080;
const REC_H = 1920;

// video palette — white background, so accent text needs a dark-enough green to actually
// read (the site's bright #6ee7b7/#3ED8C3 teal is ~1.8:1 contrast on white, well under
// legible). This is a darker shade of the same brand hue, ~6.5:1 contrast on white.
// The lighter brand teal is kept for purely decorative glows/washes drawn over photos or
// as soft tints, where legibility doesn't apply.
const VIDEO_INK = "#111";
const VIDEO_GREEN = "#0a6b56";
const VIDEO_GLOW_RGB = "62,216,195";
// light grey rather than pure white — pure white was reading flat/blank next to the content
const BG_COLOR = "#f2f1ee";

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCover(
  ctx: CanvasRenderingContext2D, img: HTMLImageElement,
  dx: number, dy: number, dw: number, dh: number,
  radius = 0, focusX = 0.5, focusY = 0.5,
) {
  const ir = img.width / img.height;
  const tr = dw / dh;
  let sw, sh;
  if (ir > tr) { sh = img.height; sw = sh * tr; } else { sw = img.width; sh = sw / tr; }
  const sx = Math.max(0, Math.min(img.width - sw, img.width * focusX - sw / 2));
  const sy = Math.max(0, Math.min(img.height - sh, img.height * focusY - sh / 2));
  ctx.save();
  if (radius) { roundRectPath(ctx, dx, dy, dw, dh, radius); ctx.clip(); }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  ctx.restore();
}

function drawContain(ctx: CanvasRenderingContext2D, img: HTMLImageElement, dx: number, dy: number, dw: number, dh: number) {
  const ir = img.width / img.height;
  const tr = dw / dh;
  let w, h;
  if (ir > tr) { w = dw; h = dw / ir; } else { h = dh; w = dh * ir; }
  ctx.drawImage(img, dx + (dw - w) / 2, dy + (dh - h) / 2, w, h);
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

// a face as needed for offline rendering — plain data, no live scan/UI state attached
type RenderFace = { id: string; name: string; result: ScanResult; contentScore: number };

// plain white backdrop, sits behind everything
function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, REC_W, REC_H);
}

// intro/hook text card — "sourcestack.app" tag + headline. tMs is local to this card (0 at
// the moment the card starts, whenever that is in the overall timeline).
function renderIntroCard(ctx: CanvasRenderingContext2D, tMs: number, hookText: string) {
  // quick radial flash burst on frame one — the first ~1s has to grab
  // attention before a scroll-past, so it opens with a hit, not a fade
  const flashT = fadeIn(tMs, 0, 320);
  if (flashT < 1) {
    const flashAlpha = (1 - flashT) * 0.5;
    const flashR = REC_W * (0.25 + flashT * 0.6);
    const grad = ctx.createRadialGradient(REC_W / 2, REC_H * 0.42, 0, REC_W / 2, REC_H * 0.42, flashR);
    grad.addColorStop(0, `rgba(${VIDEO_GLOW_RGB},${flashAlpha})`);
    grad.addColorStop(1, `rgba(${VIDEO_GLOW_RGB},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, REC_W, REC_H);
  }

  ctx.textAlign = "center";

  // eyebrow tag — fast fade + slight upward settle
  const tagT = fadeIn(tMs, 40, 220);
  ctx.globalAlpha = tagT;
  ctx.fillStyle = VIDEO_GREEN;
  ctx.font = "700 21px Menlo, Consolas, monospace";
  ctx.fillText("sourcestack.app", REC_W / 2, REC_H * 0.4 + (1 - tagT) * 10);

  // headline — punchy scale pop (slight overshoot) instead of a plain fade
  const headScale = 0.55 + 0.45 * easeOutBack(Math.max(0, Math.min(1, (tMs - 120) / 460)));
  ctx.globalAlpha = fadeIn(tMs, 120, 260);
  ctx.fillStyle = VIDEO_INK;
  ctx.font = "800 40px -apple-system, Helvetica, Arial, sans-serif";
  const lines = wrapLines(ctx, hookText || "", REC_W * 0.7);
  const lineH = 48;
  lines.forEach((line, i) => {
    const ly = REC_H * 0.46 + i * lineH;
    ctx.save();
    ctx.translate(REC_W / 2, ly - 20);
    ctx.scale(headScale, headScale);
    ctx.translate(-REC_W / 2, -(ly - 20));
    ctx.fillText(line, REC_W / 2, ly);
    ctx.restore();
  });

  // accent bar draws in after the headline lands
  const barT = fadeIn(tMs, 420, 260);
  const barW = 78 * barT;
  ctx.globalAlpha = barT;
  ctx.fillStyle = VIDEO_GREEN;
  const lastLy = REC_H * 0.46 + (lines.length - 1) * lineH;
  ctx.fillRect(REC_W / 2 - barW / 2, lastLy + 12, barW, 4);
  ctx.globalAlpha = 1;
}

// one face's scan -> zoom -> score/category reveal. localT is local to this face (0 at the
// moment its slot starts, whenever that slot falls in the overall timeline) — used for both the
// hook face (first, before the intro card) and every face in the main loop after it.
function renderFaceReveal(
  ctx: CanvasRenderingContext2D,
  localT: number,
  f: RenderFace,
  img: HTMLImageElement | undefined,
  faceMarginX: number,
) {
  const faceAlpha = Math.min(1, localT / 260);
  ctx.globalAlpha = faceAlpha;

  if (localT < SCAN_HOLD_MS) {
    if (img?.complete) drawContain(ctx, img, faceMarginX, 0, REC_W - faceMarginX * 2, REC_H);
    const sy = -0.04 * REC_H + Math.min(1, localT / SCAN_HOLD_MS) * 1.08 * REC_H;
    const grad = ctx.createLinearGradient(faceMarginX, 0, REC_W - faceMarginX, 0);
    grad.addColorStop(0, `rgba(${VIDEO_GLOW_RGB},0)`);
    grad.addColorStop(0.5, `rgba(${VIDEO_GLOW_RGB},0.95)`);
    grad.addColorStop(1, `rgba(${VIDEO_GLOW_RGB},0)`);
    ctx.fillStyle = grad;
    ctx.fillRect(faceMarginX, sy, REC_W - faceMarginX * 2, 5);
    ctx.textAlign = "center";
    ctx.fillStyle = "#3ED8C3";
    ctx.font = "700 24px Menlo, Consolas, monospace";
    ctx.fillText(`SCANNING ${f.name.toUpperCase()}`, REC_W / 2, 70);
  } else {
    const revealT = localT - SCAN_HOLD_MS;
    // face band sits near the top of the frame — shorter than before now that drawContain
    // (below) can't crop regardless of box size, so there's no reason to make this tall; a
    // shorter band just leaves more headroom and pulls the whole text stack up off the floor
    const faceTop = REC_H * 0.10;
    const faceH = REC_H * 0.36;
    const faceBottom = faceTop + faceH;
    if (img?.complete) {
      // animate the box from full-height down to the final band. Uses drawContain, not
      // drawCover — a cover-crop into this short/wide band was clipping the top of the head
      // AND the chin, since most source photos are taller (more portrait) than the band's
      // own aspect ratio. Contain always shows the whole face, just smaller if it doesn't fit.
      const zt = 1 - Math.pow(1 - Math.min(1, revealT / ZOOM_MS), 3);
      const by = lerp(0, faceTop, zt);
      const bh = lerp(REC_H, faceH, zt);
      drawContain(ctx, img, faceMarginX, by, REC_W - faceMarginX * 2, bh);
    }
    ctx.textAlign = "center";

    ctx.globalAlpha = faceAlpha * fadeIn(revealT, 0);
    ctx.fillStyle = VIDEO_INK;
    ctx.font = "700 34px -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(f.name, REC_W / 2, faceBottom + 46);

    const scoreT = Math.max(0, Math.min(1, (revealT - SCORE_DELAY_MS) / SCORE_MS));
    const liveScore = f.contentScore * (1 - Math.pow(1 - scoreT, 3));
    ctx.globalAlpha = faceAlpha * fadeIn(revealT, 120);
    ctx.fillStyle = colorForScore(liveScore);
    ctx.font = "900 92px -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(liveScore.toFixed(1), REC_W / 2 + 24, faceBottom + 140);
    ctx.fillStyle = "#777";
    ctx.font = "400 24px -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("/ 10", REC_W / 2 + 34, faceBottom + 140);

    const cats = categoryScores(f.result);
    const catTop = faceBottom + 172;
    const catRowH = 34;
    cats.forEach((c, ci) => {
      ctx.globalAlpha = faceAlpha * fadeIn(revealT, CAT_DELAY_MS + ci * CAT_STAGGER_MS, CAT_FADE_MS);
      const cy = catTop + ci * catRowH;
      ctx.textAlign = "left";
      ctx.fillStyle = "#444";
      ctx.font = "600 19px -apple-system, Helvetica, Arial, sans-serif";
      ctx.fillText(c.label, REC_W * 0.22, cy);
      ctx.textAlign = "right";
      ctx.fillStyle = colorForScore(c.score);
      ctx.font = "800 21px -apple-system, Helvetica, Arial, sans-serif";
      ctx.fillText(c.score.toFixed(1), REC_W * 0.78, cy);
    });
  }
  ctx.globalAlpha = 1;
}

// Pure function of elapsed time — draws exactly what the reveal looks like at tMs into the
// video. No timers, no live state: generateVideo() below calls this once per output frame,
// as fast as the browser can render+encode, completely decoupled from real-time playback.
//
// Timeline: hook face (faces[0], no card yet — the scroll-stop lands on a face, not text) ->
// intro card -> the rest of the faces, one after another -> leaderboard.
function renderVideoFrame(
  ctx: CanvasRenderingContext2D,
  tMs: number,
  hookText: string,
  faces: RenderFace[],
  boardRanked: PoolItem[],
  imgCache: Map<string, HTMLImageElement>,
  thumbCache: Map<string, HTMLImageElement>,
) {
  drawBackground(ctx);
  const faceMarginX = REC_W * 0.12; // faces sit inset from the edges, not edge-to-edge

  if (faces.length > 0 && tMs < FACE_MS) {
    renderFaceReveal(ctx, tMs, faces[0], imgCache.get(faces[0].id), faceMarginX);
    return;
  }
  const afterHookFace = faces.length > 0 ? tMs - FACE_MS : tMs;

  if (afterHookFace < HOOK_MS) {
    renderIntroCard(ctx, afterHookFace, hookText);
    return;
  }

  const afterIntro = afterHookFace - HOOK_MS;
  const restFaces = faces.slice(1);
  const faceTotal = restFaces.length * FACE_MS;
  if (restFaces.length > 0 && afterIntro < faceTotal) {
    const idx = Math.min(restFaces.length - 1, Math.floor(afterIntro / FACE_MS));
    const localT = afterIntro - idx * FACE_MS;
    const f = restFaces[idx];
    renderFaceReveal(ctx, localT, f, imgCache.get(f.id), faceMarginX);
    return;
  }

  const boardT = afterIntro - faceTotal;
  ctx.textAlign = "left";
  ctx.fillStyle = VIDEO_INK;
  ctx.font = "800 32px -apple-system, Helvetica, Arial, sans-serif";
  ctx.fillText("Leaderboard", REC_W * 0.09, REC_H * 0.13);
  // no bottom CTA text anymore — rows use that freed space and run further down the screen
  const rowH = 100, top = REC_H * 0.185, thumbSize = 60;
  boardRanked.forEach((it, i) => {
    const t = fadeIn(boardT, i * 220, 400);
    if (t <= 0) return;
    const y = top + i * rowH;
    const baseline = y + 54;
    ctx.globalAlpha = t;
    ctx.fillStyle = i === 0 ? `rgba(${VIDEO_GLOW_RGB},0.18)` : "rgba(0,0,0,0.04)";
    roundRectPath(ctx, REC_W * 0.06, y, REC_W * 0.88, rowH - 16, 14);
    ctx.fill();
    ctx.fillStyle = VIDEO_GREEN;
    ctx.font = "800 24px -apple-system, Helvetica, Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(String(i + 1), REC_W * 0.09, baseline);
    const timg = thumbCache.get(it.id);
    if (timg?.complete) drawCover(ctx, timg, REC_W * 0.15, y + 12, thumbSize, thumbSize, 10, it.focusX ?? 0.5, it.focusY ?? 0.5);
    ctx.fillStyle = VIDEO_INK;
    ctx.font = "600 25px -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(it.name, REC_W * 0.26, baseline);
    // ratings sit inset from the right edge (middle-right), clear of TikTok's right-side icon column
    ctx.textAlign = "right";
    ctx.fillStyle = colorForScore(it.score);
    ctx.font = "800 28px -apple-system, Helvetica, Arial, sans-serif";
    ctx.fillText(it.score.toFixed(1), REC_W * 0.79, baseline);
    ctx.globalAlpha = 1;
  });
}

type Item = {
  id: string;
  name: string;
  status: "pending" | "scanning" | "done" | "error";
  dataUrl?: string; // photo with overlay drawn, cropped square-ish for cards
  result?: ScanResult;
  error?: string;
  focusX?: number; // detected face center, 0-1 fraction of image — drives the zoomed-out crop
  focusY?: number;
};

// all-time leaderboard entry — persisted to localStorage so it survives across videos/reloads
type PoolItem = { id: string; name: string; thumb: string; score: number; tier: string; ts: number; focusX?: number; focusY?: number };

function makeThumb(canvas: HTMLCanvasElement, maxDim = 220): string {
  const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
  const w = Math.round(canvas.width * scale);
  const h = Math.round(canvas.height * scale);
  const small = document.createElement("canvas");
  small.width = w;
  small.height = h;
  small.getContext("2d")!.drawImage(canvas, 0, 0, w, h);
  // webp (not jpeg) — preserves transparency for background-removed cutouts
  return small.toDataURL("image/png");
}

// ── overlay (mirrors FaceScan.drawOverlay) ──
function drawOverlay(ctx: CanvasRenderingContext2D, scan: ScanResult, w: number) {
  const o = scan.overlay;
  ctx.lineWidth = Math.max(1, w / 700);
  const dot = (p: { x: number; y: number }, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(2, w / 350), 0, Math.PI * 2);
    ctx.fill();
  };
  const line = (a: { x: number; y: number }, b: { x: number; y: number }, color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
    dot(a, color);
    dot(b, color);
  };
  const faint = "rgba(255,255,255,0.35)";
  const accent = "rgba(52,211,153,0.9)";
  const xL = Math.min(o.rCheek.x, o.lCheek.x);
  const xR = Math.max(o.rCheek.x, o.lCheek.x);
  [o.foreheadTop.y, o.nasion.y, o.subnasale.y, o.chin.y].forEach((y) => {
    ctx.strokeStyle = faint;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(xL, y);
    ctx.lineTo(xR, y);
    ctx.stroke();
    ctx.setLineDash([]);
  });
  line(o.rCheek, o.lCheek, faint);
  line(o.rGonion, o.lGonion, accent);
  line(o.rEyeOuter, o.rEyeInner, accent);
  line(o.lEyeInner, o.lEyeOuter, accent);
  line(o.rBrowMedial, o.rBrowTail, faint);
  line(o.lBrowMedial, o.lBrowTail, faint);
}

const fileToImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });

const cleanName = (filename: string) =>
  filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

// count-up hook for the score reveal
function useCountUp() {
  const [val, setVal] = useState(0);
  const run = useCallback((target: number, ms = SCORE_MS) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, []);
  return [val, run, setVal] as const;
}

// synthesized per-face score "sting" — no sourced/sampled audio, same policy as the Diamond
// Detail ad-factory pipeline. Tier is read off the same contentScore shown on screen: a bright
// ascending chime on a high score, a short neutral blip in the middle, a descending "womp womp"
// on a low one.
function scheduleScoreSting(ctx: BaseAudioContext, master: GainNode, atSec: number, score: number) {
  const tone = (type: OscillatorType, freq: number, start: number, dur: number, peak: number) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(peak, start + Math.min(0.02, dur * 0.2));
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(Math.max(0, start));
    osc.stop(start + dur + 0.02);
  };

  if (score >= 7.5) {
    [659.25, 830.61, 987.77].forEach((f, i) => tone("sine", f, atSec + i * 0.07, 0.32, 0.5));
  } else if (score >= 5.5) {
    tone("triangle", 500, atSec, 0.16, 0.45);
  } else {
    tone("sawtooth", 196, atSec, 0.26, 0.4);
    tone("sawtooth", 165, atSec + 0.24, 0.3, 0.4);
  }
}

// distinct buzzer for the hook face — its job is to grab attention, not communicate a real
// score, so it always gets this instead of a tier-based sting regardless of what the face
// actually scored. Sawtooth + fast pitch wobble (LFO on frequency) for a harsh "ERRR" buzz
// rather than a clean tone.
function scheduleErrrSting(ctx: BaseAudioContext, master: GainNode, atSec: number) {
  const dur = 0.45;
  const osc = ctx.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, atSec);

  const lfo = ctx.createOscillator();
  lfo.frequency.value = 28;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 18;
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, atSec);
  g.gain.exponentialRampToValueAtTime(0.55, atSec + 0.02);
  g.gain.setValueAtTime(0.55, atSec + dur - 0.08);
  g.gain.exponentialRampToValueAtTime(0.0001, atSec + dur);

  osc.connect(g);
  g.connect(master);
  osc.start(atSec);
  lfo.start(atSec);
  osc.stop(atSec + dur + 0.02);
  lfo.stop(atSec + dur + 0.02);
}

// renders one AudioBuffer covering the whole video's duration with a sting placed at the moment
// each face's score finishes counting up — a single buffer keeps every sting's timestamp exact
// against the video timeline instead of chaining separately-timed clips. faces[0] is the hook
// face (gets the ERRR buzzer, plays before the intro card); everything after it is the main
// loop (gets the usual tier-based sting), offset by the hook face + intro card's duration.
async function synthesizeStingerTrack(totalMs: number, faces: RenderFace[]): Promise<AudioBuffer> {
  const sampleRate = 44100;
  const ctx = new OfflineAudioContext(2, Math.ceil((totalMs / 1000) * sampleRate), sampleRate);
  const master = ctx.createGain();
  master.gain.value = 0.5;
  master.connect(ctx.destination);

  if (faces.length > 0) {
    const hookScoreEndMs = SCAN_HOLD_MS + SCORE_DELAY_MS + SCORE_MS;
    scheduleErrrSting(ctx, master, hookScoreEndMs / 1000);
  }

  const restFaces = faces.slice(1);
  const introOffsetMs = faces.length > 0 ? FACE_MS + HOOK_MS : 0;
  restFaces.forEach((f, i) => {
    const scoreEndMs = introOffsetMs + i * FACE_MS + SCAN_HOLD_MS + SCORE_DELAY_MS + SCORE_MS;
    scheduleScoreSting(ctx, master, scoreEndMs / 1000, f.contentScore);
  });

  return ctx.startRendering();
}

export default function Studio() {
  const [items, setItems] = useState<Item[]>([]);
  const [hook, setHook] = useState("I scanned these faces with an AI");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // all-time leaderboard pool — accumulates across videos/sessions, persisted locally
  const [pool, setPool] = useState<PoolItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(POOL_KEY) || "[]"); } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(POOL_KEY, JSON.stringify(pool)); } catch {}
  }, [pool]);
  const boardRanked = [...pool].sort((a, b) => b.score - a.score).slice(0, 10);
  const clearPool = () => {
    if (window.confirm("Clear the entire all-time leaderboard? This can't be undone.")) setPool([]);
  };
  const removeFromPool = (id: string) => setPool((prev) => prev.filter((p) => p.id !== id));

  // reveal player
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"hook" | "face" | "board">("hook");
  const [faceIdx, setFaceIdx] = useState(0);
  const [revealed, setRevealed] = useState(false); // false = full-screen scan moment, true = zoomed-out info view
  const [score, runCount, setScore] = useCountUp();
  const timers = useRef<number[]>([]);

  // video generation — renders frames offline (not real-time) and encodes them straight to
  // an .mp4 via WebCodecs, so there's no live playback/capture race to go wrong
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const recCanvasRef = useRef<HTMLCanvasElement>(null);
  const liveCanvasRef = useRef<HTMLCanvasElement>(null); // live-preview equivalent of the video's face rendering
  const faceStartRef = useRef(0); // performance.now() when the current face's phase began
  const imgCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const thumbCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // per-video reveal order = order photos were entered, not sorted by score
  // (the leaderboard/board phase below uses the separately-sorted `boardRanked` pool)
  const done = items.filter((i) => i.status === "done" && i.result);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const newItems: Item[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ id: crypto.randomUUID(), name: cleanName(f.name), status: "pending" as const, _file: f } as Item & { _file: File }));
    setItems((prev) => [...prev, ...newItems]);
    for (const it of newItems) await scanOne(it as Item & { _file: File });
  };

  const scanOne = async (it: Item & { _file: File }) => {
    setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "scanning" } : p)));
    try {
      const img = await fileToImage(it._file);
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = canvasRef.current!;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const lm = await loadFaceLandmarker();
      const detection = lm.detect(canvas);
      if (!detection.faceLandmarks.length) {
        setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "error", error: "No face detected — use a clear front-facing photo" } : p)));
        return;
      }
      const scan = analyzeFace(detection.faceLandmarks[0], w, h, ctx);
      drawOverlay(ctx, scan, w);
      // png (not jpeg) — preserves transparency for background-removed player cutouts.
      // Using png specifically (not webp) — universally, unambiguously supported everywhere.
      const dataUrl = canvas.toDataURL("image/png");
      const thumb = makeThumb(canvas);
      const contentScore = remapForContent(scan.overall);
      const focus = faceFocus(scan, w, h);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "done", result: scan, dataUrl, focusX: focus.x, focusY: focus.y } : p)));
      setPool((prev) => [...prev, { id: it.id, name: it.name, thumb, score: contentScore, tier: tierFor(contentScore), ts: Date.now(), focusX: focus.x, focusY: focus.y }]);
      // pre-warm the recording canvas's image cache so playback never stalls on a still-loading photo
      const fullImg = new Image(); fullImg.src = dataUrl; imgCacheRef.current.set(it.id, fullImg);
      const thumbImg = new Image(); thumbImg.src = thumb; thumbCacheRef.current.set(it.id, thumbImg);
    } catch (e) {
      console.error(e);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "error", error: "Scan failed" } : p)));
    }
  };

  const setName = (id: string, name: string) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    setPool((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  };
  const moveItem = (id: string, dir: -1 | 1) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const remove = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
    setPool((prev) => prev.filter((p) => p.id !== id));
  };
  const clearSession = () => { stop(); setItems([]); };

  // ── reveal sequencer ──
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const at = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };

  const play = () => {
    if (done.length === 0) return;
    clearTimers();
    setPlaying(true);
    setScore(0);

    // hook face plays first, before the intro card — the scroll-stop should land on a face
    setFaceIdx(0);
    setRevealed(false);
    setPhase("face");
    faceStartRef.current = performance.now();
    at(SCAN_HOLD_MS, () => {
      setRevealed(true);
      timers.current.push(window.setTimeout(() => runCount(remapForContent(done[0].result!.overall)), SCORE_DELAY_MS));
    });
    at(FACE_MS, () => {
      setPhase("hook");
      at(HOOK_MS, () => stepFace(1));
    });

    function stepFace(i: number) {
      if (i >= done.length) { showBoard(); return; }
      setPhase("face");
      setFaceIdx(i);
      setScore(0);
      setRevealed(false);
      faceStartRef.current = performance.now();
      at(SCAN_HOLD_MS, () => {
        setRevealed(true);
        timers.current.push(window.setTimeout(() => runCount(remapForContent(done[i].result!.overall)), SCORE_DELAY_MS));
      });
      at(FACE_MS, () => stepFace(i + 1));
    }
    function showBoard() {
      setPhase("board");
    }
  };

  const stop = () => { clearTimers(); setPlaying(false); setPhase("hook"); setRevealed(false); };

  // ── generate video ──
  // Renders every output frame offline (not real-time playback) with renderVideoFrame(), then
  // encodes it straight into an .mp4 via WebCodecs (through mediabunny). No live capture, no
  // permission prompt, no dependency on wall-clock timing keeping up — just deterministic math.
  const generateVideo = async () => {
    if (done.length === 0 || generating) return;
    const supported = await canEncodeVideo("avc", { width: REC_W, height: REC_H, bitrate: QUALITY_HIGH });
    if (!supported) {
      alert("This browser can't encode video (needs WebCodecs + H.264 support) — try a recent Chrome.");
      return;
    }
    setGenerating(true);
    setGenProgress(0);
    try {
      const faces: RenderFace[] = done.map((it) => ({
        id: it.id,
        name: it.name,
        result: it.result!,
        contentScore: remapForContent(it.result!.overall),
      }));

      // make sure every photo this render needs is actually decoded before we start drawing frames
      await Promise.all([
        ...faces.map((f) => imgCacheRef.current.get(f.id)?.decode().catch(() => {})),
        ...boardRanked.map((b) => thumbCacheRef.current.get(b.id)?.decode().catch(() => {})),
      ]);

      const canvas = recCanvasRef.current!;
      canvas.width = REC_W;
      canvas.height = REC_H;
      const ctx = canvas.getContext("2d")!;

      const fps = 30;
      const frameDur = 1 / fps;
      const totalMs = HOOK_MS + faces.length * FACE_MS + BOARD_HOLD_MS;
      const totalFrames = Math.ceil((totalMs / 1000) * fps);

      const target = new BufferTarget();
      const output = new Output({ format: new Mp4OutputFormat(), target });
      const videoSource = new CanvasSource(canvas, { codec: "avc", bitrate: QUALITY_HIGH });
      output.addVideoTrack(videoSource);

      // score-based sound effects — skip silently if this browser can't encode aac, video still works
      const audioOk = await canEncodeAudio("aac", { numberOfChannels: 2, sampleRate: 44100, bitrate: QUALITY_HIGH });
      const audioSource = audioOk ? new AudioBufferSource({ codec: "aac", bitrate: QUALITY_HIGH }) : null;
      if (audioSource) output.addAudioTrack(audioSource);

      await output.start();

      if (audioSource) {
        const stingerBuffer = await synthesizeStingerTrack(totalMs, faces);
        await audioSource.add(stingerBuffer);
      }

      for (let i = 0; i < totalFrames; i++) {
        renderVideoFrame(ctx, (i / fps) * 1000, hook, faces, boardRanked, imgCacheRef.current, thumbCacheRef.current);
        await videoSource.add(i / fps, frameDur);
        if (i % 8 === 0) {
          setGenProgress(Math.round((i / totalFrames) * 100));
          await new Promise((r) => setTimeout(r, 0)); // yield so the UI can repaint progress
        }
      }

      await output.finalize();
      const blob = new Blob([target.buffer!], { type: "video/mp4" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sourcestack-reveal-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error(err);
      alert("Video generation failed — check the browser console for details.");
    } finally {
      setGenerating(false);
      setGenProgress(0);
    }
  };

  // ── styles ──
  const stage: React.CSSProperties = {
    position: "relative", width: "min(405px, 90vw)", aspectRatio: "9 / 16",
    backgroundColor: BG_COLOR,
    borderRadius: 22, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center", color: "#111", fontFamily: "inherit",
  };
  const cur = done[faceIdx];

  // continuously draws the current face into the live-preview canvas — full-screen "contain"
  // while scanning, then an animated zoom into the focus-centered crop, using real elapsed time
  // against the same SCAN_HOLD_MS/ZOOM_MS the real video's renderVideoFrame() uses. Same
  // drawCover() math, same focusX/focusY, so the preview and the generated file always agree —
  // and because it's recomputed fresh every frame from whatever box it's given, the zoom lands
  // on the face the whole way through instead of animating toward the wrong spot then snapping.
  useEffect(() => {
    if (phase !== "face" || !cur) return;
    const canvas = liveCanvasRef.current;
    const img = imgCacheRef.current.get(cur.id);
    if (!canvas || !img) return;
    let raf = 0;
    let warned = false;
    const draw = () => {
      try {
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        // fall back to the parent box if clientWidth/Height read 0 on an early frame
        const rect = canvas.getBoundingClientRect();
        const w = Math.round((canvas.clientWidth || rect.width) * dpr);
        const h = Math.round((canvas.clientHeight || rect.height) * dpr);
        if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; }
        if (canvas.width && canvas.height) {
          const ctx = canvas.getContext("2d")!;
          // opaque backdrop — otherwise transparent pixels in a background-removed photo would
          // let whatever's behind the canvas show through
          ctx.fillStyle = BG_COLOR;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // a failed/undecoded image has naturalWidth 0 — drawing that would leave the canvas
          // blank behind the opaque fill above rather than crashing, so skip it explicitly
          if (img.naturalWidth > 0 && img.naturalHeight > 0) {
            const marginX = canvas.width * 0.12;
            const localT = performance.now() - faceStartRef.current;
            if (localT < SCAN_HOLD_MS) {
              drawContain(ctx, img, marginX, 0, canvas.width - marginX * 2, canvas.height);
            } else {
              const revealT = localT - SCAN_HOLD_MS;
              const faceTop = canvas.height * 0.10;
              const faceH = canvas.height * 0.36;
              const zt = 1 - Math.pow(1 - Math.min(1, revealT / ZOOM_MS), 3);
              const by = lerp(0, faceTop, zt);
              const bh = lerp(canvas.height, faceH, zt);
              // drawContain, not drawCover — keeps the whole face visible instead of cropping
              // top/chin against a band whose aspect ratio doesn't match the source photo
              drawContain(ctx, img, marginX, by, canvas.width - marginX * 2, bh);
            }
          } else if (!warned) {
            warned = true;
            console.warn("Studio: image failed to decode for", cur.name, cur.id);
          }
        }
      } catch (err) {
        if (!warned) { warned = true; console.error("Studio live-preview draw failed:", err); }
      }
      raf = requestAnimationFrame(draw);
    };
    if (img.complete) raf = requestAnimationFrame(draw);
    else {
      img.onload = () => { raf = requestAnimationFrame(draw); };
      img.onerror = () => console.error("Studio: image failed to load for", cur.name, cur.id);
    }
    return () => cancelAnimationFrame(raf);
  }, [cur, phase]);

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px 80px" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      <canvas ref={recCanvasRef} style={{ display: "none" }} />

      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>Content Studio</h1>
      <p style={{ color: "#9aa", fontSize: 14, marginBottom: 24 }}>
        Internal tool — batch-scan faces and play a screen-recordable reveal. Curate photos
        (front-facing, well-lit). Keep captions about ratios, not drug prescriptions on named people.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr min(405px,90vw)", gap: 32, alignItems: "start" }}>
        {/* ── left: inputs ── */}
        <div>
          <label
            style={{ display: "block", border: "1.5px dashed rgba(255,255,255,0.2)", borderRadius: 14,
              padding: "26px 18px", textAlign: "center", cursor: "pointer", color: "#cde", marginBottom: 18 }}
          >
            <input type="file" accept="image/*" multiple style={{ display: "none" }}
              onChange={(e) => { addFiles(e.target.files); e.currentTarget.value = ""; }} />
            + Add photos (select many at once)
          </label>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: "#9aa" }}>Hook line (shown on intro card)</label>
            <input value={hook} onChange={(e) => setHook(e.target.value)}
              style={{ width: "100%", padding: "9px 11px", borderRadius: 9, marginTop: 4,
                background: "#17171b", border: "1px solid rgba(255,255,255,0.12)", color: "#fff" }} />
          </div>

          {items.length > 1 && (
            <p style={{ fontSize: 11, color: "#667", marginTop: 4 }}>Use ▲▼ to set play order</p>
          )}
          {items.map((it, idx) => (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <button onClick={() => moveItem(it.id, -1)} disabled={idx === 0}
                  style={{ color: idx === 0 ? "#444" : "#9aa", background: "none", border: "none",
                    cursor: idx === 0 ? "default" : "pointer", fontSize: 11, lineHeight: 1, padding: 2 }}>▲</button>
                <button onClick={() => moveItem(it.id, 1)} disabled={idx === items.length - 1}
                  style={{ color: idx === items.length - 1 ? "#444" : "#9aa", background: "none", border: "none",
                    cursor: idx === items.length - 1 ? "default" : "pointer", fontSize: 11, lineHeight: 1, padding: 2 }}>▼</button>
              </div>
              {it.dataUrl
                ? <img src={it.dataUrl} alt="" style={{ width: 42, height: 42, borderRadius: 8, objectFit: "cover" }} />
                : <div style={{ width: 42, height: 42, borderRadius: 8, background: "#222" }} />}
              <input value={it.name} onChange={(e) => setName(it.id, e.target.value)}
                style={{ flex: 1, padding: "6px 9px", borderRadius: 7, background: "#17171b",
                  border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13 }} />
              <span style={{ fontSize: 13, width: 74, textAlign: "right", color: it.status === "error" ? "#f88" : "#6ee7b7" }}>
                {it.status === "scanning" ? "scanning…"
                  : it.status === "done" ? `${remapForContent(it.result!.overall).toFixed(1)} · ${tierFor(remapForContent(it.result!.overall))}`
                  : it.status === "error" ? "no face" : "—"}
              </span>
              <button onClick={() => remove(it.id)} style={{ color: "#888", background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
          ))}

          {done.length > 0 && (
            <div style={{ marginTop: 22, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {!playing
                ? <button onClick={play} style={btn}>▶ Play reveal ({done.length})</button>
                : <button onClick={stop} style={{ ...btn, background: "#3a1d1d", color: "#f88" }}>■ Stop</button>}
              {!generating
                ? <button onClick={generateVideo} disabled={playing} style={{ ...btn, background: "#1a2e24", color: "#6ee7b7", border: "1px solid rgba(110,231,183,0.35)", opacity: playing ? 0.5 : 1 }}>
                    🎬 Generate video (.mp4)
                  </button>
                : <button disabled style={{ ...btn, background: "#1a2e24", color: "#6ee7b7", opacity: 0.7 }}>Generating… {genProgress}%</button>}
              <button onClick={clearSession} style={{ ...btn, background: "#1c1c22", color: "#cde", border: "1px solid rgba(255,255,255,0.12)" }}>
                Next video (clear these, keep leaderboard)
              </button>
            </div>
          )}
          {done.length > 0 && (
            <p style={{ fontSize: 12, color: "#788", marginTop: 12, lineHeight: 1.5 }}>
              "Generate video" renders every frame directly to an .mp4 and saves it automatically
              — no screen-recorder, no permission prompt, no live playback needed (takes a few
              seconds, not the full video length).
              The ending board is your all-time top 10, not just today's photos.
              Watch <b>scan sessions</b> after posting, not views.
            </p>
          )}

          {pool.length > 0 && (
            <div style={{ marginTop: 28, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "#9aa" }}>All-time leaderboard · {pool.length} scanned</span>
                <button onClick={clearPool} style={{ fontSize: 11, color: "#a66", background: "none", border: "none", cursor: "pointer" }}>reset all-time</button>
              </div>
              {boardRanked.map((it, i) => (
                <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", fontSize: 12, color: "#cde" }}>
                  <span style={{ width: 16, color: "#6ee7b7", fontWeight: 700 }}>{i + 1}</span>
                  <img src={it.thumb} alt="" style={{ width: 26, height: 26, borderRadius: 6, objectFit: "cover" }} />
                  <span style={{ flex: 1 }}>{it.name}</span>
                  <span style={{ color: "#6ee7b7", fontWeight: 700 }}>{it.score.toFixed(1)}</span>
                  <button onClick={() => removeFromPool(it.id)} style={{ color: "#666", background: "none", border: "none", cursor: "pointer", fontSize: 11 }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── right: the 9:16 stage ── */}
        <div style={{ position: "sticky", top: 20, display: "flex", justifyContent: "center" }}>
          <div style={stage}>
            {phase === "hook" && (
              <div style={{ position: "relative", padding: 30 }}>
                {/* quick radial flash burst on frame one — grabs attention before the text even lands */}
                <div style={{
                  position: "absolute", inset: -60, borderRadius: "50%", pointerEvents: "none",
                  background: `radial-gradient(circle, rgba(${VIDEO_GLOW_RGB},0.55) 0%, rgba(${VIDEO_GLOW_RGB},0) 70%)`,
                  animation: "hookFlash 320ms ease-out both",
                }} />
                <div style={{
                  position: "relative", fontSize: 12, letterSpacing: 4, color: VIDEO_GREEN, marginBottom: 18,
                  fontFamily: "monospace", animation: "tagIn 220ms ease-out both", animationDelay: "0.04s",
                }}>
                  sourcestack.app
                </div>
                <div style={{
                  position: "relative", fontSize: 27, fontWeight: 800, lineHeight: 1.2, color: VIDEO_INK,
                  width: "70%", margin: "0 auto", animation: "headPop 460ms ease-out both", animationDelay: "0.12s",
                }}>{hook}</div>
                <div style={{
                  position: "relative", height: 2, background: VIDEO_GREEN, margin: "22px auto 0",
                  animation: "barGrow 260ms ease-out both", animationDelay: "0.42s",
                }} />
                {!playing && done.length > 0 && (
                  <div style={{ fontSize: 13, color: VIDEO_GREEN, marginTop: 24 }}>▶ press Play to run the reveal</div>
                )}
                {!playing && done.length === 0 && (
                  <div style={{ fontSize: 13, color: "#556", marginTop: 24 }}>add photos to begin</div>
                )}
              </div>
            )}

            {phase === "face" && cur && (
              <div key={cur.id} style={{ position: "absolute", inset: 0, animation: "faceIn 260ms ease" }}>
                {/* single continuously-redrawn canvas (not <img objectFit>) — handles the full-screen
                    "contain" scan view AND the zoom into the focus-centered crop, using the same
                    drawCover() math as the real video. Recomputed fresh every frame from the current
                    box, so the zoom lands on the face the whole way through, never wrong-then-snap. */}
                {/* canvas is a "replaced element" with an intrinsic 300x150 default — position:absolute;inset:0
                    alone does NOT stretch it like a div; needs explicit width/height too, or it silently
                    stays at 300x150 and everything drawn into it (and its CSS box measurements) is wrong */}
                <canvas ref={liveCanvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                {!revealed && (
                  <>
                    <div style={{
                      position: "absolute", left: 0, right: 0, height: 2,
                      background: `linear-gradient(90deg, transparent, rgba(${VIDEO_GLOW_RGB},0.95), transparent)`,
                      boxShadow: `0 0 14px 2px rgba(${VIDEO_GLOW_RGB},0.55)`,
                      animation: `scanSweep ${ZOOM_MS}ms linear`,
                    }} />
                    <div style={{
                      position: "absolute", top: 22, left: 0, right: 0, textAlign: "center",
                      fontSize: 11, letterSpacing: 3, color: "#3ED8C3", fontFamily: "monospace", textTransform: "uppercase",
                    }}>
                      scanning {cur.name}
                    </div>
                  </>
                )}
                {revealed && (
                  <div style={{
                    position: "absolute", top: "46%", left: 0, right: 0, bottom: 0,
                    padding: "10px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-start",
                  }}>
                    <div style={{ fontSize: 19, fontWeight: 700, color: VIDEO_INK, animation: "sfade .5s ease both" }}>{cur.name}</div>
                    <div style={{
                      display: "flex", alignItems: "baseline", gap: 8, justifyContent: "center", margin: "4px 0",
                      animation: "sfade .5s ease both", animationDelay: `${SCORE_DELAY_MS / 1000}s`,
                    }}>
                      <span style={{ fontSize: 52, fontWeight: 900, color: colorForScore(score), lineHeight: 1 }}>{score.toFixed(1)}</span>
                      <span style={{ fontSize: 15, color: "#777" }}>/ 10</span>
                    </div>
                    {(() => {
                      const cats = categoryScores(cur.result!);
                      return (
                        <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                          {cats.map((c, ci) => (
                            <div key={c.label} style={{
                              display: "flex", justifyContent: "space-between", padding: "0 12%", fontSize: 11,
                              animation: "sfade .4s ease both", animationDelay: `${(CAT_DELAY_MS + ci * CAT_STAGGER_MS) / 1000}s`,
                            }}>
                              <span style={{ color: "#444", fontWeight: 600 }}>{c.label}</span>
                              <span style={{ color: colorForScore(c.score), fontWeight: 800 }}>{c.score.toFixed(1)}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {phase === "board" && (
              <div style={{ position: "absolute", inset: 0, padding: "34px 20px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 14, marginBottom: 20 }}>Leaderboard</div>
                {/* no bottom CTA text — rows use that freed space and run further down the screen */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14, overflow: "hidden" }}>
                  {boardRanked.map((it, i) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12,
                      background: i === 0 ? `rgba(${VIDEO_GLOW_RGB},0.18)` : "rgba(0,0,0,0.04)",
                      borderRadius: 10, padding: "10px 12%", paddingLeft: 12,
                      animation: `sfade .4s ease both`, animationDelay: `${i * 0.14}s` }}>
                      <span style={{ width: 22, fontWeight: 800, color: VIDEO_GREEN, fontSize: 15 }}>{i + 1}</span>
                      <img src={it.thumb} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover" }} />
                      <span style={{ flex: 1, textAlign: "left", fontSize: 16, fontWeight: 600 }}>{it.name}</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: colorForScore(it.score) }}>{it.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes faceIn{from{opacity:0}to{opacity:1}}
        @keyframes scanSweep{0%{top:-4%}100%{top:104%}}
        @keyframes hookFlash{0%{opacity:1;transform:scale(.4)}100%{opacity:0;transform:scale(1.7)}}
        @keyframes tagIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes headPop{0%{opacity:0;transform:scale(.55)}60%{opacity:1;transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
        @keyframes barGrow{from{width:0;opacity:0}to{width:46px;opacity:1}}
      `}</style>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "#6ee7b7", color: "#062", fontWeight: 700, border: "none",
  padding: "11px 20px", borderRadius: 10, cursor: "pointer", fontSize: 15,
};
