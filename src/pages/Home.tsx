import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import SEO from "../components/SEO";
import FaceZoneMap from "../components/FaceZoneMap";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";
import { vendors } from "../data/vendors";
import { scoreMatch } from "../data/synonyms";

const CATEGORIES = [
  { label: "Hair Loss", slug: "Hair Loss", emoji: "💈" },
  { label: "Skincare",  slug: "Skincare",  emoji: "✨" },
  { label: "Peptides",  slug: "Peptides",  emoji: "🧬" },
  { label: "Supplements", slug: "Supplements", emoji: "💊" },
  { label: "Research",  slug: "Research Compounds", emoji: "🔬" },
  { label: "Mechanical", slug: "Mechanical", emoji: "⚙️" },
];

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
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3">
              {treatments.length} compounds · {vendors.length} vetted vendors · {issues.length} issues
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3 leading-tight">
              The looksmaxxing<br />protocol database.
            </h1>
            <p className="text-white/40 text-sm sm:text-base mb-8 leading-relaxed max-w-sm">
              Search any issue or compound — get exact dosing protocols, safety notes, and vetted sources. No fluff.
            </p>

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
            <div className="flex items-center gap-2 mt-3 flex-wrap">
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
                  className="flex flex-col gap-1 px-3 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl hover:border-white/15 transition-colors"
                >
                  <span className="text-base">{cat.emoji}</span>
                  <span className="text-white/60 text-xs font-medium">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: face zone map */}
          <div className="flex flex-col items-center">
            <p className="text-white/25 text-xs mb-4 text-center">
              Or tap any zone to explore treatments
            </p>
            <FaceZoneMap maxWidth={300} />
          </div>
        </div>
      </div>

      {/* ── Face Scan promo ───────────────────────────── */}
      <div className="px-4 sm:px-6 pb-4 max-w-5xl mx-auto">
        <Link
          to="/scan"
          className="group flex items-center justify-between gap-4 px-6 py-5 bg-white/[0.04] border border-white/[0.15] rounded-2xl hover:border-white/35 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <span className="text-sm">📷</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold text-sm">Face Scan</p>
                <span className="text-[9px] font-bold tracking-widest uppercase text-white/60 bg-white/10 px-1.5 py-0.5 rounded-full border border-white/15">New</span>
              </div>
              <p className="text-white/35 text-xs">
                One photo → 12 facial ratios measured → your protocol. Runs in your browser, nothing uploaded.
              </p>
            </div>
          </div>
          <span className="text-white/30 group-hover:text-white/70 text-sm transition-colors shrink-0">→</span>
        </Link>
      </div>

      {/* ── Protocol AI promo ─────────────────────────── */}
      <div className="px-4 sm:px-6 pb-10 max-w-5xl mx-auto">
        <Link
          to="/ai"
          className="group flex items-center justify-between gap-4 px-6 py-5 bg-emerald-500/[0.04] border border-emerald-500/[0.15] rounded-2xl hover:border-emerald-500/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-emerald-400">AI</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-white font-semibold text-sm">Protocol AI</p>
                <span className="text-[9px] font-bold tracking-widest uppercase text-emerald-400/60 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/15">New</span>
              </div>
              <p className="text-white/35 text-xs">
                Describe your goal in plain language — get a full protocol pulled straight from the database.
              </p>
            </div>
          </div>
          <span className="text-emerald-400/40 group-hover:text-emerald-400/70 text-sm transition-colors shrink-0">→</span>
        </Link>
      </div>

      {/* ── Stack / Quiz promo ────────────────────────── */}
      <div className="px-4 sm:px-6 pb-24 max-w-5xl mx-auto">
        <div className="border border-white/[0.07] rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-semibold text-sm mb-1">Build your personal stack</p>
            <p className="text-white/35 text-xs max-w-xs">
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
      </div>
    </div>
  );
}
