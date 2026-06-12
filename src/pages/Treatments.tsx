import { useState } from "react";
import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { scoreMatch } from "../data/synonyms";

const CATEGORIES = [
  "All",
  "Hair Loss",
  "Skincare",
  "Supplements",
  "Peptides",
  "Research Compounds",
  "Mechanical",
];

export default function Treatments() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

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
      <div className="px-6 pt-14 pb-24 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Treatments
        </h1>
        <p className="text-white/40 text-sm mb-8">
          Every compound in the database — protocol, safety, and vetted sources.
        </p>

        <div className="flex flex-col gap-4 mb-8">
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
              className="flex flex-col gap-3 px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-white/25 block mb-1">
                    {t.category}
                  </span>
                  <h2 className="text-white font-semibold">{t.name}</h2>
                </div>
                <span className="text-white/20 group-hover:text-white/50 transition-colors shrink-0 mt-1">
                  →
                </span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed line-clamp-2">
                {t.summary}
              </p>
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
          <p className="text-white/25 text-sm py-12 text-center">
            No treatments found.
          </p>
        )}
      </div>
    </div>
  );
}
