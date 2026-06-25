import { useState } from "react";
import { Link } from "react-router-dom";
import { issues } from "../data/issues";
import { scoreMatch } from "../data/synonyms";
import SEO from "../components/SEO";

export default function Issues() {
  const [query, setQuery] = useState("");

  const filtered = query
    ? issues
        .map((i) => ({
          item: i,
          score: scoreMatch(
            { name: i.name, body: i.description, slugs: i.treatmentSlugs },
            query
          ),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item)
    : issues;

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Browse Issues"
        description={`${issues.length} looksmaxxing concerns covered — hair loss, skin clarity, hyperpigmentation, beard growth, and more. Find what actually works for each.`}
        path="/issues"
      />
      <div className="px-6 pt-14 pb-24 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Browse Issues
        </h1>
        <p className="text-white/40 text-sm mb-8">
          Pick your concern — we'll show you what actually works and where to
          get it.
        </p>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter issues..."
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 mb-6 transition-colors"
        />

        <div className="flex flex-col gap-3">
          {filtered.map((issue) => (
            <Link
              key={issue.slug}
              to={`/issues/${issue.slug}`}
              className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
            >
              <div>
                <p className="text-white font-semibold group-hover:text-white transition-colors">
                  {issue.name}
                </p>
                <p className="text-white/40 text-sm mt-1 leading-relaxed">
                  {issue.description}
                </p>
                <p className="text-white/25 text-xs mt-2">
                  {issue.treatmentSlugs.length} treatment
                  {issue.treatmentSlugs.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <span className="text-white/20 group-hover:text-white/50 transition-colors text-lg ml-4 shrink-0">
                →
              </span>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-white/25 text-sm py-12 text-center">
            No issues found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
}
