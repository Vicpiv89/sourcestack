import { useState, useRef, useEffect, type ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import SEO from "../components/SEO";
import FaceZoneMap from "../components/FaceZoneMap";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";
import { vendors } from "../data/vendors";
import { scoreMatch } from "../data/synonyms";
import { CameraIcon, HairIcon, SparkleIcon, DnaIcon, PillIcon, MicroscopeIcon, GearIcon, TrendUpIcon, AiSparkIcon } from "../components/icons";
import { useReveal } from "../lib/useReveal";

const CATEGORIES = [
  { label: "Hair Loss", slug: "Hair Loss", Icon: HairIcon },
  { label: "Skincare",  slug: "Skincare",  Icon: SparkleIcon },
  { label: "Peptides",  slug: "Peptides",  Icon: DnaIcon },
  { label: "Supplements", slug: "Supplements", Icon: PillIcon },
  { label: "Research",  slug: "Research Compounds", Icon: MicroscopeIcon },
  { label: "Mechanical", slug: "Mechanical", Icon: GearIcon },
];

// counts up on mount — a small "systems reading live data" beat for the hero stat line
function CountUp({ value, duration = 900 }: { value: number; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setN(Math.round((1 - Math.pow(1 - t, 3)) * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{n}</>;
}

// fades/slides a section in the first time it scrolls into view
function Reveal({ children, className = "", delayMs = 0 }: { children: ReactNode; className?: string; delayMs?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const issueResults = query
    ? issues
        .map((i) => ({ item: i, score: scoreMatch({ name: i.name, body: i.description, slugs: i.treatmentSlugs }, query) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4)
        .map((x) => x.item)
    : [];

  const treatmentResults = query
    ? treatments
        .map((t) => ({ item: t, score: scoreMatch({ name: t.name, body: `${t.summary} ${t.category}`, slugs: [t.slug, ...t.issueSlugs] }, query) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((x) => x.item)
    : [];

  const hasResults = issueResults.length > 0 || treatmentResults.length > 0;

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Your Protocol, Sourced"
        description="Search by issue or compound — get vetted protocols, interaction warnings, and trusted vendor sources for hair loss, skincare, peptides, and supplements."
        path="/"
      />

      {/* ── Hero ─────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pt-14 pb-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">

          {/* Left: copy + search */}
          <div className="text-center sm:text-left">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-3">
              <CountUp value={treatments.length} /> compounds · <CountUp value={vendors.length} /> vetted vendors · <CountUp value={issues.length} /> issues
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
              Scanned. Sourced.<br />Fixed.
            </h1>
            <p className="text-white/40 text-sm sm:text-base mb-6 leading-relaxed max-w-sm mx-auto sm:mx-0">
              Random TikToks and sketchy vendors get you the wrong dose and wasted money. SourceStack replaces the guessing with a measured plan — and a vendor you can trust.
            </p>

            {/* Face Scan CTA */}
            <Link
              to="/scan"
              className="group flex items-center justify-between gap-3 w-full mb-6 px-4 py-3.5 bg-white text-black rounded-xl hover:bg-white/90 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CameraIcon size={18} className="shrink-0" />
                <div>
                  <p className="text-sm font-semibold leading-tight">Scan your face — see what to improve</p>
                  <p className="text-black/50 text-[11px] mt-0.5">Free · 100% private · 30 seconds</p>
                </div>
              </div>
              <span className="text-black/40 group-hover:text-black text-sm transition-colors shrink-0">→</span>
            </Link>

            {/* Search */}
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="hair loss, minoxidil, BPC-157, jaw…"
                className="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
              />
              {query && (
                <button
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs"
                >
                  ✕
                </button>
              )}

              {open && query && (
                <div className="absolute top-full mt-1 left-0 right-0 bg-[#191919] border border-white/10 rounded-xl overflow-hidden z-50 shadow-2xl text-left">
                  {!hasResults && (
                    <p className="px-4 py-4 text-white/30 text-sm">No results for "{query}"</p>
                  )}
                  {issueResults.length > 0 && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-white/25">Issues</p>
                      {issueResults.map((r) => (
                        <button
                          key={r.slug}
                          onMouseDown={() => navigate(`/issues/${r.slug}`)}
                          className="w-full text-left px-4 py-3 hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] last:border-0 flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-white text-sm font-medium">{r.name}</p>
                            <p className="text-white/35 text-xs mt-0.5 line-clamp-1">{r.description}</p>
                          </div>
                          <span className="text-white/20 shrink-0 text-xs whitespace-nowrap">{r.treatmentSlugs.length} treatments →</span>
                        </button>
                      ))}
                    </>
                  )}
                  {treatmentResults.length > 0 && (
                    <>
                      <p className="px-4 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-white/25">Compounds</p>
                      {treatmentResults.map((r) => (
                        <button
                          key={r.slug}
                          onMouseDown={() => navigate(`/treatments/${r.slug}`)}
                          className="w-full text-left px-4 py-3 hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] last:border-0 flex items-center justify-between gap-3"
                        >
                          <div>
                            <p className="text-white text-sm font-medium">{r.name}</p>
                            <p className="text-white/35 text-xs mt-0.5">{r.category}</p>
                          </div>
                          <span className="text-white/20 shrink-0 text-xs">Protocol →</span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Quick chips */}
            <div className="flex items-center gap-2 mt-3 flex-wrap justify-center sm:justify-start">
              {["hair loss", "tretinoin", "skin texture", "jaw", "BPC-157"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setQuery(q); setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}
                  className="px-3 py-1 rounded-full border border-white/[0.08] text-xs text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/treatments?category=${encodeURIComponent(cat.slug)}`}
                  className="flex flex-col items-center text-center gap-1.5 px-3 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl hover:border-white/15 transition-colors"
                >
                  <cat.Icon size={16} className="text-white/45" />
                  <span className="text-white/60 text-xs font-medium">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: face zone map — framed like a scanner viewfinder */}
          <div className="relative flex flex-col items-center px-4 pt-4 pb-2">
            <span className="scan-bracket pointer-events-none absolute top-0 left-0 w-6 h-6 border-t border-l border-accent/40 rounded-tl-md" />
            <span className="scan-bracket pointer-events-none absolute top-0 right-0 w-6 h-6 border-t border-r border-accent/40 rounded-tr-md" />
            <span className="scan-bracket pointer-events-none absolute bottom-0 left-0 w-6 h-6 border-b border-l border-accent/40 rounded-bl-md" />
            <span className="scan-bracket pointer-events-none absolute bottom-0 right-0 w-6 h-6 border-b border-r border-accent/40 rounded-br-md" />
            <p className="font-mono text-white/25 text-xs mb-4 text-center uppercase tracking-wider">
              Or tap any zone to explore treatments
            </p>
            <FaceZoneMap maxWidth={300} />
          </div>
        </div>
      </div>

      {/* ── Face Scan promo ───────────────────────────── */}
      <Reveal className="px-4 sm:px-6 pb-4 max-w-5xl mx-auto">
        <Link
          to="/scan"
          className="group flex items-center justify-between gap-4 px-6 py-5 bg-white/[0.04] border border-white/[0.15] rounded-2xl hover:border-white/35 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <CameraIcon size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold text-sm">Face Scan</p>
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-white/60 bg-white/10 px-1.5 py-0.5 rounded-full border border-white/15">New</span>
              </div>
              <p className="text-white/35 text-xs">
                One photo → 17 facial metrics measured → exactly what you need to improve, with the fix for each. Nothing uploaded.
              </p>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white/70 text-sm transition-colors shrink-0">→</span>
        </Link>
      </Reveal>

      {/* ── Progress tracking promo ───────────────────── */}
      <Reveal className="px-4 sm:px-6 pb-4 max-w-5xl mx-auto" delayMs={80}>
        <Link
          to="/scan"
          className="group flex items-center justify-between gap-4 px-6 py-5 bg-white/[0.04] border border-white/[0.15] rounded-2xl hover:border-white/35 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <TrendUpIcon size={16} className="text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold text-sm">Score Tracking</p>
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-accent/60 bg-accent/10 px-1.5 py-0.5 rounded-full border border-accent/15">Pro</span>
              </div>
              <p className="text-white/35 text-xs">
                One scan is a snapshot. Pro saves every scan and charts the trend — so you can actually see the plan working, month over month.
              </p>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white/70 text-sm transition-colors shrink-0">→</span>
        </Link>
      </Reveal>

      {/* ── Protocol AI promo ─────────────────────────── */}
      <Reveal className="px-4 sm:px-6 pb-10 max-w-5xl mx-auto" delayMs={160}>
        <Link
          to="/ai"
          className="group flex items-center justify-between gap-4 px-6 py-5 bg-accent/[0.04] border border-accent/[0.15] rounded-2xl hover:border-accent/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
              <AiSparkIcon size={16} className="text-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold text-sm">Protocol AI</p>
                <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-accent/60 bg-accent/10 px-1.5 py-0.5 rounded-full border border-accent/15">New</span>
              </div>
              <p className="text-white/35 text-xs">
                Describe your goal in plain language — get a full protocol pulled straight from the database.
              </p>
            </div>
          </div>
          <span className="text-accent/40 group-hover:text-accent/70 text-sm transition-colors shrink-0">→</span>
        </Link>
      </Reveal>

      {/* ── Who this is for ───────────────────────────── */}
      <Reveal className="px-4 sm:px-6 pb-16 max-w-5xl mx-auto">
        <div className="border-t border-white/[0.07] pt-12 text-center sm:text-left">
          <p className="font-mono text-white/25 text-[10px] uppercase tracking-widest mb-3">Not for the TikTok-comment crowd</p>
          <p className="text-white text-lg sm:text-xl font-semibold max-w-xl leading-snug mb-3 mx-auto sm:mx-0">
            Anyone can tell you to "just use tretinoin." Almost nobody tells you the dose, the timeline, or which vendor won't sell you chalk.
          </p>
          <p className="text-white/35 text-sm max-w-lg leading-relaxed mx-auto sm:mx-0">
            If you're already spending money on this — compounds, skincare, supplements — SourceStack is where that money stops being a guess.
          </p>
        </div>
      </Reveal>

      {/* ── Stack / Quiz promo ────────────────────────── */}
      <Reveal className="px-4 sm:px-6 pb-24 max-w-5xl mx-auto">
        <div className="border border-white/[0.07] rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-semibold text-sm mb-1">Build your personal stack</p>
            <p className="text-white/35 text-xs max-w-xs mx-auto sm:mx-0">
              Answer 3 questions and get a curated starter protocol — or build your own.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/quiz"
              className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Take the quiz →
            </Link>
            <Link
              to="/stack"
              className="px-4 py-2 border border-white/15 text-white/60 text-xs rounded-lg hover:border-white/30 hover:text-white transition-colors"
            >
              Stack Builder
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
