import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { stackMeta } from "../data/stackMeta";
import SEO from "../components/SEO";

const RISK_COLORS: Record<string, string> = {
  low: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  medium: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  high: "text-red-400 bg-red-500/10 border-red-500/20",
};

const TIMING_COLORS: Record<string, string> = {
  AM: "text-amber-400/70",
  PM: "text-blue-400/70",
  Daily: "text-white/50",
  Weekly: "text-emerald-400/70",
};

function YesNo({ value, invert = false }: { value: boolean; invert?: boolean }) {
  const positive = invert ? !value : value;
  return (
    <span className={positive ? "text-emerald-400" : "text-white/25"}>
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function Compare() {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [search, setSearch] = useState<Record<number, string>>({});
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    if (t) {
      const parsed = t
        .split(",")
        .filter((s) => treatments.some((tr) => tr.slug === s))
        .slice(0, 3);
      setSlugs(parsed);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (slugs.length > 0) params.set("t", slugs.join(","));
    const newUrl = `${window.location.pathname}${slugs.length > 0 ? "?" + params.toString() : ""}`;
    window.history.replaceState(null, "", newUrl);
  }, [slugs]);

  const addSlot = () => {
    if (slugs.length < 3) setSlugs([...slugs, ""]);
  };

  const removeSlot = (idx: number) => {
    setSlugs(slugs.filter((_, i) => i !== idx));
  };

  const setSlug = (idx: number, slug: string) => {
    const next = [...slugs];
    next[idx] = slug;
    setSlugs(next);
    setSearch({});
    setOpen(null);
  };

  const filledTreatments = slugs
    .filter((s) => s)
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter(Boolean) as typeof treatments;

  const rows = [
    { label: "Category", render: (t: typeof treatments[0]) => <span className="text-white/50 text-sm">{t.category}</span> },
    { label: "Timing", render: (t: typeof treatments[0]) => {
      const meta = stackMeta[t.slug];
      if (!meta) return <span className="text-white/25 text-sm">—</span>;
      return <span className={`text-sm font-medium ${TIMING_COLORS[meta.timing]}`}>{meta.timing}</span>;
    }},
    { label: "Est. Monthly Cost", render: (t: typeof treatments[0]) => {
      const meta = stackMeta[t.slug];
      return <span className="text-white/60 text-sm font-mono">{meta?.monthlyCostEstimate ?? "—"}/mo</span>;
    }},
    { label: "Beginner Friendly", render: (t: typeof treatments[0]) => {
      const meta = stackMeta[t.slug];
      return <YesNo value={meta?.beginnerFriendly ?? false} />;
    }},
    { label: "Requires Rx", render: (t: typeof treatments[0]) => {
      const meta = stackMeta[t.slug];
      return <span className={meta?.requiresRx ? "text-amber-400" : "text-white/25"}>{meta?.requiresRx ? "Yes" : "No"}</span>;
    }},
    { label: "Research Compound", render: (t: typeof treatments[0]) => {
      const meta = stackMeta[t.slug];
      return <span className={meta?.isResearchCompound ? "text-amber-400" : "text-white/25"}>{meta?.isResearchCompound ? "Yes" : "No"}</span>;
    }},
    { label: "Risk Level", render: (t: typeof treatments[0]) => {
      const meta = stackMeta[t.slug];
      if (!meta) return <span className="text-white/25 text-sm">—</span>;
      return (
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${RISK_COLORS[meta.riskLevel]}`}>
          {meta.riskLevel}
        </span>
      );
    }},
    { label: "Protocol Steps", render: (t: typeof treatments[0]) => <span className="text-white/50 text-sm">{t.protocol.length} steps</span> },
    { label: "Safety Notes", render: (t: typeof treatments[0]) => <span className="text-white/50 text-sm">{t.safety.length} notes</span> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <SEO
        title="Compare Treatments"
        description="Side-by-side comparison of looksmaxxing compounds. Compare protocols, cost, risk level, beginner-friendliness, and vendor sources."
        path="/compare"
      />
      <div className="px-6 pt-10 pb-24 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Compare Treatments</h1>
        <p className="text-white/30 text-sm mb-8">Select up to 3 treatments for a side-by-side breakdown.</p>

        {/* Pickers */}
        <div className="flex flex-wrap gap-3 mb-10">
          {slugs.map((slug, idx) => {
            const treatment = treatments.find((t) => t.slug === slug);
            const q = search[idx] ?? "";
            const filtered = treatments
              .filter((t) => !slugs.includes(t.slug) || t.slug === slug)
              .filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.category.toLowerCase().includes(q.toLowerCase()))
              .slice(0, 12);
            return (
              <div key={idx} className="relative">
                <div
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl cursor-pointer hover:border-white/25 transition-colors min-w-[200px]"
                  onClick={() => setOpen(open === idx ? null : idx)}
                >
                  <span className="text-white text-sm flex-1">
                    {treatment ? treatment.name : <span className="text-white/30">Select treatment…</span>}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeSlot(idx); }}
                    className="text-white/25 hover:text-white/60 transition-colors text-xs"
                  >
                    ×
                  </button>
                </div>
                {open === idx && (
                  <div className="absolute top-full mt-1 left-0 z-50 bg-[#111] border border-white/15 rounded-xl overflow-hidden w-72 shadow-xl">
                    <div className="px-3 pt-3 pb-2 border-b border-white/5">
                      <input
                        type="text"
                        value={q}
                        autoFocus
                        onChange={(e) => setSearch({ ...search, [idx]: e.target.value })}
                        placeholder="Search…"
                        className="w-full bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none"
                      />
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {filtered.map((t) => (
                        <button
                          key={t.slug}
                          onClick={() => setSlug(idx, t.slug)}
                          className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors border-b border-white/[0.04] last:border-0"
                        >
                          <p className="text-white text-sm">{t.name}</p>
                          <p className="text-white/30 text-xs">{t.category}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {slugs.length < 3 && (
            <button
              onClick={addSlot}
              className="px-4 py-2.5 border border-dashed border-white/15 rounded-xl text-white/30 text-sm hover:border-white/30 hover:text-white/50 transition-colors"
            >
              + Add treatment
            </button>
          )}
        </div>

        {filledTreatments.length === 0 ? (
          <div className="border border-white/[0.06] rounded-2xl flex items-center justify-center py-24 text-center">
            <p className="text-white/20 text-sm">Select treatments above to compare them side by side.</p>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${filledTreatments.length}, 1fr)` }}>
              {filledTreatments.map((t) => (
                <div key={t.slug} className="border border-white/10 rounded-2xl px-5 py-5 bg-white/[0.02]">
                  <span className="text-xs uppercase tracking-widest text-white/25 block mb-2">{t.category}</span>
                  <p className="text-white font-semibold text-base leading-snug mb-2">{t.name}</p>
                  <p className="text-white/35 text-xs leading-relaxed line-clamp-3">{t.summary}</p>
                  <div className="flex gap-2 mt-4">
                    <Link
                      to={`/treatments/${t.slug}`}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors"
                    >
                      View full →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="border border-white/10 rounded-2xl overflow-hidden mb-6">
              {rows.map((row, ri) => (
                <div
                  key={row.label}
                  className={`grid gap-px ${ri % 2 === 0 ? "bg-white/[0.01]" : "bg-transparent"}`}
                  style={{ gridTemplateColumns: `180px repeat(${filledTreatments.length}, 1fr)` }}
                >
                  <div className="px-5 py-3.5 flex items-center border-r border-white/5">
                    <span className="text-white/30 text-xs font-medium">{row.label}</span>
                  </div>
                  {filledTreatments.map((t) => (
                    <div key={t.slug} className="px-5 py-3.5 flex items-center border-r border-white/5 last:border-0">
                      {row.render(t)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                to={`/stack?t=${filledTreatments.map((t) => t.slug).join(",")}`}
                className="px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                Open in Stack Builder →
              </Link>
              <p className="text-white/20 text-xs">Build a combined protocol from these treatments</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
