import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import SEO from "../components/SEO";
import FaceZoneMap from "../components/FaceZoneMap";
import TutorialModal from "../components/TutorialModal";
import AuthModal from "../components/AuthModal";
import { useAuth } from "../context/AuthContext";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";
import { vendors } from "../data/vendors";
import { scoreMatch } from "../data/synonyms";

export default function Home() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) setShowTutorial(true);
  }, [user, loading]);

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
    <>
      <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
        <SEO
          title="Your Protocol, Sourced"
          description="Search by issue or compound — get vetted protocols, interaction warnings, and trusted vendor sources for hair loss, skincare, peptides, and supplements."
          path="/"
        />

        {/* ── Hero ─────────────────────────────────────── */}
        <div className="px-4 sm:px-6 pt-16 pb-10 max-w-2xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3 leading-tight">
            Your protocol, sourced.
          </h1>
          <p className="text-white/40 text-base sm:text-lg mb-10">
            Search any issue or compound — protocols, safety notes, and vetted vendors.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-5 sm:gap-8 mb-10 flex-wrap">
            {([
              [String(treatments.length) + "+", "treatments"],
              [String(vendors.length), "vetted vendors"],
              [String(issues.length), "issues covered"],
            ] as [string, string][]).map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="text-white font-bold text-lg sm:text-xl">{n}</p>
                <p className="text-white/30 text-xs">{l}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              placeholder="Search — hair loss, minoxidil, BPC-157, skin texture…"
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/25 transition-colors"
            />
            {query && (
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs"
              >
                ✕
              </button>
            )}

            {/* Unified results dropdown */}
            {open && query && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-[#191919] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl text-left">
                {!hasResults && (
                  <p className="px-5 py-4 text-white/30 text-sm">No results for "{query}"</p>
                )}
                {issueResults.length > 0 && (
                  <>
                    <p className="px-5 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-white/25">Issues</p>
                    {issueResults.map((r) => (
                      <button
                        key={r.slug}
                        onMouseDown={() => navigate(`/issues/${r.slug}`)}
                        className="w-full text-left px-5 py-3 hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] last:border-0 flex items-center justify-between gap-3"
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
                    <p className="px-5 pt-3 pb-1 text-[10px] font-semibold tracking-widest uppercase text-white/25">Compounds</p>
                    {treatmentResults.map((r) => (
                      <button
                        key={r.slug}
                        onMouseDown={() => navigate(`/treatments/${r.slug}`)}
                        className="w-full text-left px-5 py-3 hover:bg-white/[0.05] transition-colors border-b border-white/[0.04] last:border-0 flex items-center justify-between gap-3"
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
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            {["hair loss", "tretinoin", "skin clarity", "jaw", "BPC-157"].map((q) => (
              <button
                key={q}
                onClick={() => { setQuery(q); setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}
                className="px-3 py-1 rounded-full border border-white/[0.08] text-xs text-white/30 hover:text-white/60 hover:border-white/20 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* ── Entry points ─────────────────────────────── */}
        <div className="px-4 sm:px-6 pb-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              to="/issues"
              className="group flex flex-col gap-3 px-5 py-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:border-white/[0.15] transition-colors"
            >
              <span className="text-2xl">🔍</span>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Browse by Issue</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Start with what's bothering you — get every treatment that addresses it.
                </p>
              </div>
              <span className="text-white/20 group-hover:text-white/50 text-xs mt-auto transition-colors">
                {issues.length} issues →
              </span>
            </Link>

            <Link
              to="/treatments"
              className="group flex flex-col gap-3 px-5 py-5 bg-white/[0.03] border border-white/[0.08] rounded-2xl hover:border-white/[0.15] transition-colors"
            >
              <span className="text-2xl">💊</span>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Browse Compounds</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Already know what you want — protocol, safety notes, and vetted sources.
                </p>
              </div>
              <span className="text-white/20 group-hover:text-white/50 text-xs mt-auto transition-colors">
                {treatments.length} compounds →
              </span>
            </Link>

            <Link
              to="/ai"
              className="group flex flex-col gap-3 px-5 py-5 bg-emerald-500/[0.04] border border-emerald-500/[0.15] rounded-2xl hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-400/60">New</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Protocol AI</p>
                <p className="text-white/40 text-xs leading-relaxed">
                  Describe your goal in plain language — get a protocol straight from the database.
                </p>
              </div>
              <span className="text-emerald-400/40 group-hover:text-emerald-400/70 text-xs mt-auto transition-colors">
                Ask anything →
              </span>
            </Link>
          </div>
        </div>

        {/* ── Face zone map ─────────────────────────────── */}
        <div className="px-4 sm:px-6 pb-16 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-white font-semibold text-base mb-1">Or navigate by face zone</h2>
            <p className="text-white/30 text-sm">Tap any area to see what's causing it and how to fix it.</p>
          </div>
          <FaceZoneMap />
        </div>

        {/* ── Stack / Quiz promo ────────────────────────── */}
        <div className="px-4 sm:px-6 pb-24 max-w-2xl mx-auto">
          <div className="border border-white/[0.08] rounded-2xl px-6 sm:px-8 py-8 text-center">
            <p className="text-white font-semibold text-lg mb-2">Build your stack</p>
            <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
              Answer 3 questions and get a curated starter protocol — or build your own in the Stack Builder.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link
                to="/quiz"
                className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                Take the quiz →
              </Link>
              <Link
                to="/stack"
                className="px-5 py-2.5 border border-white/15 text-white/70 text-sm rounded-xl hover:border-white/30 hover:text-white transition-colors"
              >
                Stack Builder
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showTutorial && (
        <TutorialModal
          onClose={() => setShowTutorial(false)}
          onComplete={() => { if (!user) setShowAuth(true); }}
          dismissible={!!user}
        />
      )}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
