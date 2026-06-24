import { useState } from "react";
import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { scoreMatch } from "../data/synonyms";
import TreatmentGalaxy from "../components/TreatmentGalaxy";
import SEO from "../components/SEO";

const CATEGORIES = [
  "All",
  "Hair Loss",
  "Skincare",
  "Supplements",
  "Peptides",
  "Research Compounds",
  "Mechanical",
];

type ViewMode = "grid" | "galaxy";

export default function Treatments() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const scored = query
    ? treatments
        .map((t) => ({
          item: t,
          score: scoreMatch(
            { name: t.name, body: `${t.summary} ${t.category}`, slugs: [t.slug, ...t.issueSlugs] },
            query
          ),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item)
    : treatments;

  const filtered = scored.filter(
    (t) => activeCategory === "All" || t.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <SEO
        title="All Treatments"
        description={`${treatments.length} compounds with full protocols, safety notes, and vetted vendor sources. Hair loss, skincare, peptides, supplements, and research compounds.`}
        path="/treatments"
      />
      <div className="px-6 pt-14 pb-24 max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-2 flex-wrap gap-4 animate-fade-up">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight mb-1">Treatments</h1>
            <p className="text-white/40 text-sm">
              Every compound in the database — protocol, safety, and vetted sources.
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "grid" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="0" y="0" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="7" y="0" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="0" y="7" width="5" height="5" rx="1" fill="currentColor" />
                <rect x="7" y="7" width="5" height="5" rx="1" fill="currentColor" />
              </svg>
              Grid
            </button>
            <button
              onClick={() => setViewMode("galaxy")}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === "galaxy" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="2" fill="currentColor" />
                <circle cx="6" cy="1" r="1" fill="currentColor" opacity="0.6" />
                <circle cx="11" cy="6" r="1" fill="currentColor" opacity="0.6" />
                <circle cx="6" cy="11" r="1" fill="currentColor" opacity="0.6" />
                <circle cx="1" cy="6" r="1" fill="currentColor" opacity="0.6" />
                <circle cx="9.5" cy="2.5" r="0.8" fill="currentColor" opacity="0.4" />
                <circle cx="9.5" cy="9.5" r="0.8" fill="currentColor" opacity="0.4" />
                <circle cx="2.5" cy="9.5" r="0.8" fill="currentColor" opacity="0.4" />
                <circle cx="2.5" cy="2.5" r="0.8" fill="currentColor" opacity="0.4" />
              </svg>
              Galaxy
            </button>
          </div>
        </div>

        {viewMode === "grid" && (
          <>
            <div className="flex flex-col gap-4 mb-8 mt-6 animate-fade-up-delay-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search compounds..."
                className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      activeCategory === cat
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/40 hover:text-white/70"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((t) => (
                <Link
                  key={t.slug}
                  to={`/treatments/${t.slug}`}
                  className="card-hover flex flex-col gap-3 px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/25 block mb-1">
                        {t.category}
                      </span>
                      <h2 className="text-white font-semibold">{t.name}</h2>
                    </div>
                    <span className="text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-1">→</span>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed line-clamp-2">{t.summary}</p>
                  <div className="flex items-center gap-3 text-xs text-white/25 mt-auto">
                    <span>{t.protocol.length} protocol steps</span>
                    {t.vendorIds.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{t.vendorIds.length} source{t.vendorIds.length !== 1 ? "s" : ""}</span>
                      </>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {filtered.length === 0 && (
              <p className="text-white/25 text-sm py-12 text-center">No treatments found.</p>
            )}
          </>
        )}

        {viewMode === "galaxy" && (
          <div className="mt-6 animate-fade-up-delay-1">
            <p className="text-white/25 text-xs mb-5 text-center">
              All {treatments.length} compounds — hover to preview, click to open. Grouped by category.
            </p>
            <div className="border border-white/[0.06] rounded-2xl overflow-hidden bg-white/[0.01] p-4">
              <TreatmentGalaxy />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
