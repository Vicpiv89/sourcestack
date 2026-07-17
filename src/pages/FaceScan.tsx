import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";
import { useAuth } from "../context/AuthContext";
import UpgradeModal from "../components/UpgradeModal";
import SEO from "../components/SEO";
import { supabase } from "../lib/supabase";
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

// name up to 3 real treatments that fix a set of issues — the tease
function fixNamesFor(issueSlugs: string[]): string[] {
  return [...new Set(issueSlugs.flatMap((s) => issues.find((i) => i.slug === s)?.treatmentSlugs ?? []))]
    .slice(0, 3)
    .map((slug) => treatments.find((t) => t.slug === slug)?.name)
    .filter(Boolean) as string[];
}

export default function FaceScan() {
  const { user, isPro } = useAuth();
  const [state, setState] = useState<"idle" | "analyzing" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [selfReported, setSelfReported] = useState<string[]>([]);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [dragOver, setDragOver] = useState(false);
  const [showAllMetrics, setShowAllMetrics] = useState(false);
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

      // sample skin/brow pixels before the overlay is drawn on top
      const scan = analyzeFace(detection.faceLandmarks[0], w, h, ctx);
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

  // issues: from weak metrics + self-reported (7.5 = anything meaningfully off-ideal flags)
  const metricIssueSlugs = result
    ? [...new Set(result.metrics.filter((m) => m.score < 7.5).flatMap((m) => m.issueSlugs))]
    : [];
  const allIssueSlugs = [...new Set([...metricIssueSlugs, ...selfReported])];
  const matchedIssues = allIssueSlugs
    .map((slug) => issues.find((i) => i.slug === slug))
    .filter(Boolean) as typeof issues;
  const stackSlugs = [...new Set(matchedIssues.flatMap((i) => i.treatmentSlugs.slice(0, 2)))].slice(0, 10);

  const flaggedCount = result ? result.metrics.filter((m) => m.score < 7.5).length : 0;
  const weakest = result
    ? [...result.metrics].sort((a, b) => a.score - b.score).slice(0, 5).filter((m) => m.score < 7.5)
    : [];

  const reset = () => {
    setState("idle");
    setResult(null);
    setError("");
    setSelfReported([]);
    setSaveState("idle");
    setShowAllMetrics(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  async function saveScan() {
    if (!result || !user) return;
    setSaveState("saving");
    const { error: insertError } = await supabase.from("scans").insert({
      user_id: user.id,
      overall: result.overall,
      tier: result.tier,
      metrics: result.metrics.map(({ id, name, display, ideal, score }) => ({ id, name, display, ideal, score })),
      goals: selfReported,
    });
    setSaveState(insertError ? "error" : "saved");
  }

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Face Scan — Photo to Protocol"
        description="Upload a photo, get 17 facial measurements scored — canthal tilt, fWHR, jaw taper, lip ratios, eye shape, symmetry, skin clarity, brow density — then a protocol targeting exactly what you need to improve. Runs 100% in your browser."
        path="/scan"
      />
      <div className="px-6 pt-12 pb-24 max-w-4xl mx-auto">
        {/* ── Upload / idle ── */}
        {(state === "idle" || state === "error" || state === "analyzing") && (
          <div className="max-w-xl mx-auto">
            <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Face Scan</p>
            <h1 className="text-3xl font-bold text-white mb-2">Photo → protocol.</h1>
            <p className="text-white/40 text-sm mb-8 leading-relaxed">
              One front-facing photo. We measure 17 facial metrics — canthal tilt, fWHR,
              jaw taper, lip ratios, eye shape, symmetry, skin clarity, brow density —
              and show you exactly what needs improving, with the fix for each.
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
              {isPro && user ? (
                <button
                  onClick={saveScan}
                  disabled={saveState === "saving" || saveState === "saved"}
                  className="mt-2 w-full py-2.5 bg-white/[0.06] border border-white/15 text-white/70 text-xs rounded-xl hover:border-white/35 hover:text-white transition-colors disabled:opacity-60"
                >
                  {saveState === "saved" ? "✓ Saved to your account" :
                   saveState === "saving" ? "Saving…" :
                   saveState === "error" ? "Save failed — try again" :
                   "Save scan to track progress"}
                </button>
              ) : (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="mt-2 w-full py-2.5 bg-white/[0.04] border border-white/10 text-white/40 text-xs rounded-xl hover:border-white/25 hover:text-white/60 transition-colors"
                >
                  🔒 Save scans & track progress — Pro
                </button>
              )}
              <p className="text-white/20 text-[10px] mt-2 text-center">
                Saves measurements only — never your photo.
              </p>
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
                <p className="text-sm mb-1" style={{ color: scoreColor(result.overall) }}>
                  {result.tier}
                </p>
                <p className="text-white/40 text-xs mb-4">
                  {flaggedCount > 0
                    ? `${flaggedCount} of ${result.metrics.length} metrics flagged for improvement`
                    : `All ${result.metrics.length} metrics in the ideal band — near-perfect scan`}
                </p>

                {result.warnings.map((w) => (
                  <p key={w} className="text-amber-400/70 text-xs mb-2">⚠ {w}</p>
                ))}

                {/* Weakest points — what needs work, ranked */}
                {weakest.length > 0 && (
                  <div className="mt-6 mb-10">
                    <h2 className="text-white font-semibold text-sm mb-1">What you need to improve, ranked</h2>
                    <p className="text-white/30 text-xs mb-3">Each maps to protocol options in the database. Highest impact first.</p>
                    <div className="flex flex-col gap-2.5">
                      {weakest.map((m, i) => {
                        const fixes = fixNamesFor(m.issueSlugs);
                        return (
                          <div key={m.id} className="px-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                            <p className="text-white text-sm font-medium">
                              <span className="text-white/30 mr-2">#{i + 1}</span>
                              {m.name} — {m.display}
                            </p>
                            <p className="text-white/40 text-xs mt-1 leading-relaxed">{m.note}</p>
                            {fixes.length > 0 && (
                              <p className="text-emerald-400/80 text-xs mt-2">
                                Protocol options: {fixes.join(" · ")} — details in your plan ↓
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* The plan — listicle */}
                {matchedIssues.length > 0 ? (
                  <div>
                    <h2 className="text-white font-semibold text-base mb-1">
                      Your plan — {matchedIssues.length} target{matchedIssues.length > 1 ? "s" : ""}
                    </h2>
                    <p className="text-white/30 text-xs mb-4">
                      Built from your scan + your goals. Each one maps to a protocol in the database.
                    </p>
                    <div className="flex flex-col gap-2.5 mb-8">
                      {matchedIssues.map((issue, i) => {
                        const fixNames = issue.treatmentSlugs
                          .slice(0, 3)
                          .map((s) => treatments.find((t) => t.slug === s)?.name)
                          .filter(Boolean);
                        return (
                          <Link
                            key={issue.slug}
                            to={`/issues/${issue.slug}`}
                            className="px-4 py-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/25 transition-colors group block"
                          >
                            <div className="flex items-start gap-3">
                              <span className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/40 text-xs shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-white text-sm font-medium">{issue.name}</p>
                                <p className="text-white/35 text-xs mt-1 leading-relaxed line-clamp-2">
                                  {issue.description.split(". ")[0]}.
                                </p>
                                <p className="text-emerald-400/80 text-xs mt-2">
                                  Protocol options: {fixNames.join(" · ")}
                                  {issue.treatmentSlugs.length > 3 ? ` +${issue.treatmentSlugs.length - 3} more` : ""}
                                </p>
                              </div>
                              <span className="text-white/20 group-hover:text-white/50 text-sm transition-colors shrink-0">→</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Conversion gate / Pro CTA */}
                    {isPro ? (
                      <Link
                        to={`/stack?t=${stackSlugs.join(",")}`}
                        className="block w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors text-center"
                      >
                        Open my full protocol in Stack Builder →
                      </Link>
                    ) : (
                      <div className="relative rounded-2xl border border-white/[0.07] overflow-hidden">
                        {/* Blurred personalized preview */}
                        <div className="pointer-events-none select-none blur-[5px] opacity-25 px-5 pt-5 pb-2 flex flex-col gap-3">
                          <div className="border border-white/10 rounded-xl p-4">
                            <p className="text-amber-400/80 text-xs font-semibold uppercase tracking-widest mb-3">Morning (AM)</p>
                            {stackSlugs.slice(0, 3).map((slug, i) => (
                              <div key={slug} className="flex gap-3 mb-2">
                                <span className="text-white/15 font-mono text-xs w-4">{i + 1}</span>
                                <span className="text-white/60 text-sm">
                                  {treatments.find((t) => t.slug === slug)?.name} — exact dose + timing
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="border border-white/10 rounded-xl p-4">
                            <p className="text-blue-400/80 text-xs font-semibold uppercase tracking-widest mb-2">Evening (PM)</p>
                            <div className="h-9 bg-white/[0.04] rounded-lg" />
                          </div>
                          <div className="border border-white/10 rounded-xl p-4">
                            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">Vetted sources + monthly cost</p>
                            <div className="h-8 bg-white/[0.03] rounded" />
                          </div>
                        </div>

                        {/* Overlay pitch */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/92 to-[#111]/20 flex flex-col items-center justify-end pb-8 px-6 text-center">
                          <span className="inline-block px-2.5 py-0.5 rounded-full border border-white/10 bg-white/5 mb-3">
                            <span className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Pro</span>
                          </span>
                          <p className="text-white text-lg font-bold mb-3 leading-tight">
                            Your scan found the targets.<br />Pro hands you the protocols.
                          </p>
                          <ul className="text-left flex flex-col gap-1.5 mb-5">
                            {[
                              "Step-by-step protocols with AM/PM timing for every target above",
                              "Community-vetted vendor directory — prices + trust notes",
                              "Interaction warnings before you combine compounds",
                              "Monthly cost breakdown — built for a budget",
                            ].map((f) => (
                              <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                                <span className="text-emerald-400 shrink-0">✓</span>{f}
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => setShowUpgrade(true)}
                            className="w-full max-w-xs py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
                          >
                            Unlock my plan — $19/mo →
                          </button>
                          <p className="text-white/25 text-[11px] mt-2.5">
                            Renews monthly, cancel anytime. Cheaper than one wasted vendor order.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-5 py-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
                    <p className="text-white text-sm font-medium mb-1">
                      {weakest.length > 0
                        ? "Your flagged metrics are structural — but that's not the whole picture."
                        : "Near-perfect scan — nothing flagged. That's rare."}
                    </p>
                    <p className="text-white/35 text-xs leading-relaxed">
                      Select what you're working on below, and your plan builds itself.
                    </p>
                  </div>
                )}

                {/* Goal selection — adds to the plan above */}
                <div className="mt-10 mb-10 px-4 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04]">
                  <h2 className="text-white font-semibold text-sm mb-1">What do you want to improve?</h2>
                  <p className="text-white/40 text-xs mb-3.5 leading-relaxed">
                    The scan reads your ratios, skin, and brows — but you know the rest.
                    Select everything you're working on and it's added to your plan.
                  </p>
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
                              ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300 font-medium"
                              : "border-white/15 bg-white/[0.03] text-white/50 hover:border-white/30 hover:text-white/80"
                          }`}
                        >
                          {on ? "✓ " : "+ "}{label}
                        </button>
                      );
                    })}
                  </div>
                  {selfReported.length > 0 && (
                    <p className="text-emerald-400/70 text-xs mt-3">
                      {selfReported.length} goal{selfReported.length > 1 ? "s" : ""} added to your plan ↑
                    </p>
                  )}
                </div>

                {/* Full measurement grid — collapsed by default to keep mobile readable */}
                <div className="mb-2">
                  <button
                    onClick={() => setShowAllMetrics((v) => !v)}
                    className="w-full py-3 rounded-xl border border-white/10 bg-white/[0.02] text-white/50 text-xs hover:border-white/25 hover:text-white/80 transition-colors"
                  >
                    {showAllMetrics ? "Hide" : "See"} all {result.metrics.length} measurements {showAllMetrics ? "↑" : "↓"}
                  </button>
                  {showAllMetrics && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
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
                  )}
                </div>

                <p className="text-white/20 text-[11px] mt-8 leading-relaxed">
                  Ratios are estimated from a single 2D photo — lighting, lens distance, and angle all
                  shift results. For informational and educational purposes only; not medical advice,
                  diagnosis, or treatment. Structural metrics describe geometry, not worth.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
