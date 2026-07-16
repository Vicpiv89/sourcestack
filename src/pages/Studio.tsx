// Studio — batch face-scan content generator (internal tool, unlinked route).
// Drop N photos → scans each with the real engine → plays a vertical,
// screen-recordable reveal (hook → per-face score count-up → leaderboard → CTA).
// Not for public users; no nav link. See scan-content-scripts.md.

import { useState, useRef, useCallback } from "react";
import { analyzeFace, loadFaceLandmarker, tierFor, type ScanResult } from "../lib/faceScan";

const MAX_DIM = 1100;

type Item = {
  id: string;
  name: string;
  status: "pending" | "scanning" | "done" | "error";
  dataUrl?: string; // photo with overlay drawn, cropped square-ish for cards
  result?: ScanResult;
  error?: string;
};

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

  // reveal player
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<"hook" | "face" | "board" | "cta">("hook");
  const [faceIdx, setFaceIdx] = useState(0);
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
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "done", result: scan, dataUrl } : p)));
    } catch (e) {
      console.error(e);
      setItems((prev) => prev.map((p) => (p.id === it.id ? { ...p, status: "error", error: "Scan failed" } : p)));
    }
  };

  const setName = (id: string, name: string) =>
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
  const remove = (id: string) => setItems((prev) => prev.filter((p) => p.id !== id));

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
    const FACE = 3200;
    at(HOOK, () => stepFace(0));

    function stepFace(i: number) {
      if (i >= ranked.length) { showBoard(); return; }
      setPhase("face");
      setFaceIdx(i);
      setScore(0);
      at(0, () => timers.current.push(window.setTimeout(() => runCount(ranked[i].result!.overall), 500)));
      at(FACE, () => stepFace(i + 1));
    }
    function showBoard() {
      setPhase("board");
      at(Math.min(1200 + ranked.length * 450, 5200), () => setPhase("cta"));
    }
  };

  const stop = () => { clearTimers(); setPlaying(false); setPhase("hook"); };

  // ── styles ──
  const stage: React.CSSProperties = {
    position: "relative", width: "min(405px, 90vw)", aspectRatio: "9 / 16",
    background: "radial-gradient(120% 80% at 50% 0%, #14201b 0%, #0b0b0d 60%)",
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
                  : it.status === "done" ? `${it.result!.overall.toFixed(1)} · ${it.result!.tier}`
                  : it.status === "error" ? "no face" : "—"}
              </span>
              <button onClick={() => remove(it.id)} style={{ color: "#888", background: "none", border: "none", cursor: "pointer" }}>✕</button>
            </div>
          ))}

          {done.length > 0 && (
            <div style={{ marginTop: 22, display: "flex", gap: 10 }}>
              {!playing
                ? <button onClick={play} style={btn}>▶ Play reveal ({done.length})</button>
                : <button onClick={stop} style={{ ...btn, background: "#3a1d1d", color: "#f88" }}>■ Stop</button>}
            </div>
          )}
          {done.length > 0 && (
            <p style={{ fontSize: 12, color: "#788", marginTop: 12, lineHeight: 1.5 }}>
              Press Play, then screen-record the vertical stage → post to TikTok/Reels/Shorts.
              Watch <b>scan sessions</b> after posting, not views.
            </p>
          )}
        </div>

        {/* ── right: the 9:16 stage ── */}
        <div style={{ position: "sticky", top: 20, display: "flex", justifyContent: "center" }}>
          <div style={stage}>
            {phase === "hook" && (
              <div style={{ padding: 26 }}>
                <div style={{ fontSize: 13, letterSpacing: 2, color: "#6ee7b7", marginBottom: 14 }}>SOURCESTACK · FACE SCAN</div>
                <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.15 }}>{hook}</div>
                {!playing && done.length > 0 && (
                  <div style={{ fontSize: 13, color: "#889", marginTop: 20 }}>▶ press Play to run the reveal</div>
                )}
                {!playing && done.length === 0 && (
                  <div style={{ fontSize: 13, color: "#889", marginTop: 20 }}>add photos to begin</div>
                )}
              </div>
            )}

            {phase === "face" && cur && (
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }}>
                <img src={cur.dataUrl} alt="" style={{ width: "100%", height: "62%", objectFit: "cover" }} />
                <div style={{ flex: 1, padding: "14px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{cur.name}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 10, justifyContent: "center", margin: "6px 0" }}>
                    <span style={{ fontSize: 64, fontWeight: 900, color: "#6ee7b7", lineHeight: 1 }}>{score.toFixed(1)}</span>
                    <span style={{ fontSize: 18, color: "#9aa" }}>/ 10</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#cde" }}>{tierFor(cur.result!.overall)}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 10 }}>
                    {[...cur.result!.metrics].sort((a, b) => b.score - a.score).slice(0, 3).map((m) => (
                      <span key={m.id} style={pill}>{m.name} {m.score.toFixed(1)}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {phase === "board" && (
              <div style={{ position: "absolute", inset: 0, padding: "34px 20px", display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>The Leaderboard</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
                  {ranked.map((it, i) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 10,
                      background: i === 0 ? "rgba(110,231,183,0.12)" : "rgba(255,255,255,0.04)",
                      borderRadius: 10, padding: "7px 10px",
                      animation: `sfade .4s ease both`, animationDelay: `${i * 0.28}s` }}>
                      <span style={{ width: 20, fontWeight: 800, color: "#6ee7b7" }}>{i + 1}</span>
                      <img src={it.dataUrl} alt="" style={{ width: 34, height: 34, borderRadius: 7, objectFit: "cover" }} />
                      <span style={{ flex: 1, textAlign: "left", fontSize: 15, fontWeight: 600 }}>{it.name}</span>
                      <span style={{ fontSize: 18, fontWeight: 800, color: "#6ee7b7" }}>{it.result!.overall.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {phase === "cta" && (
              <div style={{ padding: 28 }}>
                <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 12 }}>Scan your own face — free</div>
                <div style={{ fontSize: 16, color: "#cde", marginBottom: 22 }}>14 metrics · nothing uploads · 30 seconds</div>
                <div style={{ display: "inline-block", background: "#6ee7b7", color: "#062", fontWeight: 800,
                  padding: "12px 22px", borderRadius: 999, fontSize: 17 }}>link in bio ↑</div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes sfade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

const btn: React.CSSProperties = {
  background: "#6ee7b7", color: "#062", fontWeight: 700, border: "none",
  padding: "11px 20px", borderRadius: 10, cursor: "pointer", fontSize: 15,
};
const pill: React.CSSProperties = {
  background: "rgba(255,255,255,0.07)", borderRadius: 999, padding: "4px 10px", fontSize: 12, color: "#cde",
};
