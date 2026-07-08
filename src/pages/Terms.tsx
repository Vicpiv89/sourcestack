import SEO from "../components/SEO";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "1. What SourceStack is",
    body: [
      "SourceStack is an informational and educational subscription service. We aggregate publicly available information about cosmetic self-improvement routines, compounds, and third-party retailers into a searchable database, and provide software tools (including a browser-based face measurement tool) for organizing that information.",
      "SourceStack does not sell, manufacture, ship, or fulfill any physical product. We are not a pharmacy, clinic, medical provider, or marketplace. Purchases from any vendor listed in our directory are made entirely at your own discretion, on that vendor's site, under that vendor's terms.",
    ],
  },
  {
    title: "2. Not medical advice",
    body: [
      "Nothing on SourceStack is medical advice, diagnosis, or treatment. Content describing compounds, dosing references, timing, or routines is a summary of publicly available community and published information, provided for educational purposes only.",
      "Some compounds referenced in the database are research chemicals not approved by any regulatory body for human use, or prescription medications that are illegal to use without a prescription in most jurisdictions. Consult a licensed physician before starting, stopping, or combining anything. You are solely responsible for complying with the laws of your jurisdiction.",
      "The face scan tool produces geometric estimates from a photograph for informational and entertainment purposes. Its scores are not a psychological, medical, or professional assessment of any kind.",
    ],
  },
  {
    title: "3. Eligibility",
    body: [
      "You must be at least 18 years old to create an account or purchase a subscription.",
    ],
  },
  {
    title: "4. Subscription, billing, and cancellation",
    body: [
      "SourceStack Pro is a paid subscription billed monthly at the price shown at checkout (currently $19/month). Your subscription renews automatically each month until you cancel. Payments are processed by Stripe; we never see or store your card details.",
      "You can cancel anytime from your Account page (Manage / cancel subscription), which opens Stripe's secure billing portal. Cancellation stops future renewals; you keep access until the end of the period you already paid for.",
      "If you believe you were billed in error, contact us at hello@sourcestack.io and we'll sort it out. Refund requests are handled case by case.",
    ],
  },
  {
    title: "5. Affiliate disclosure",
    body: [
      "Some outbound links to third-party retailers may be affiliate links, meaning SourceStack may earn a commission on purchases made through them, at no additional cost to you. Affiliate relationships do not determine trust notes or inclusion in the directory.",
    ],
  },
  {
    title: "6. Acceptable use",
    body: [
      "Don't scrape, resell, or redistribute database content; don't share your account; don't use the service for anything unlawful. We may suspend accounts that violate these terms.",
    ],
  },
  {
    title: "7. Disclaimer of warranties and limitation of liability",
    body: [
      "The service is provided \"as is\" without warranties of any kind. Information may be incomplete, outdated, or wrong; vendors listed may change their practices at any time. To the maximum extent permitted by law, SourceStack and its operators are not liable for any damages arising from your use of the service or from decisions you make based on its content — including purchases from third-party vendors and use of any compound or routine.",
    ],
  },
  {
    title: "8. Changes",
    body: [
      "We may update these terms as the service evolves. Material changes will be reflected on this page with continued use constituting acceptance. Questions: hello@sourcestack.io.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Terms of Service"
        description="SourceStack terms of service — subscription terms, billing, cancellation, and disclaimers."
        path="/terms"
      />
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-2xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-white/30 text-xs mb-10">Last updated: July 8, 2026</p>
        <div className="flex flex-col gap-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2 className="text-white font-semibold text-sm mb-2">{s.title}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-white/45 text-sm leading-relaxed mb-2.5">{p}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
