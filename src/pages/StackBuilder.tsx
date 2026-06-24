import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { stackMeta, INTERACTIONS } from "../data/stackMeta";
import { useAuth } from "../context/AuthContext";
import UpgradeModal from "../components/UpgradeModal";
import ProtocolClock from "../components/ProtocolClock";
import SEO from "../components/SEO";

const CATEGORIES = ["All", "Hair Loss", "Skincare", "Supplements", "Peptides", "Research Compounds", "Mechanical"];

function parseCost(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
}

function getActiveInteractions(selected: string[]) {
  return INTERACTIONS.filter((i) => i.slugs.every((s) => selected.includes(s)));
}

type Timing = "AM" | "PM" | "Daily" | "Weekly";

export default function StackBuilder() {
  const { isPro } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("t");
    if (t) {
      const slugs = t.split(",").filter((s) => treatments.some((tr) => tr.slug === s));
      setSelected(slugs);
    }
  }, []);

  const toggle = useCallback((slug: string) => {
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }, []);

  const filtered = treatments.filter((t) => {
    const matchesCategory = category === "All" || t.category === category;
    const matchesSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedTreatments = selected
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter(Boolean) as typeof treatments;

  const byTiming = (timing: Timing) =>
    selectedTreatments.filter((t) => stackMeta[t.slug]?.timing === timing);

  const activeInteractions = getActiveInteractions(selected);

  const totalCostMin = selected.reduce((sum, slug) => {
    const meta = stackMeta[slug];
    return sum + (meta ? parseCost(meta.monthlyCostEstimate) : 0);
  }, 0);

  const shareStack = () => {
    const url = `${window.location.origin}/stack?t=${selected.join(",")}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timingSections: { label: string; timing: Timing; color: string }[] = [
    { label: "Morning (AM)", timing: "AM", color: "text-amber-400/70" },
    { label: "Evening (PM)", timing: "PM", color: "text-blue-400/70" },
    { label: "Daily", timing: "Daily", color: "text-white/40" },
    { label: "Weekly", timing: "Weekly", color: "text-emerald-400/70" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <SEO
        title="Stack Builder — Build Your Protocol"
        description="Combine looksmaxxing treatments into a personalized AM/PM daily protocol. Get interaction warnings, monthly cost estimates, and vetted vendor sources."
        path="/stack"
      />
      <div className="px-6 pt-10 pb-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Stack Builder</h1>
            <p className="text-white/30 text-sm mt-1">
              Select treatments to generate your combined daily protocol.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selected.length > 0 && (
              <>
                <button
                  onClick={shareStack}
                  className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  {copied ? "Copied!" : "Share"}
                </button>
                <button
                  onClick={() => setSelected([])}
                  className="px-3 py-1.5 text-xs border border-white/10 rounded-lg text-white/40 hover:text-white/60 transition-colors"
                >
                  Clear
                </button>
              </>
            )}
            {selected.length > 0 && (
              <button
                onClick={() => (isPro ? undefined : setShowUpgrade(true))}
                className="px-3 py-1.5 text-xs bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {isPro ? "Saved" : "Save Stack"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 pb-24 gap-6">
        {/* Picker panel */}
        <div className="md:w-80 shrink-0">
          {/* Mobile collapse toggle */}
          <button
            className="md:hidden w-full flex items-center justify-between px-4 py-3 mb-3 border border-white/10 rounded-xl text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
            onClick={() => setPickerOpen(o => !o)}
          >
            <span>Add treatments {selected.length > 0 ? `(${selected.length} selected)` : ''}</span>
            <span className="text-white/30 transition-transform duration-200" style={{ transform: pickerOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
          </button>

          <div className={`md:sticky md:top-[65px] ${pickerOpen ? 'block' : 'hidden md:block'}`}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treatments..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors mb-3"
            />
            <div className="flex flex-wrap gap-1.5 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    category === cat
                      ? "bg-white text-black font-medium"
                      : "bg-white/5 text-white/40 hover:text-white/70 border border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-1 max-h-[35vh] md:max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
              {filtered.map((t) => {
                const isSelected = selected.includes(t.slug);
                const meta = stackMeta[t.slug];
                return (
                  <button
                    key={t.slug}
                    onClick={() => toggle(t.slug)}
                    className={`w-full text-left px-4 py-3 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                      isSelected
                        ? "border-white/30 bg-white/[0.06]"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/15"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium leading-snug">{t.name}</p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {t.category}
                        {meta ? ` · ${meta.timing} · ${meta.monthlyCostEstimate}/mo` : ""}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 transition-colors ${
                        isSelected
                          ? "border-white bg-white text-black"
                          : "border-white/20"
                      }`}
                    >
                      {isSelected && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Protocol panel */}
        <div className="flex-1 min-w-0">
          {selected.length === 0 ? (
            <div className="border border-white/[0.06] rounded-2xl flex flex-col items-center justify-center py-24 text-center px-6">
              <p className="text-white/20 text-sm">Add treatments from the left to build your protocol.</p>
              <p className="text-white/10 text-xs mt-2">Interactions, timing, and cost estimate appear automatically.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Protocol clock */}
              <div className="border border-white/[0.07] rounded-2xl bg-white/[0.01] py-6 flex flex-col items-center">
                <p className="text-white/25 text-[10px] uppercase tracking-widest mb-4">Daily Schedule</p>
                <ProtocolClock selected={selected} />
              </div>

              {/* Selected badges */}
              <div className="flex flex-wrap gap-2">
                {selectedTreatments.map((t) => (
                  <button
                    key={t.slug}
                    onClick={() => toggle(t.slug)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.05] border border-white/10 rounded-full text-xs text-white/60 hover:text-white/80 hover:border-white/20 transition-colors"
                  >
                    {t.name}
                    <span className="text-white/30">×</span>
                  </button>
                ))}
              </div>

              {/* Protocol sections */}
              {timingSections.map(({ label, timing, color }) => {
                const items = byTiming(timing);
                if (items.length === 0) return null;
                return (
                  <div key={timing} className="border border-white/10 rounded-2xl overflow-hidden">
                    <div className="px-5 py-3.5 bg-white/[0.03] border-b border-white/5 flex items-center gap-2">
                      <span className={`text-xs font-semibold uppercase tracking-widest ${color}`}>
                        {label}
                      </span>
                    </div>
                    <div className="px-5 py-4 flex flex-col gap-4">
                      {items.map((t) => (
                        <div key={t.slug}>
                          <p className="text-white/20 text-[10px] uppercase tracking-widest mb-2">
                            {t.name}
                          </p>
                          <ol className="flex flex-col gap-2.5">
                            {t.protocol.map((step, i) => (
                              <li key={i} className="flex gap-3">
                                <span className="text-white/15 font-mono text-xs shrink-0 w-4 text-right mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="text-white/60 text-sm leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Interactions */}
              {activeInteractions.length > 0 && (
                <div className="flex flex-col gap-2">
                  {activeInteractions.map((interaction, i) => {
                    const borderColor =
                      interaction.severity === "error"
                        ? "border-red-500/20"
                        : interaction.severity === "warning"
                        ? "border-amber-500/20"
                        : "border-blue-500/20";
                    const textColor =
                      interaction.severity === "error"
                        ? "text-red-400/80"
                        : interaction.severity === "warning"
                        ? "text-amber-400/80"
                        : "text-blue-400/80";
                    const icon =
                      interaction.severity === "error"
                        ? "✕"
                        : interaction.severity === "warning"
                        ? "!"
                        : "i";
                    return (
                      <div key={i} className={`border ${borderColor} rounded-xl px-4 py-3 flex gap-3`}>
                        <span className={`${textColor} text-xs font-bold shrink-0 mt-0.5`}>{icon}</span>
                        <div>
                          <p className={`${textColor} text-xs font-medium mb-0.5`}>
                            {interaction.slugs
                              .map((s) => treatments.find((t) => t.slug === s)?.name)
                              .filter(Boolean)
                              .join(" + ")}
                          </p>
                          <p className="text-white/40 text-xs leading-relaxed">{interaction.message}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Cost estimate */}
              <div className="border border-white/10 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 bg-white/[0.03] border-b border-white/5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">
                    Estimated Monthly Cost
                  </p>
                </div>
                <div className="px-5 py-4">
                  <div className="flex flex-col gap-2 mb-4">
                    {selectedTreatments.map((t) => {
                      const meta = stackMeta[t.slug];
                      return (
                        <div key={t.slug} className="flex items-center justify-between">
                          <span className="text-white/40 text-sm">{t.name}</span>
                          <span className="text-white/60 text-sm font-mono">
                            {meta?.monthlyCostEstimate ?? "—"}/mo
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="text-white/50 text-sm font-medium">Total estimate</span>
                    <span className="text-white font-bold">~${totalCostMin}/mo</span>
                  </div>
                  <p className="text-white/20 text-xs mt-2">
                    Estimates based on vetted vendor prices. Actual cost varies.
                  </p>
                </div>
              </div>

              {/* Save / Compare CTA */}
              <div className="flex gap-3">
                <button
                  onClick={() => (isPro ? undefined : setShowUpgrade(true))}
                  className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
                >
                  {isPro ? "Stack Saved" : "Save Stack — Pro"}
                </button>
                {selected.length >= 2 && (
                  <Link
                    to={`/compare?t=${selected.slice(0, 3).join(",")}`}
                    className="px-5 py-3 border border-white/10 text-white/50 text-sm rounded-xl hover:border-white/30 hover:text-white transition-colors"
                  >
                    Compare
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
