import SEO from "../components/SEO";

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Your face photos never leave your device",
    body: [
      "The face scan runs entirely in your browser using on-device machine learning. Your photo is never uploaded, transmitted, or stored by us — we technically cannot see it. If you choose to save a scan (Pro feature), only the numeric measurements and scores are stored, never the image.",
    ],
  },
  {
    title: "What we collect",
    body: [
      "Account: your email address and a hashed password, stored with our authentication provider (Supabase).",
      "Subscription: your subscription status and Stripe customer reference. Payment details (card numbers) are handled entirely by Stripe and never touch our servers.",
      "Saved scans (Pro, optional): the numeric measurements, scores, and goals you choose to save.",
      "Local storage: preferences like your in-progress stack are stored in your own browser, not on our servers.",
    ],
  },
  {
    title: "What we don't do",
    body: [
      "We don't sell your data. We don't share it with advertisers. We don't store your photos. We don't track you across other websites.",
    ],
  },
  {
    title: "Third-party services",
    body: [
      "We rely on Supabase (authentication and database, hosted infrastructure), Stripe (payments and billing portal), and Render (site hosting). Each processes only what's needed for its function under its own privacy policy. Outbound links to vendor sites are governed by those sites' policies.",
    ],
  },
  {
    title: "Deleting your data",
    body: [
      "You can delete saved scans from your Account page at any time. To delete your account and all associated data, email hello@sourcestack.io from your account email and we'll remove it.",
    ],
  },
  {
    title: "Contact",
    body: ["Questions about privacy: hello@sourcestack.io."],
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO
        title="Privacy Policy"
        description="SourceStack privacy policy — photos never leave your device, no data selling, minimal collection."
        path="/privacy"
      />
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Legal</p>
        <h1 className="text-2xl font-bold text-white mb-2">Privacy Policy</h1>
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
