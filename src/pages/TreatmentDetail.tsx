import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { treatments } from "../data/treatments";
import { issues } from "../data/issues";
import VendorCard from "../components/VendorCard";
import DisclaimerBanner from "../components/DisclaimerBanner";
import UpgradeModal from "../components/UpgradeModal";
import { useAuth } from "../context/AuthContext";

export default function TreatmentDetail() {
  const { slug } = useParams<{ slug: string }>();
  const treatment = treatments.find((t) => t.slug === slug);
  const { isPro } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!treatment) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">Treatment not found.</p>
          <Link
            to="/treatments"
            className="text-white/60 text-sm mt-2 block hover:text-white"
          >
            ← Back to treatments
          </Link>
        </div>
      </div>
    );
  }

  const relatedIssues = issues.filter((i) =>
    treatment.issueSlugs.includes(i.slug)
  );

  const previewSteps = treatment.protocol.slice(0, 2);
  const lockedSteps = treatment.protocol.slice(2);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="px-6 pt-12 pb-24 max-w-3xl mx-auto">
        <Link
          to="/treatments"
          className="text-white/30 text-sm hover:text-white/60 transition-colors mb-8 block"
        >
          ← Treatments
        </Link>
        <DisclaimerBanner />

        {/* Header */}
        <div className="mb-10">
          <span className="text-xs uppercase tracking-widest text-white/30 block mb-3">
            {treatment.category}
          </span>
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            {treatment.name}
          </h1>
          <p className="text-white/50 text-base leading-relaxed">
            {treatment.summary}
          </p>
        </div>

        {/* Related issues */}
        {relatedIssues.length > 0 && (
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-white/30 mb-3">
              Addresses
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedIssues.map((issue) => (
                <Link
                  key={issue.slug}
                  to={`/issues/${issue.slug}`}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/80 hover:border-white/20 transition-colors"
                >
                  {issue.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Protocol */}
        <div className="mb-10 border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-white/[0.03] border-b border-white/5">
            <p className="text-white font-semibold">Protocol</p>
          </div>
          <div className="px-6 py-5">
            <ol className="flex flex-col gap-4">
              {previewSteps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-white/20 font-mono text-sm shrink-0 w-5 text-right mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-white/70 text-sm leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            {lockedSteps.length > 0 && (
              isPro ? (
                <ol className="flex flex-col gap-4 mt-4">
                  {lockedSteps.map((step, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="text-white/20 font-mono text-sm shrink-0 w-5 text-right mt-0.5">
                        {i + 3}
                      </span>
                      <span className="text-white/70 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-4 relative">
                  <div className="blur-sm pointer-events-none select-none">
                    <ol className="flex flex-col gap-4">
                      {lockedSteps.map((step, i) => (
                        <li key={i} className="flex gap-4">
                          <span className="text-white/20 font-mono text-sm shrink-0 w-5 text-right mt-0.5">
                            {i + 3}
                          </span>
                          <span className="text-white/70 text-sm leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/80 to-transparent flex flex-col items-center justify-end pb-2">
                    <button
                      onClick={() => setShowUpgrade(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors"
                    >
                      🔒 Unlock full protocol — $19/mo
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Safety */}
        <div className="mb-10 border border-amber-500/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-amber-500/[0.03] border-b border-amber-500/10">
            <p className="text-amber-400/80 font-semibold text-sm">Safety Notes</p>
          </div>
          <div className="px-6 py-5">
            <ul className="flex flex-col gap-3">
              {treatment.safety.map((note, i) => (
                <li key={i} className="flex gap-3 text-sm text-white/50">
                  <span className="text-amber-500/50 shrink-0 mt-0.5">!</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Vendors */}
        {treatment.vendorIds.length > 0 ? (
          <div>
            <p className="text-xs uppercase tracking-widest text-white/30 mb-5">
              Where to buy
            </p>
            {isPro ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {treatment.vendorIds.map((id) => (
                  <VendorCard key={id} vendorId={id} />
                ))}
              </div>
            ) : (
              <div
                className="relative cursor-pointer"
                onClick={() => setShowUpgrade(true)}
              >
                <div className="blur-sm pointer-events-none select-none grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {treatment.vendorIds.map((id) => (
                    <VendorCard key={id} vendorId={id} />
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <p className="text-white font-semibold text-sm">
                    🔒 Vendors locked
                  </p>
                  <p className="text-white/40 text-xs text-center max-w-xs">
                    Get vetted vendor prices, trust scores, and direct links with Pro
                  </p>
                  <button className="px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors">
                    Unlock for $19/mo
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl px-5 py-4">
            <p className="text-white/30 text-sm">
              No vetted sources yet for this treatment.{" "}
              <a
                href="mailto:hello@sourcestack.io"
                className="text-white/50 hover:text-white transition-colors"
              >
                Submit one →
              </a>
            </p>
          </div>
        )}
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
