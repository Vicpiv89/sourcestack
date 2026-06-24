import { useState } from "react";
import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { stackMeta } from "../data/stackMeta";

type Goal = "hair" | "skin" | "antiaging" | "body" | "sleep" | "hormones";
type Level = "beginner" | "intermediate" | "advanced";
type Budget = "budget" | "mid" | "any";

const GOALS: { id: Goal; label: string; sub: string }[] = [
  { id: "hair",      label: "Hair Growth",             sub: "Hairline, beard, brows, lashes" },
  { id: "skin",      label: "Skin Clarity",             sub: "Acne, texture, hyperpigmentation" },
  { id: "antiaging", label: "Anti-Aging",               sub: "Fine lines, collagen, longevity" },
  { id: "body",      label: "Body Composition",         sub: "Muscle, performance, recovery" },
  { id: "sleep",     label: "Sleep & Recovery",         sub: "Sleep quality, stress, adaptation" },
  { id: "hormones",  label: "Hormonal Optimization",    sub: "Free testosterone, SHBG, energy" },
];

const LEVELS: { id: Level; label: string; sub: string }[] = [
  { id: "beginner",     label: "Beginner",     sub: "OTC products only, no injectables" },
  { id: "intermediate", label: "Intermediate", sub: "Open to supplements & topical actives" },
  { id: "advanced",     label: "Advanced",     sub: "Comfortable with peptides & research compounds" },
];

const BUDGETS: { id: Budget; label: string; sub: string }[] = [
  { id: "budget", label: "Budget",    sub: "~$20–40/mo" },
  { id: "mid",    label: "Mid-range", sub: "~$40–80/mo" },
  { id: "any",    label: "No limit",  sub: "Best results regardless of cost" },
];

const RECOMMENDATIONS: Record<Goal, Record<Level, string[]>> = {
  hair: {
    beginner:     ["rosemary-oil", "ketoconazole-shampoo", "biotin", "zinc-picolinate"],
    intermediate: ["minoxidil-topical", "ketoconazole-shampoo", "zinc-picolinate", "saw-palmetto", "dermaroller"],
    advanced:     ["minoxidil-topical", "ru58841", "ketoconazole-shampoo", "zinc-picolinate", "ghk-cu", "dermaroller"],
  },
  skin: {
    beginner:     ["niacinamide", "salicylic-acid", "vitamin-c-serum", "hyaluronic-acid"],
    intermediate: ["adapalene", "niacinamide", "vitamin-c-serum", "azelaic-acid", "snail-mucin"],
    advanced:     ["tretinoin", "niacinamide", "vitamin-c-serum", "azelaic-acid", "alpha-arbutin", "ghk-cu"],
  },
  antiaging: {
    beginner:     ["vitamin-c-serum", "niacinamide", "collagen-peptides", "vitamin-d3", "omega-3"],
    intermediate: ["adapalene", "vitamin-c-serum", "collagen-peptides", "astaxanthin", "omega-3", "nac"],
    advanced:     ["tretinoin", "vitamin-c-serum", "ghk-cu", "astaxanthin", "nac", "collagen-peptides"],
  },
  body: {
    beginner:     ["creatine", "vitamin-d3", "omega-3", "zinc-picolinate", "magnesium-glycinate"],
    intermediate: ["creatine", "vitamin-d3", "omega-3", "tongkat-ali", "ashwagandha", "zinc-picolinate"],
    advanced:     ["creatine", "ipamorelin-cjc", "bpc-157", "tongkat-ali", "fadogia-agrestis", "vitamin-d3"],
  },
  sleep: {
    beginner:     ["magnesium-glycinate", "melatonin", "l-theanine", "glycine"],
    intermediate: ["magnesium-glycinate", "ashwagandha", "l-theanine", "glycine", "melatonin"],
    advanced:     ["magnesium-glycinate", "ashwagandha", "l-theanine", "glycine", "epithalon"],
  },
  hormones: {
    beginner:     ["vitamin-d3", "zinc-picolinate", "boron", "magnesium-glycinate"],
    intermediate: ["tongkat-ali", "fadogia-agrestis", "zinc-picolinate", "boron", "vitamin-d3"],
    advanced:     ["tongkat-ali", "fadogia-agrestis", "zinc-picolinate", "boron", "enclomiphene"],
  },
};

function parseCost(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
}

function OptionCard<T extends string>({
  id, label, sub, selected, onSelect,
}: { id: T; label: string; sub: string; selected: boolean; onSelect: (id: T) => void }) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
        selected
          ? "border-white bg-white/[0.08]"
          : "border-white/10 bg-white/[0.02] hover:border-white/25"
      }`}
    >
      <p className={`font-medium text-sm ${selected ? "text-white" : "text-white/70"}`}>{label}</p>
      <p className="text-white/30 text-xs mt-0.5">{sub}</p>
    </button>
  );
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);

  const steps = ["Goal", "Experience", "Budget"];
  const done = step === 3;

  const getResults = (): string[] => {
    if (!goal || !level) return [];
    let slugs = RECOMMENDATIONS[goal][level];
    if (budget === "budget") {
      slugs = slugs.filter((slug) => {
        const meta = stackMeta[slug];
        return meta ? parseCost(meta.monthlyCostEstimate) <= 25 : true;
      });
    }
    return slugs;
  };

  const resultSlugs = done ? getResults() : [];
  const resultTreatments = resultSlugs
    .map((slug) => treatments.find((t) => t.slug === slug))
    .filter(Boolean) as typeof treatments;

  const goalLabels: Record<Goal, string> = {
    hair: "Hair Growth", skin: "Skin Clarity", antiaging: "Anti-Aging",
    body: "Body Composition", sleep: "Sleep & Recovery", hormones: "Hormonal Optimization",
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="px-6 pt-12 pb-24 max-w-xl mx-auto">
        {/* Step indicator */}
        {!done && (
          <div className="flex items-center gap-3 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < step ? "bg-white" : i === step ? "bg-white/60" : "bg-white/15"
                    }`}
                  />
                  <span className={`text-xs transition-colors ${i === step ? "text-white/60" : "text-white/20"}`}>
                    {s}
                  </span>
                </div>
                {i < steps.length - 1 && <div className="w-6 h-px bg-white/10" />}
              </div>
            ))}
          </div>
        )}

        {/* Step 0 — Goal */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">What's your #1 goal?</h1>
            <p className="text-white/30 text-sm mb-6">Pick the area you want to focus on first.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {GOALS.map((g) => (
                <OptionCard key={g.id} id={g.id} label={g.label} sub={g.sub} selected={goal === g.id} onSelect={setGoal} />
              ))}
            </div>
            <button
              disabled={!goal}
              onClick={() => setStep(1)}
              className="mt-6 w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        {/* Step 1 — Experience */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Experience level?</h1>
            <p className="text-white/30 text-sm mb-6">This shapes which compounds we recommend.</p>
            <div className="flex flex-col gap-2.5">
              {LEVELS.map((l) => (
                <OptionCard key={l.id} id={l.id} label={l.label} sub={l.sub} selected={level === l.id} onSelect={setLevel} />
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)} className="px-5 py-3 border border-white/10 text-white/40 text-sm rounded-xl hover:border-white/20 transition-colors">
                Back
              </button>
              <button
                disabled={!level}
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Budget */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Monthly budget?</h1>
            <p className="text-white/30 text-sm mb-6">We'll filter out anything outside your range.</p>
            <div className="flex flex-col gap-2.5">
              {BUDGETS.map((b) => (
                <OptionCard key={b.id} id={b.id} label={b.label} sub={b.sub} selected={budget === b.id} onSelect={setBudget} />
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(1)} className="px-5 py-3 border border-white/10 text-white/40 text-sm rounded-xl hover:border-white/20 transition-colors">
                Back
              </button>
              <button
                disabled={!budget}
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Build my stack →
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {done && (
          <div>
            <div className="mb-8">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Your starter stack</p>
              <h1 className="text-2xl font-bold text-white">
                {goal ? goalLabels[goal] : ""} · {level}
              </h1>
              <p className="text-white/30 text-sm mt-1">
                {resultTreatments.length} treatments ·{" "}
                ~${resultTreatments.reduce((sum, t) => {
                  const meta = stackMeta[t.slug];
                  return sum + (meta ? parseCost(meta.monthlyCostEstimate) : 0);
                }, 0)}/mo estimated
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              {resultTreatments.map((t) => {
                const meta = stackMeta[t.slug];
                return (
                  <Link
                    key={t.slug}
                    to={`/treatments/${t.slug}`}
                    className="flex items-center justify-between px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                  >
                    <div>
                      <p className="text-white text-sm font-medium group-hover:text-white transition-colors">
                        {t.name}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">
                        {t.category}
                        {meta ? ` · ${meta.timing} · ${meta.monthlyCostEstimate}/mo` : ""}
                        {meta?.beginnerFriendly === false ? " · Advanced" : ""}
                      </p>
                    </div>
                    <span className="text-white/20 group-hover:text-white/50 text-sm transition-colors">→</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={`/stack?t=${resultSlugs.join(",")}`}
                className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors text-center"
              >
                Open in Stack Builder →
              </Link>
              <button
                onClick={() => { setStep(0); setGoal(null); setLevel(null); setBudget(null); }}
                className="w-full py-3 border border-white/10 text-white/40 text-sm rounded-xl hover:border-white/20 transition-colors"
              >
                Start over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
