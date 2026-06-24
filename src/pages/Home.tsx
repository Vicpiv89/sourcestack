import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SEO from "../components/SEO";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";
import { vendors } from "../data/vendors";
import { scoreMatch } from "../data/synonyms";

const TESTIMONIALS = [
  {
    quote: "Finally a site that just tells you what to buy and where. Spent 3 hours on Reddit trying to find a legit minoxidil source — found it here in 30 seconds.",
    handle: "u/MaxxingProgress",
  },
  {
    quote: "The protocol pages alone are worth bookmarking. No fluff, no selling me a course, just the actual protocol.",
    handle: "u/FrameGoals",
  },
  {
    quote: "Solid vendor vetting. I'd been using a sketchy peptide source for months — switched based on the COA criteria here and the quality difference was noticeable.",
    handle: "u/PeptideStack",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"issue" | "treatment">("issue");
  const navigate = useNavigate();

  const issueResults = query
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
    : [];

  const treatmentResults = query
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
    : [];

  const results = mode === "issue" ? issueResults : treatmentResults;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <SEO
        title="Your Protocol, Sourced"
        description="Search by issue or compound — get vetted protocols, interaction warnings, and trusted vendor sources for hair loss, skincare, peptides, and supplements."
        path="/"
      />
      {/* Hero */}
      <div className="px-6 pt-20 pb-16 max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-white tracking-tight mb-4">
          Your protocol, sourced.
        </h1>
        <p className="text-white/40 text-lg mb-8">
          Search by issue to find treatments, or search by compound to find
          vetted sources and protocols.
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
          <div className="text-center">
            <p className="text-white font-bold text-xl">{treatments.length}+</p>
            <p className="text-white/30 text-xs">treatments</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">{vendors.length}</p>
            <p className="text-white/30 text-xs">vetted vendors</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">{issues.length}</p>
            <p className="text-white/30 text-xs">issues covered</p>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="text-center">
            <p className="text-white font-bold text-xl">100%</p>
            <p className="text-white/30 text-xs">independent</p>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="flex items-center justify-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit mx-auto">
          <button
            onClick={() => setMode("issue")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "issue"
                ? "bg-white text-black"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            I have an issue
          </button>
          <button
            onClick={() => setMode("treatment")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === "treatment"
                ? "bg-white text-black"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            I know what I want
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "issue"
                ? "e.g. thin brows, under-eye hollows, beard..."
                : "e.g. minoxidil, BPC-157, creatine..."
            }
            className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Search results dropdown */}
        {query && results.length > 0 && (
          <div className="max-w-lg mx-auto mt-2 bg-[#111] border border-white/10 rounded-xl overflow-hidden">
            {results.map((r) => (
              <button
                key={r.slug}
                onClick={() =>
                  navigate(
                    `/${mode === "issue" ? "issues" : "treatments"}/${r.slug}`
                  )
                }
                className="w-full text-left px-5 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
              >
                <p className="text-white text-sm font-medium">{r.name}</p>
                <p className="text-white/40 text-xs mt-0.5 line-clamp-1">
                  {"description" in r ? r.description : r.summary}
                </p>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <p className="text-white/25 text-sm mt-4">No results for "{query}"</p>
        )}
      </div>

      {/* Browse sections */}
      <div className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Issues */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Browse by Issue</h2>
              <Link
                to="/issues"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {issues.slice(0, 5).map((issue) => (
                <Link
                  key={issue.slug}
                  to={`/issues/${issue.slug}`}
                  className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                >
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-white transition-colors">
                      {issue.name}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      {issue.treatmentSlugs.length} treatment
                      {issue.treatmentSlugs.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <span className="text-white/20 group-hover:text-white/50 transition-colors text-sm">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Treatments */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Browse by Treatment</h2>
              <Link
                to="/treatments"
                className="text-xs text-white/30 hover:text-white/60 transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {treatments.slice(0, 5).map((t) => (
                <Link
                  key={t.slug}
                  to={`/treatments/${t.slug}`}
                  className="flex items-center justify-between px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                >
                  <div>
                    <p className="text-white text-sm font-medium group-hover:text-white transition-colors">
                      {t.name}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">{t.category}</p>
                  </div>
                  <span className="text-white/20 group-hover:text-white/50 transition-colors text-sm">
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz / Stack promo */}
        <div className="mt-16 border border-white/10 rounded-2xl px-8 py-10 bg-white/[0.02] text-center">
          <p className="text-white font-semibold text-xl mb-2">Not sure where to start?</p>
          <p className="text-white/40 text-sm mb-6">
            Answer 3 questions and get a curated starter protocol based on your goal and experience level.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/quiz"
              className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              Build my stack →
            </Link>
            <Link
              to="/stack"
              className="px-5 py-2.5 border border-white/20 text-white text-sm rounded-lg hover:border-white/40 transition-colors"
            >
              Stack Builder
            </Link>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-white font-semibold mb-6 text-center">
            What the community says
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-5 flex flex-col gap-4"
              >
                <p className="text-white/55 text-sm leading-relaxed italic">
                  "{t.quote}"
                </p>
                <p className="text-white/25 text-xs mt-auto">{t.handle}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
