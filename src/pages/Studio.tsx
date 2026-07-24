// Studio — batch face-scan content generator (internal tool, unlinked route).
// Drop N photos → scans each with the real engine → plays a vertical,
// screen-recordable reveal (hook → per-face score count-up → leaderboard → CTA).
// Not for public users; no nav link. See scan-content-scripts.md.

import { useState, useRef, useCallback, useEffect } from "react";
import { analyzeFace, loadFaceLandmarker, tierFor, type ScanResult, type ScanMetric } from "../lib/faceScan";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";

const MAX_DIM = 1100;
const POOL_KEY = "studio_alltime_leaderboard";

// worst-scoring metrics — the "flaws" called out per face in the reveal
function worstMetrics(result: ScanResult, n = 2): ScanMetric[] {
  return [...result.metrics].sort((a, b) => a.score - b.score).slice(0, n);
}

// first treatment tied to the single worst actionable (has an issue mapping) metric
function recommendedProduct(result: ScanResult): { treatment: string; forFlaw: string } | null {
  const worst = [...result.metrics].sort((a, b) => a.score - b.score);
  for (const m of worst) {
    for (const slug of m.issueSlugs) {
      const issue = issues.find((i) => i.slug === slug);
      const treatSlug = issue?.treatmentSlugs[0];
      const treatment = treatments.find((t) => t.slug === treatSlug);
      if (treatment) return { treatment: treatment.name, forFlaw: m.name };
    }
  }
  return null;
}

// content-only score remap: same underlying engine/analysis, just a wider, slightly
// less harsh display curve for leaderboard content. Does NOT touch the live /scan product.
function remapForContent(raw: number): number {
  const center = 5.5; // empirical midpoint of raw scores on real photos
  const mapped = center + 0.5 + (raw - center) * 2.15;
  return Math.max(3.5, Math.min(9.0, mapped));
}

// bright red (2.0) → dark green (9.0) heat color for on-screen score displays
function colorForScore(v: number): string {
  const t = Math.max(0, Math.min(1, (v - 2) / 7));
  const hue = t * 120;
  const light = 58 - t * 20;
  return `hsl(${hue.toFixed(0)}, 82%, ${light.toFixed(0)}%)`;
}

type Item = {
  id: string;
  name: string;
  status: "pending" | "scanning" | "done" | "error";
  dataUrl?: string; // photo with overlay drawn, cropped square-ish for cards
  result?: ScanResult;
  error?: string;
};

// all-time leaderboard entry — persisted to localStorage so it survives across videos/reloads
type PoolItem = { id: string; name: string; thumb: string; score: number; tier: string; ts: number };

function makeThumb(canvas: HTMLCanvasElement, maxDim = 220): string {
  const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
  const w = Math.round(canvas.width * scale);
  const h = Math.round(canvas.height * scale);
  const small = document.createElement("canvas");
  small.width = w;
  small.height = h;
  small.getContext("2d")!.drawImage(canvas, 0, 0, w, h);
  return small.toDataURL("image/jpeg", 0.8);
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
  const run = useCallback((target: number, ms = 1100) => {
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

  const done = items.filter((i) => i.status === "done" && i.result);
  const ranked = [...done].sort((a, b) => (b.result!.overall - a.result!.overall));

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
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const thumb = makeThumb(canvas);
      const contentScore = remapForContent(scan.overall);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "done", result: scan, dataUrl } : p)));
      setPool((prev) => [...prev, { id: it.id, name: it.name, thumb, score: contentScore, tier: tierFor(contentScore), ts: Date.now() }]);
    } catch (e) {
      console.error(e);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "error", error: "Scan failed" } : p)));
    }
  };

  const setName = (id: string, name: string) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    setPool((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
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
    if (ranked.length === 0) return;
    clearTimers();
    setPlaying(true);
    setPhase("hook");
    setFaceIdx(0);
    setScore(0);

    const HOOK = 2200;
    const SCAN_HOLD = 950; // full-screen "scanning" moment before zooming out to the read-out
    const FACE = 4900;
    at(HOOK, () => stepFace(0));

    function stepFace(i: number) {
      if (i >= ranked.length) { showBoard(); return; }
      setPhase("face");
      setFaceIdx(i);
      setScore(0);
      setRevealed(false);
      at(SCAN_HOLD, () => {
        setRevealed(true);
        timers.current.push(window.setTimeout(() => runCount(remapForContent(ranked[i].result!.overall)), 200));
      });
      at(FACE, () => stepFace(i + 1));
    }
    function showBoard() {
      setPhase("board");
    }
  };

  const stop = () => { clearTimers(); setPlaying(false); setPhase("hook"); setRevealed(false); };

  // ── styles ──
  const stage: React.CSSProperties = {
    position: "relative", width: "min(405px, 90vw)", aspectRatio: "9 / 16",
    background: "#000",
    borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)",
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    textAlign: "center", color: "#fff", fontFamily: "inherit",
  };
  const cur = ranked[faceIdx];

  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px 80px" }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

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

          {items.map((it) => (
            <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
              borderTop: "1px solid rgba(255,255,255,0.06)" }}>
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
              <button onClick={clearSession} style={{ ...btn, background: "#1c1c22", color: "#cde", border: "1px solid rgba(255,255,255,0.12)" }}>
                Next video (clear these, keep leaderboard)
              </button>
            </div>
          )}
          {done.length > 0 && (
            <p style={{ fontSize: 12, color: "#788", marginTop: 12, lineHeight: 1.5 }}>
              Press Play, then screen-record the vertical stage → post to TikTok/Reels/Shorts.
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
              <div style={{ padding: 30, animation: "sfade .5s ease both" }}>
                <div style={{ fontSize: 12, letterSpacing: 4, color: "#6ee7b7", marginBottom: 18, fontFamily: "monospace" }}>
                  SOURCESTACK · AI FACE SCAN
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.2, color: "#fff" }}>{hook}</div>
                <div style={{ width: 46, height: 2, background: "#6ee7b7", margin: "22px auto 0" }} />
                {!playing && done.length > 0 && (
                  <div style={{ fontSize: 13, color: "#5c8", marginTop: 24 }}>▶ press Play to run the reveal</div>
                )}
                {!playing && done.length === 0 && (
                  <div style={{ fontSize: 13, color: "#556", marginTop: 24 }}>add photos to begin</div>
                )}
              </div>
            )}

            {phase === "face" && cur && (
              <div key={cur.id} style={{ position: "absolute", inset: 0, animation: "faceIn 260ms ease" }}>
                <img
                  src={cur.dataUrl} alt=""
                  style={{
                    position: "absolute", top: 0, left: 0, width: "100%",
                    height: revealed ? "44%" : "100%",
                    objectFit: "cover",
                    filter: revealed ? "none" : "contrast(1.08) saturate(0.85)",
                    transition: "height 750ms cubic-bezier(0.22,1,0.36,1), filter 750ms ease",
                  }}
                />
                {!revealed && (
                  <>
                    <div style={{
                      position: "absolute", left: 0, right: 0, height: 2,
                      background: "linear-gradient(90deg, transparent, rgba(110,231,183,0.95), transparent)",
                      boxShadow: "0 0 14px 2px rgba(110,231,183,0.55)",
                      animation: "scanSweep 950ms linear",
                    }} />
                    <div style={{
                      position: "absolute", top: 22, left: 0, right: 0, textAlign: "center",
                      fontSize: 11, letterSpacing: 3, color: "#6ee7b7", fontFamily: "monospace", textTransform: "uppercase",
                    }}>
                      scanning {cur.name}
                    </div>
                  </>
                )}
                {revealed && (
                  <div style={{
                    position: "absolute", top: "44%", left: 0, right: 0, bottom: 0,
                    padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "center",
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 700, animation: "sfade .5s ease both" }}>{cur.name}</div>
                    <div style={{
                      display: "flex", alignItems: "baseline", gap: 10, justifyContent: "center", margin: "6px 0",
                      animation: "sfade .5s ease both", animationDelay: "0.12s",
                    }}>
                      <span style={{ fontSize: 64, fontWeight: 900, color: colorForScore(score), lineHeight: 1 }}>{score.toFixed(1)}</span>
                      <span style={{ fontSize: 18, color: "#9aa" }}>/ 10</span>
                    </div>
                    <div style={{ fontSize: 14, color: "#cde", animation: "sfade .5s ease both", animationDelay: "0.22s" }}>
                      {tierFor(remapForContent(cur.result!.overall))}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
                      {worstMetrics(cur.result!, 2).map((m, mi) => (
                        <span key={m.id} style={{ ...flawPill, animation: "sfade .4s ease both", animationDelay: `${0.34 + mi * 0.1}s` }}>
                          {m.name} {m.score.toFixed(1)}
                        </span>
                      ))}
                    </div>
                    {(() => {
                      const rec = recommendedProduct(cur.result!);
                      return rec ? (
                        <div style={{
                          fontSize: 13, color: "#6ee7b7", fontWeight: 700, marginTop: 12,
                          animation: "sfade .5s ease both", animationDelay: "0.5s",
                        }}>
                          Fix: {rec.treatment}
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>
            )}

            {phase === "board" && (
              <div style={{ position: "absolute", inset: 0, padding: "34px 20px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Top 10 — All Time</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
                  {boardRanked.map((it, i) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10,
                      background: i === 0 ? "rgba(110,231,183,0.12)" : "rgba(255,255,255,0.04)",
                      borderRadius: 10, padding: "7px 10px",
                      animation: `sfade .4s ease both`, animationDelay: `${i * 0.22}s` }}>
                      <span style={{ width: 20, fontWeight: 800, color: "#6ee7b7" }}>{i + 1}</span>
                      <img src={it.thumb} alt="" style={{ width: 34, height: 34, borderRadius: 7, objectFit: "cover" }} />
                      <span style={{ flex: 1, textAlign: "left", fontSize: 15, fontWeight: 600 }}>{it.name}</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: colorForScore(it.score) }}>{it.score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: "auto", paddingTop: 14, fontSize: 12, color: "#789" }}>
                  try your scan → sourcestack
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
      `}</style>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "#6ee7b7", color: "#062", fontWeight: 700, border: "none",
  padding: "11px 20px", borderRadius: 10, cursor: "pointer", fontSize: 15,
};
const flawPill: React.CSSProperties = {
  background: "rgba(248,136,136,0.12)", borderRadius: 999, padding: "4px 10px", fontSize: 12, color: "#f88",
};
