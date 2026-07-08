import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { issues } from "../data/issues";
import { treatments } from "../data/treatments";
import VendorCard from "../components/VendorCard";
import DisclaimerBanner from "../components/DisclaimerBanner";
import UpgradeModal from "../components/UpgradeModal";
import SEO from "../components/SEO";
import BackLink from "../components/BackLink";
import { useAuth } from "../context/AuthContext";

export default function IssueDetail() {
  const { slug } = useParams<{ slug: string }>();
  const issue = issues.find((i) => i.slug === slug);
  const { isPro } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!issue) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40">Issue not found.</p>
          <Link to="/issues" className="text-white/60 text-sm mt-2 block hover:text-white">
            ← Back to issues
          </Link>
        </div>
      </div>
    );
  }

  const issueTreatments = treatments.filter((t) =>
    issue.treatmentSlugs.includes(t.slug)
  );

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title={`${issue.name} — Treatments & Sources`}
        description={`${issue.description} ${issue.treatmentSlugs.length} vetted treatment options with protocols and sources.`}
        path={`/issues/${issue.slug}`}
      />
      <div className="px-6 pt-12 pb-24 max-w-3xl mx-auto">
        <BackLink
          fallback="/issues"
          fallbackLabel="Issues"
          className="text-white/30 text-sm hover:text-white/60 transition-colors mb-8 block"
        />
        <DisclaimerBanner />

        <h1 className="text-3xl font-bold text-white tracking-tight mb-3">
          {issue.name}
        </h1>
        <p className="text-white/50 text-base leading-relaxed mb-12">
          {issue.description}
        </p>

        <h2 className="text-white font-semibold mb-5 text-sm uppercase tracking-widest text-white/40">
          Treatments
        </h2>

        <div className="flex flex-col gap-6">
          {issueTreatments.map((treatment) => {
            const previewSteps = treatment.protocol.slice(0, 2);
            const lockedSteps = treatment.protocol.slice(2);

            return (
              <div
                key={treatment.slug}
                className="border border-white/10 rounded-2xl overflow-hidden"
              >
                {/* Treatment header */}
                <div className="px-6 py-5 bg-white/[0.02]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-widest text-white/30 mb-2 block">
                        {treatment.category}
                      </span>
                      <h3 className="text-white font-semibold text-xl">
                        {treatment.name}
                      </h3>
                      <p className="text-white/50 text-sm mt-2 leading-relaxed">
                        {treatment.summary}
                      </p>
                    </div>
                    <Link
                      to={`/treatments/${treatment.slug}`}
                      className="text-xs text-white/30 hover:text-white/70 transition-colors shrink-0 mt-1"
                    >
                      Full page →
                    </Link>
                  </div>
                </div>

                {/* Protocol */}
                <div className="px-6 py-5 border-t border-white/5">
                  <p className="text-xs uppercase tracking-widest text-white/30 mb-3">
                    Protocol
                  </p>
                  <ul className="flex flex-col gap-2">
                    {previewSteps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/60">
                        <span className="text-white/20 shrink-0 w-4 text-right">
                          {i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>

                  {lockedSteps.length > 0 && (
                    isPro ? (
                      <ul className="flex flex-col gap-2 mt-2">
                        {lockedSteps.map((step, i) => (
                          <li key={i} className="flex gap-3 text-sm text-white/60">
                            <span className="text-white/20 shrink-0 w-4 text-right">
                              {i + 3}.
                            </span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <button
                        onClick={() => setShowUpgrade(true)}
                        className="mt-3 flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
                      >
                        🔒 {lockedSteps.length} more step{lockedSteps.length !== 1 ? "s" : ""} — unlock with Pro
                      </button>
                    )
                  )}
                </div>

                {/* Vendors */}
                {treatment.vendorIds.length > 0 && (
                  <div className="px-6 py-5 border-t border-white/5">
                    <p className="text-xs uppercase tracking-widest text-white/30 mb-4">
                      Where to buy
                    </p>
                    {isPro ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {treatment.vendorIds.map((id) => (
                          <VendorCard key={id} vendorId={id} productUrl={treatment.vendorProductUrls?.[id]} />
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowUpgrade(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white/50 hover:border-white/20 hover:text-white/70 transition-colors w-full"
                      >
                        <span>🔒</span>
                        <span>
                          {treatment.vendorIds.length} vetted vendor{treatment.vendorIds.length !== 1 ? "s" : ""} — unlock with Pro
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
