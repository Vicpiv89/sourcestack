import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { stackMeta } from "../data/stackMeta";
import SEO from "../components/SEO";

type Level = "beginner" | "intermediate" | "advanced";
type Budget = "budget" | "mid" | "any";

// Concrete concerns people actually have — each maps to an ordered
// shortlist of treatment slugs (best first).
const CONCERNS: { id: string; label: string; slugs: string[] }[] = [
  { id: "hairline",     label: "Hairline / thinning",     slugs: ["minoxidil-topical", "ketoconazole-shampoo", "finasteride", "ru58841", "saw-palmetto", "rosemary-oil"] },
  { id: "beard",        label: "Patchy beard",            slugs: ["minoxidil-topical", "dermaroller", "zinc-picolinate"] },
  { id: "brows-lashes", label: "Brows & lashes",          slugs: ["minoxidil-topical", "careprost-bimatoprost", "biotin", "ghk-cu"] },
  { id: "acne",         label: "Acne & breakouts",        slugs: ["salicylic-acid", "benzoyl-peroxide", "niacinamide", "adapalene", "tretinoin", "zinc-picolinate"] },
  { id: "texture",      label: "Texture & pores",         slugs: ["niacinamide", "salicylic-acid", "glycolic-acid", "tretinoin", "dermaroller", "snail-mucin"] },
  { id: "dark-spots",   label: "Dark spots & marks",      slugs: ["vitamin-c-serum", "azelaic-acid", "alpha-arbutin", "tranexamic-acid", "tretinoin"] },
  { id: "dark-circles", label: "Dark circles",            slugs: ["caffeine-eye-cream", "vitamin-c-serum", "niacinamide", "hyaluronic-acid"] },
  { id: "jawline",      label: "Jawline & face fat",      slugs: ["gua-sha", "mastic-gum", "creatine"] },
  { id: "anti-aging",   label: "Anti-aging",              slugs: ["vitamin-c-serum", "collagen-peptides", "adapalene", "tretinoin", "astaxanthin", "ghk-cu"] },
  { id: "muscle",       label: "Muscle & recovery",       slugs: ["creatine", "vitamin-d3", "omega-3", "magnesium-glycinate", "bpc-157", "ipamorelin-cjc"] },
  { id: "sleep",        label: "Sleep",                   slugs: ["magnesium-glycinate", "l-theanine", "glycine", "melatonin", "ashwagandha"] },
  { id: "energy",       label: "Energy & focus",          slugs: ["l-theanine", "rhodiola-rosea", "lions-mane", "mucuna-pruriens"] },
  { id: "testosterone", label: "Testosterone & drive",    slugs: ["vitamin-d3", "zinc-picolinate", "boron", "tongkat-ali", "fadogia-agrestis", "enclomiphene"] },
];

const LEVELS: { id: Level; label: string; sub: string }[] = [
  { id: "beginner",     label: "Keep it simple",   sub: "Over-the-counter products only — nothing prescription, nothing exotic" },
  { id: "intermediate", label: "Some experience",  sub: "Comfortable with supplements, actives, and prescription-grade topicals" },
  { id: "advanced",     label: "Show me everything", sub: "Peptides and research compounds included — I know what I'm doing" },
];

const BUDGETS: { id: Budget; label: string; sub: string }[] = [
  { id: "budget", label: "Budget",    sub: "Keep each item around $20/mo or less" },
  { id: "mid",    label: "Mid-range", sub: "Up to ~$50/mo per item" },
  { id: "any",    label: "No limit",  sub: "Best results regardless of cost" },
];

const STORAGE_KEY = "ss_quiz";

function parseCost(s: string): number {
  return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
}

function allowedAtLevel(slug: string, level: Level): boolean {
  const meta = stackMeta[slug];
  if (!meta) return true;
  if (level === "beginner") return meta.beginnerFriendly;
  if (level === "intermediate") return !meta.isResearchCompound;
  return true;
}

function withinBudget(slug: string, budget: Budget): boolean {
  const meta = stackMeta[slug];
  if (!meta) return true;
  const cost = parseCost(meta.monthlyCostEstimate);
  if (budget === "budget") return cost <= 20;
  if (budget === "mid") return cost <= 50;
  return true;
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [concerns, setConcerns] = useState<string[]>([]);
  const [level, setLevel] = useState<Level | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [restored, setRestored] = useState(false);

  // survive navigation: coming back from a treatment page restores results
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.concerns)) setConcerns(s.concerns);
        if (s.level) setLevel(s.level);
        if (s.budget) setBudget(s.budget);
        if (typeof s.step === "number") setStep(s.step);
      }
    } catch { /* fresh start */ }
    setRestored(true);
  }, []);

  useEffect(() => {
    if (!restored) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step, concerns, level, budget }));
  }, [step, concerns, level, budget, restored]);

  const steps = ["Goals", "Experience", "Budget"];
  const done = step === 3;

  const resultGroups = done && level && budget
    ? CONCERNS.filter((c) => concerns.includes(c.id)).map((c) => {
        let slugs = c.slugs.filter((s) => allowedAtLevel(s, level) && withinBudget(s, budget));
        // never leave a goal empty — relax budget before dropping it
        if (slugs.length === 0) slugs = c.slugs.filter((s) => allowedAtLevel(s, level)).slice(0, 2);
        return { concern: c, slugs: slugs.slice(0, 4) };
      })
    : [];
  const allSlugs = [...new Set(resultGroups.flatMap((g) => g.slugs))].slice(0, 12);
  const totalCost = allSlugs.reduce((sum, s) => sum + (stackMeta[s] ? parseCost(stackMeta[s].monthlyCostEstimate) : 0), 0);

  const reset = () => {
    setStep(0);
    setConcerns([]);
    setLevel(null);
    setBudget(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Build My Stack — Personalized Protocol Quiz"
        description="Pick your goals, experience level, and budget — get a personalized starter stack built from the protocol database."
        path="/quiz"
      />
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

        {/* Step 0 — Concerns (multi-select) */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">What do you want to improve?</h1>
            <p className="text-white/30 text-sm mb-6">Pick everything that applies — your stack gets built around it.</p>
            <div className="flex flex-wrap gap-2">
              {CONCERNS.map((c) => {
                const on = concerns.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() =>
                      setConcerns((prev) => (on ? prev.filter((x) => x !== c.id) : [...prev, c.id]))
                    }
                    className={`px-4 py-2.5 rounded-full text-sm border transition-colors ${
                      on
                        ? "border-white bg-white/[0.1] text-white font-medium"
                        : "border-white/12 bg-white/[0.02] text-white/50 hover:border-white/30 hover:text-white/80"
                    }`}
                  >
                    {on ? "✓ " : "+ "}{c.label}
                  </button>
                );
              })}
            </div>
            <button
              disabled={concerns.length === 0}
              onClick={() => setStep(1)}
              className="mt-8 w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {concerns.length === 0 ? "Pick at least one goal" : `Next — ${concerns.length} goal${concerns.length > 1 ? "s" : ""} →`}
            </button>
          </div>
        )}

        {/* Step 1 — Experience */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">How deep do you want to go?</h1>
            <p className="text-white/30 text-sm mb-6">This decides which compounds we show you.</p>
            <div className="flex flex-col gap-2.5">
              {LEVELS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLevel(l.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                    level === l.id
                      ? "border-white bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <p className={`font-medium text-sm ${level === l.id ? "text-white" : "text-white/70"}`}>{l.label}</p>
                  <p className="text-white/30 text-xs mt-0.5">{l.sub}</p>
                </button>
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
            <p className="text-white/30 text-sm mb-6">We'll keep your stack inside it.</p>
            <div className="flex flex-col gap-2.5">
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all ${
                    budget === b.id
                      ? "border-white bg-white/[0.08]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  }`}
                >
                  <p className={`font-medium text-sm ${budget === b.id ? "text-white" : "text-white/70"}`}>{b.label}</p>
                  <p className="text-white/30 text-xs mt-0.5">{b.sub}</p>
                </button>
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

        {/* Results — grouped by goal */}
        {done && (
          <div>
            <div className="mb-8">
              <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Your starter stack</p>
              <h1 className="text-2xl font-bold text-white">
                {concerns.length} goal{concerns.length > 1 ? "s" : ""} · {allSlugs.length} treatments
              </h1>
              <p className="text-white/30 text-sm mt-1">~${totalCost}/mo estimated</p>
            </div>

            <div className="flex flex-col gap-7 mb-8">
              {resultGroups.map(({ concern, slugs }) => (
                <div key={concern.id}>
                  <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-2.5">
                    {concern.label}
                  </h2>
                  <div className="flex flex-col gap-2">
                    {slugs.map((slug) => {
                      const t = treatments.find((x) => x.slug === slug);
                      if (!t) return null;
                      const meta = stackMeta[slug];
                      return (
                        <Link
                          key={slug}
                          to={`/treatments/${slug}`}
                          className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl hover:border-white/20 transition-colors group"
                        >
                          <div>
                            <p className="text-white text-sm font-medium">{t.name}</p>
                            <p className="text-white/30 text-xs mt-0.5">
                              {t.category}
                              {meta ? ` · ${meta.timing} · ${meta.monthlyCostEstimate}/mo` : ""}
                            </p>
                          </div>
                          <span className="text-white/20 group-hover:text-white/50 text-sm transition-colors">→</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <Link
                to={`/stack?t=${allSlugs.join(",")}`}
                className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors text-center"
              >
                Open in Stack Builder →
              </Link>
              <button
                onClick={reset}
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
