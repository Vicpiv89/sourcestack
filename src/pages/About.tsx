import { Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { vendors } from "../data/vendors";
import { issues } from "../data/issues";

const howWeVet = [
  {
    title: "Community reputation",
    body: "We track what the community has actually used and reported on — forums, Reddit, Discord. Consistent positive reputation over time is the baseline.",
  },
  {
    title: "Third-party testing",
    body: "For research compounds and peptides, we only list vendors that publish COAs (certificates of analysis) from independent labs. No COA, no listing.",
  },
  {
    title: "Pricing transparency",
    body: "We check prices manually and update them regularly. The goal is to surface the cheapest legitimate source, not the one with the best affiliate rate.",
  },
  {
    title: "Removal policy",
    body: "Vendors are removed if the community reports consistent quality issues, dosing discrepancies on COAs, or poor customer service. Vetted status isn't permanent.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        <Link
          to="/"
          className="text-white/30 text-sm hover:text-white/60 transition-colors mb-8 block"
        >
          ← Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            About SourceStack
          </h1>
          <p className="text-white/50 text-lg leading-relaxed">
            The looksmaxxing space has a sourcing problem. Information comes
            from TikToks with no citations, AI that's too liability-scared to
            give straight answers, and Reddit threads that are three years out
            of date. Vendors are scattered. Prices are all over the place. It's
            hard to know who to trust.
          </p>
          <p className="text-white/50 text-lg leading-relaxed mt-4">
            SourceStack is a reference hub built by practitioners for
            practitioners. Every treatment has a protocol. Every vendor has been
            vetted. The goal is to make the research part fast so you can spend
            your time on the actual work.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-14">
          {[
            { value: `${treatments.length}`, label: "Treatments documented" },
            { value: `${vendors.filter((v) => v.trusted).length}`, label: "Vetted vendors" },
            { value: `${issues.length}`, label: "Issues covered" },
            { value: "100%", label: "Independent — no paid placements" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4"
            >
              <p className="text-white text-2xl font-bold tracking-tight">
                {s.value}
              </p>
              <p className="text-white/40 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* How we vet */}
        <div className="mb-14">
          <h2 className="text-white font-semibold text-xl mb-6">
            How we vet vendors
          </h2>
          <div className="flex flex-col gap-5">
            {howWeVet.map((item, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-white/15 font-mono text-sm shrink-0 w-5 text-right mt-0.5">
                  {i + 1}
                </span>
                <div>
                  <p className="text-white font-medium text-sm mb-1">
                    {item.title}
                  </p>
                  <p className="text-white/45 text-sm leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="border border-white/10 rounded-2xl px-6 py-6 mb-10">
          <p className="text-white/60 text-sm leading-relaxed italic">
            "The information exists. It's just scattered, unreliable, or
            buried behind people trying to sell you something. We're not here
            to sell a product — we're here to make the research part take 10
            minutes instead of 10 hours."
          </p>
          <p className="text-white/25 text-xs mt-3">— SourceStack</p>
        </div>

        {/* Disclaimer note */}
        <p className="text-white/25 text-xs leading-relaxed">
          SourceStack is an informational reference platform. Nothing here is
          medical advice.{" "}
          <Link
            to="/disclaimer"
            className="text-white/40 hover:text-white/60 underline transition-colors"
          >
            Read the full disclaimer →
          </Link>
        </p>
      </div>
    </div>
  );
}
