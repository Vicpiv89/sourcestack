import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e5e5]">
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        <Link
          to="/"
          className="text-white/30 text-sm hover:text-white/60 transition-colors mb-8 block"
        >
          ← Home
        </Link>

        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Disclaimer
        </h1>
        <p className="text-white/30 text-sm mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-white/60 text-sm leading-relaxed">
          <section>
            <h2 className="text-white font-semibold mb-2">
              Not Medical Advice
            </h2>
            <p>
              SourceStack is an informational reference platform. Nothing on
              this site constitutes medical advice, diagnosis, or treatment. All
              content — including treatment protocols, dosing information, safety
              notes, and vendor listings — is provided for educational and
              informational purposes only.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">
              Consult a Professional
            </h2>
            <p>
              Always consult a qualified healthcare professional before starting
              any supplement, compound, or topical protocol. This is especially
              important for prescription substances (finasteride, dutasteride,
              tretinoin), injectable research peptides (BPC-157, TB-500,
              Ipamorelin, etc.), and any product that interacts with existing
              medications or health conditions.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">
              Research Compounds
            </h2>
            <p>
              Several compounds listed on this site (including peptides and
              SARMs) are classified as research chemicals and are not approved
              for human use by the FDA, Health Canada, or equivalent regulatory
              bodies. They are sold for research purposes only. Use of these
              compounds carries unknown long-term risks. SourceStack does not
              endorse, encourage, or facilitate their use in humans.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">
              Affiliate Disclosure
            </h2>
            <p>
              Some vendor links on this site may be affiliate links. If you
              purchase through these links, SourceStack may earn a commission at
              no additional cost to you. Affiliate relationships do not
              influence vendor rankings or editorial content. All vendors are
              listed based on community reputation, price, and quality of
              third-party testing.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">
              Accuracy of Information
            </h2>
            <p>
              Pricing, availability, and vendor information changes frequently.
              SourceStack makes no guarantees about the accuracy, completeness,
              or timeliness of any information on this site. Always verify
              current pricing and availability directly with vendors before
              purchasing.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, SourceStack and its
              operators shall not be liable for any direct, indirect, incidental,
              consequential, or punitive damages arising from your use of this
              site or any information contained herein. Your use of this site is
              entirely at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-2">
              No Endorsement of Vendors
            </h2>
            <p>
              Vendor listings are provided as a community resource. SourceStack
              does not personally endorse, vouch for, or guarantee the quality
              of any third-party vendor. Always review a vendor's current
              certificate of analysis (COA) before purchasing research compounds.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
