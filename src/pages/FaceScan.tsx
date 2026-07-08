import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { issues } from "../data/issues";
import SEO from "../components/SEO";
import { analyzeFace, loadFaceLandmarker, type ScanResult } from "../lib/faceScan";

const MAX_DIM = 1100;

// issues the camera can't measure — user self-reports
const SELF_REPORT: { slug: string; label: string }[] = [
  { slug: "skin-clarity", label: "Acne / breakouts" },
  { slug: "hair-loss", label: "Hairline / thinning" },
  { slug: "dark-circles", label: "Dark circles" },
  { slug: "under-eye-hollows", label: "Under-eye hollows" },
  { slug: "oily-skin", label: "Oily skin" },
  { slug: "skin-texture", label: "Rough texture" },
  { slug: "hyperpigmentation", label: "Dark spots" },
  { slug: "beard-growth", label: "Patchy beard" },
  { slug: "eyelash-growth", label: "Sparse lashes" },
  { slug: "dandruff", label: "Dandruff" },
];

function scoreColor(s: number): string {
  if (s >= 8) return "#34d399";
  if (s >= 6.5) return "#a3e635";
  if (s >= 5) return "#fbbf24";
  return "#f87171";
}

export default function FaceScan() {
  const [state, setState] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selfReported, setSelfReported] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // warm the model while the user picks a photo
  useEffect(() => {
    loadFaceLandmarker().catch(() => {});
  }, []);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setState("analyzing");
    setError("");
    setSelfReported([]);
    try {
      const img = await fileToImage(file);
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
        setError("No face detected. Use a clear, front-facing photo with good lighting.");
        setState("error");
        return;
      }

      const scan = analyzeFace(detection.faceLandmarks[0], w, h);
      drawOverlay(ctx, scan, w);
      setResult(scan);
      setState("done");
    } catch (e) {
      console.error(e);
      setError("Analysis failed to load. Check your connection and try again.");
      setState("error");
    }
  };

  const fileToImage = (file: File): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });

  const drawOverlay = (
    ctx: CanvasRenderingContext2D,
    scan: ScanResult,
    w: number
  ) => {
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

    // thirds — horizontal guides across the face
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

    // widths
    line(o.rCheek, o.lCheek, faint);
    line(o.rGonion, o.lGonion, accent);
    // canthal tilt
    line(o.rEyeOuter, o.rEyeInner, accent);
    line(o.lEyeInner, o.lEyeOuter, accent);
    // brows
    line(o.rBrowMedial, o.rBrowTail, faint);
    line(o.lBrowMedial, o.lBrowTail, faint);
  };

  // issues: from weak metrics + self-reported
  const metricIssueSlugs = result
    ? [...new Set(result.metrics.filter((m) => m.score < 7).flatMap((m) => m.issueSlugs))]
    : [];
  const allIssueSlugs = [...new Set([...metricIssueSlugs, ...selfReported])];
  const matchedIssues = allIssueSlugs
    .map((slug) => issues.find((i) => i.slug === slug))
    .filter(Boolean) as typeof issues;
  const stackSlugs = [...new Set(matchedIssues.flatMap((i) => i.treatmentSlugs.slice(0, 2)))].slice(0, 10);

  const weakest = result
    ? [...result.metrics].sort((a, b) => a.score - b.score).slice(0, 3).filter((m) => m.score < 7)
    : [];

  const reset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setSelfReported([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Face Scan — Photo to Protocol"
        description="Upload a photo, get your facial ratios measured against ideal ranges — canthal tilt, fWHR, jaw taper, symmetry and more — then a protocol targeting your weakest points. Runs 100% in your browser."
        path="/scan"
      />
      <div className="px-6 pt-12 pb-24 max-w-4xl mx-auto">
        {/* ── Upload / idle ── */}
        {(state === "idle" || state === "error" || state === "analyzing") && (
          <div className="max-w-xl mx-auto">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Face Scan</p>
            <h1 className="text-3xl font-bold text-white mb-2">Photo → protocol.</h1>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              One front-facing photo. We measure 12 facial ratios against ideal ranges —
              canthal tilt, fWHR, jaw taper, thirds, symmetry — then build a protocol
              targeting your weakest points.
            </p>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const f = e.dataTransfer.files?.[0];
                if (f) handleFile(f);
              }}
              onClick={() => state !== "analyzing" && fileInputRef.current?.click()}
              className={`rounded-2xl border-2 border-dashed px-8 py-14 text-center cursor-pointer transition-colors ${
                dragOver ? "border-emerald-400/60 bg-emerald-400/[0.04]" : "border-white/15 bg-white/[0.02] hover:border-white/30"
              }`}
            >
              {state === "analyzing" ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <p className="text-white/50 text-sm">Measuring ratios…</p>
                </div>
              ) : (
                <>
                  <p className="text-white text-sm font-medium mb-1">Drop a photo or tap to upload</p>
                  <p className="text-white/30 text-xs">Front-facing, good lighting, neutral expression, hair off the face</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {state === "error" && (
              <p className="mt-4 text-red-400/80 text-sm text-center">{error}</p>
            )}

            <div className="mt-6 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/15">
              <span className="text-emerald-400 text-sm leading-none mt-0.5">●</span>
              <p className="text-white/50 text-xs leading-relaxed">
                <span className="text-emerald-400/90 font-medium">100% private.</span>{" "}
                Analysis runs in your browser. Your photo is never uploaded, stored, or sent anywhere.
              </p>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        <div className={state === "done" ? "" : "hidden"}>
          <div className="grid md:grid-cols-[minmax(0,340px)_1fr] gap-8 items-start">
            {/* Photo + overlay */}
            <div className="md:sticky md:top-20">
              <canvas ref={canvasRef} className="w-full rounded-2xl border border-white/10" />
              <button
                onClick={reset}
                className="mt-3 w-full py-2.5 border border-white/10 text-white/40 text-xs rounded-xl hover:border-white/25 hover:text-white/70 transition-colors"
              >
                Scan a different photo
              </button>
            </div>

            {result && (
              <div>
                {/* Score hero */}
                <div className="flex items-end gap-4 mb-1">
                  <span className="text-6xl font-bold text-white leading-none tracking-tight">
                    {result.overall.toFixed(1)}
                  </span>
                  <span className="text-white/30 text-lg mb-1">/ 10</span>
                </div>
                <p className="text-sm mb-4" style={{ color: scoreColor(result.overall) }}>
                  {result.tier}
                </p>

                {result.warnings.map((w) => (
                  <p key={w} className="text-amber-400/70 text-xs mb-2">⚠ {w}</p>
                ))}

                {/* Metric grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-6 mb-10">
                  {result.metrics.map((m) => (
                    <div key={m.id} className="px-3.5 py-3 rounded-xl bg-white/[0.03] border border-white/10">
                      <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">{m.name}</p>
                      <div className="flex items-baseline justify-between">
                        <span className="text-white text-lg font-semibold">{m.display}</span>
                        <span className="text-xs font-medium" style={{ color: scoreColor(m.score) }}>
                          {m.score.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-2 h-[3px] bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${m.score * 10}%`, background: scoreColor(m.score) }}
                        />
                      </div>
                      <p className="text-white/25 text-[10px] mt-1.5">ideal {m.ideal}</p>
                    </div>
                  ))}
                </div>

                {/* Weakest points */}
                {weakest.length > 0 && (
                  <div className="mb-10">
                    <h2 className="text-white font-semibold text-sm mb-3">Your levers, ranked</h2>
                    <div className="flex flex-col gap-2.5">
                      {weakest.map((m, i) => (
                        <div key={m.id} className="px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                          <p className="text-white text-sm font-medium">
                            <span className="text-white/30 mr-2">#{i + 1}</span>
                            {m.name} — {m.display}
                          </p>
                          <p className="text-white/40 text-xs mt-1 leading-relaxed">{m.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Self report */}
                <div className="mb-10">
                  <h2 className="text-white font-semibold text-sm mb-1">What the camera can't see</h2>
                  <p className="text-white/30 text-xs mb-3">Tap anything you're dealing with — it gets added to your protocol.</p>
                  <div className="flex flex-wrap gap-2">
                    {SELF_REPORT.map(({ slug, label }) => {
                      const on = selfReported.includes(slug);
                      return (
                        <button
                          key={slug}
                          onClick={() =>
                            setSelfReported((prev) =>
                              on ? prev.filter((s) => s !== slug) : [...prev, slug]
                            )
                          }
                          className={`px-3.5 py-2 rounded-full text-xs border transition-colors ${
                            on
                              ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                              : "border-white/10 bg-white/[0.02] text-white/40 hover:border-white/25"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Protocol */}
                {matchedIssues.length > 0 && (
                  <div>
                    <h2 className="text-white font-semibold text-sm mb-3">
                      Your protocol targets — {matchedIssues.length} issue{matchedIssues.length > 1 ? "s" : ""}
                    </h2>
                    <div className="flex flex-col gap-2.5 mb-6">
                      {matchedIssues.map((issue) => (
                        <Link
                          key={issue.slug}
                          to={`/issues/${issue.slug}`}
                          className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-colors group"
                        >
                          <div>
                            <p className="text-white text-sm font-medium">{issue.name}</p>
                            <p className="text-white/30 text-xs mt-0.5">
                              {issue.treatmentSlugs.length} treatment option{issue.treatmentSlugs.length > 1 ? "s" : ""}
                            </p>
                          </div>
                          <span className="text-white/20 group-hover:text-white/50 text-sm transition-colors">→</span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to={`/stack?t=${stackSlugs.join(",")}`}
                      className="block w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors text-center"
                    >
                      Build my full protocol →
                    </Link>
                  </div>
                )}

                <p className="text-white/20 text-[11px] mt-8 leading-relaxed">
                  Ratios are estimated from a single 2D photo — lighting, lens distance, and angle all
                  shift results. Not medical advice. Structural metrics describe geometry, not worth.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
