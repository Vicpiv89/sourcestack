import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { treatments } from "../data/treatments";
import type { Treatment } from "../data/treatments";
import { scoreMatch } from "../data/synonyms";

interface UserMsg { role: "user"; text: string }
interface AIMsg   { role: "ai"; intro: string; results: Treatment[]; note?: string }
type Msg = UserMsg | AIMsg;

const SUGGESTIONS = [
  "Thinning hair at the temples, ~$100/month",
  "Best skin stack for a beginner",
  "Tretinoin vs Adapalene — which first?",
  "Under-eye hollows and oily skin",
  "Jaw definition — what actually works?",
  "Cheapest stack that's actually proven",
];

const CAT_COLORS: Record<string, string> = {
  "Hair Loss":           "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Skincare":            "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Supplements":         "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "Peptides":            "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Research Compounds":  "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Mechanical":          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

function buildResponse(query: string): AIMsg {
  const lower = query.toLowerCase();

  const scored = treatments
    .map((t) => ({
      t,
      score: scoreMatch(
        { name: t.name, body: t.summary + " " + t.protocol.join(" "), slugs: t.issueSlugs },
        query
      ),
    }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 5).map((r) => r.t);

  if (top.length === 0) {
    return {
      role: "ai",
      intro:
        "No direct match in the database for that. Try describing the issue — hair thinning, skin clarity, under-eye hollows, jaw definition, recovery, hormones, etc.",
      results: [],
    };
  }

  const cats = [...new Set(top.map((t) => t.category))];

  let intro = "";
  const isVs      = /\bvs\b|\bversus\b|difference between|compare/.test(lower);
  const isSafety  = /\bsafe\b|long.?term|\brisk\b|dangerous/.test(lower);
  const isBudget  = /\bcheap|\bbudget|\baffordable|\bcost\b/.test(lower);
  const isBeginner= /\bstart\b|\bbeginner|\bnew to\b|first time/.test(lower);

  if (isVs) {
    intro = "Comparing your options — here's how they stack up:";
  } else if (isSafety) {
    intro = "Straight safety picture — evidence level and real risk profile for each:";
  } else if (isBudget) {
    intro = "Budget-optimized — highest ROI per dollar, cheapest first:";
  } else if (isBeginner) {
    intro = "Starting protocol — lowest-risk, highest-evidence options to build from:";
  } else if (cats.length === 1) {
    const intros: Record<string, string> = {
      "Hair Loss":          "Hair — pulling the most relevant protocols from the database:",
      "Skincare":           "Skin — here's what applies to your concern:",
      "Supplements":        "Supplement options ranked by evidence for your goal:",
      "Peptides":           "Peptide options — community consensus and protocol:",
      "Research Compounds": "Research compounds that apply here — read the safety notes:",
      "Mechanical":         "Mechanical interventions for this:",
    };
    intro = intros[cats[0]] ?? "Most relevant protocols from the database:";
  } else {
    intro = `${cats.join(" + ")} — covering both angles:`;
  }

  const hasResearch = top.some((t) =>
    ["ru58841", "pyrilutamide", "enclomiphene", "melanotan-ii", "finasteride", "dutasteride"].includes(t.slug)
  );

  return {
    role: "ai",
    intro,
    results: top,
    note: hasResearch ? "Research / Rx compounds included — check safety sections before running." : undefined,
  };
}

function TreatmentCard({ t }: { t: Treatment }) {
  const colorClass = CAT_COLORS[t.category] ?? "bg-white/5 text-white/50 border-white/10";
  return (
    <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 hover:border-white/[0.14] transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Link
          to={`/treatments/${t.slug}`}
          className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors leading-snug"
        >
          {t.name}
        </Link>
        <span className={`shrink-0 text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border ${colorClass}`}>
          {t.category}
        </span>
      </div>
      <p className="text-xs text-white/50 leading-relaxed mb-3 line-clamp-2">{t.summary}</p>
      {t.protocol.length > 0 && (
        <ul className="space-y-1.5 mb-3">
          {t.protocol.slice(0, 2).map((step, i) => (
            <li key={i} className="flex gap-2 text-xs text-white/60 leading-snug">
              <span className="text-emerald-500/60 shrink-0 font-mono mt-px">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
          {t.protocol.length > 2 && (
            <li className="text-xs text-white/30 pl-5">+{t.protocol.length - 2} more steps…</li>
          )}
        </ul>
      )}
      <Link
        to={`/treatments/${t.slug}`}
        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        Full protocol + vendors →
      </Link>
    </div>
  );
}

function AIBubble({ msg }: { msg: AIMsg }) {
  return (
    <div className="flex gap-3 max-w-3xl">
      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-bold text-emerald-400">SS</span>
      </div>
      <div className="flex-1 space-y-3">
        <p className="text-sm text-white/80 leading-relaxed">{msg.intro}</p>
        {msg.results.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-1">
            {msg.results.map((t) => (
              <TreatmentCard key={t.slug} t={t} />
            ))}
          </div>
        )}
        {msg.note && (
          <p className="text-[11px] text-amber-400/70 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
            ⚠ {msg.note}
          </p>
        )}
      </div>
    </div>
  );
}

function UserBubble({ msg }: { msg: UserMsg }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-lg bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white/90">
        {msg.text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-emerald-400">SS</span>
      </div>
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 flex gap-1.5 items-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function ProtocolAI() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "ai",
      intro:
        "Ask me about any issue, treatment, or goal. I'll pull the protocol directly from the SourceStack database — no safety theater, just what the data actually says.",
      results: [],
    },
  ]);
  const [input, setInput]     = useState("");
  const [typing, setTyping]   = useState(false);
  const [showSugs, setShowSugs] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text?: string) {
    const query = (text ?? input).trim();
    if (!query) return;
    setInput("");
    setShowSugs(false);
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setTyping(true);
    setTimeout(() => {
      const response = buildResponse(query);
      setTyping(false);
      setMessages((prev) => [...prev, response]);
    }, 700 + Math.random() * 400);
  }

  return (
    <>
      <SEO
        title="Protocol AI — SourceStack"
        description="Chat-based protocol recommendations powered by the SourceStack treatment database. Direct answers, real dosages, no safety theater."
        canonical="/ai"
      />

      <div className="flex flex-col h-[calc(100vh-57px)]">
        {/* Header */}
        <div className="border-b border-white/[0.07] px-4 sm:px-6 py-3 flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-white">Protocol AI</span>
          </div>
          <span className="text-xs text-white/25">Powered by the SourceStack database · Not medical advice</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-6">
          {messages.map((msg, i) =>
            msg.role === "ai"
              ? <AIBubble key={i} msg={msg} />
              : <UserBubble key={i} msg={msg} />
          )}
          {typing && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.07] px-4 sm:px-6 py-4 shrink-0">
          {showSugs && (
            <div className="flex gap-2 flex-wrap mb-3">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs text-white/40 border border-white/[0.07] rounded-full px-3 py-1.5 hover:text-white/70 hover:border-white/20 transition-colors whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3 items-center bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 focus-within:border-emerald-500/30 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Describe your concern, goal, or treatment question…"
              className="flex-1 bg-transparent text-sm text-white placeholder-white/20 outline-none"
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || typing}
              className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
