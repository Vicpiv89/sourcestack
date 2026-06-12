export type VendorType =
  | "pharmacy"
  | "big-box"
  | "niche-ecom"
  | "marketplace"
  | "research"
  | "supplement-store";

export interface Vendor {
  id: string;
  name: string;
  url: string;
  type: VendorType;
  badge: string;
  categories: string[];
  ships: string[];
  notes: string;
  keyPrices: { item: string; price: string }[];
  trusted: boolean;
}

export const vendors: Vendor[] = [
  // ── MINOXIDIL ─────────────────────────────────────────────────────────────
  {
    id: "kirkland-costco",
    name: "Kirkland (Costco)",
    url: "https://www.costco.ca",
    type: "big-box",
    badge: "Best Price in CA",
    categories: ["Minoxidil"],
    ships: ["CA", "US"],
    notes: "Cheapest minoxidil per mL in Canada. 6-month supply ~$35 CAD. Buy in-store — online availability varies.",
    keyPrices: [{ item: "Minoxidil 5% (6×60mL)", price: "~$35 CAD" }],
    trusted: true,
  },
  {
    id: "foligain",
    name: "Foligain",
    url: "https://foligain.com/hair-loss/",
    type: "niche-ecom",
    badge: "Minoxidil Specialist",
    categories: ["Minoxidil", "Hair Loss"],
    ships: ["US", "CA", "International"],
    notes: "Hair loss specialist. Carries topical minoxidil, extra-strength formulas, and minoxidil + finasteride combos. Ships to Canada.",
    keyPrices: [
      { item: "Minoxidil 5% Solution (2×60mL)", price: "~$22 USD" },
      { item: "Minoxidil 10% Extra Strength (60mL)", price: "~$25 USD" },
    ],
    trusted: true,
  },
  {
    id: "shoppers-drug-mart",
    name: "Shoppers Drug Mart",
    url: "https://www.shoppersdrugmart.ca",
    type: "pharmacy",
    badge: "Most Accessible (CA)",
    categories: ["Minoxidil", "Skincare", "Hair Loss"],
    ships: ["CA"],
    notes: "In-store across Canada. Stocks Rogaine 5% and generic Life Brand minoxidil. Pharmacist consultation available. Can fill ketoconazole 2% Rx.",
    keyPrices: [
      { item: "Rogaine 5% Foam (2×60g)", price: "~$50 CAD" },
      { item: "Life Brand Minoxidil 5% (2×60mL)", price: "~$35 CAD" },
    ],
    trusted: true,
  },

  // ── RESEARCH COMPOUNDS + PEPTIDES ─────────────────────────────────────────
  {
    id: "chemyo",
    name: "Chemyo",
    url: "https://chemyo.com",
    type: "research",
    badge: "Competitive Pricing",
    categories: ["Research Compounds", "Peptides"],
    ships: ["US", "International"],
    notes: "Research compound vendor. COA on all products. Competitive pricing on peptides and hair-loss compounds like RU58841 and pyrilutamide.",
    keyPrices: [
      { item: "RU58841 50mg/mL (50mL)", price: "~$45 USD" },
      { item: "BPC-157 10mg", price: "~$40 USD" },
    ],
    trusted: true,
  },
  {
    id: "pure-rawz",
    name: "Pure Rawz",
    url: "https://purerawz.co",
    type: "research",
    badge: "Wide Selection",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US", "International"],
    notes: "Research peptides and compounds. BPC-157, TB-500, GHK-Cu. COA available on all products. Wider range than most vendors.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$28 USD" },
      { item: "GHK-Cu 50mg", price: "~$22 USD" },
      { item: "RU58841 50mg/mL (50mL)", price: "~$48 USD" },
    ],
    trusted: true,
  },
  {
    id: "peptide-sciences",
    name: "Peptide Sciences",
    url: "https://www.peptidesciences.com",
    type: "research",
    badge: "Highest Purity",
    categories: ["Peptides"],
    ships: ["US", "International"],
    notes: "High purity, widely trusted in the peptide community. Slightly pricier than alternatives but consistent quality and verified COAs.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$35 USD" },
      { item: "TB-500 5mg", price: "~$40 USD" },
      { item: "Ipamorelin 5mg", price: "~$30 USD" },
    ],
    trusted: true,
  },
  {
    id: "cosmic-peptides",
    name: "Cosmic Peptides",
    url: "https://cosmicpeptides.com",
    type: "research",
    badge: "Canada Friendly",
    categories: ["Peptides"],
    ships: ["US", "CA", "International"],
    notes: "Research peptide vendor with strong community reputation. Ships to Canada reliably. COA on all products. Competitive pricing on BPC-157 and TB-500.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$30 USD" },
      { item: "TB-500 5mg", price: "~$38 USD" },
      { item: "GHK-Cu 50mg", price: "~$24 USD" },
    ],
    trusted: true,
  },

  // ── SUPPLEMENTS ────────────────────────────────────────────────────────────
  {
    id: "bulk-supplements",
    name: "BulkSupplements",
    url: "https://www.bulksupplements.com",
    type: "supplement-store",
    badge: "Best Price per Gram",
    categories: ["Supplements"],
    ships: ["US", "CA", "International"],
    notes: "Cheapest price per gram on creatine, taurine, magnesium glycinate, and other bulk powders. No frills, just the compound.",
    keyPrices: [
      { item: "Creatine Monohydrate 1kg", price: "~$20 USD" },
      { item: "Magnesium Glycinate 500g", price: "~$18 USD" },
      { item: "Taurine 500g", price: "~$14 USD" },
    ],
    trusted: true,
  },
  {
    id: "swanson",
    name: "Swanson Health",
    url: "https://www.swansonvitamins.com",
    type: "supplement-store",
    badge: "Solid All-Rounder",
    categories: ["Supplements"],
    ships: ["US", "CA", "International"],
    notes: "Good mid-range supplement brand. Reliable for creatine, collagen, and a wide basic stack. Ships to Canada.",
    keyPrices: [
      { item: "Creatine Monohydrate 500g", price: "~$12 USD" },
      { item: "Collagen Peptides 400g", price: "~$15 USD" },
    ],
    trusted: true,
  },
  {
    id: "nootropics-depot",
    name: "Nootropics Depot",
    url: "https://nootropicsdepot.com",
    type: "supplement-store",
    badge: "Third-Party Tested",
    categories: ["Supplements"],
    ships: ["US", "International"],
    notes: "One of the most trusted supplement vendors for quality assurance. Third-party tested. Best for ashwagandha (KSM-66), tongkat ali, fadogia, lion's mane.",
    keyPrices: [
      { item: "KSM-66 Ashwagandha 60ct", price: "~$18 USD" },
      { item: "Tongkat Ali 60ct", price: "~$22 USD" },
      { item: "Fadogia Agrestis 60ct", price: "~$20 USD" },
    ],
    trusted: true,
  },
  {
    id: "iherb",
    name: "iHerb",
    url: "https://www.iherb.com",
    type: "supplement-store",
    badge: "Best for CA Shipping",
    categories: ["Supplements", "Skincare"],
    ships: ["US", "CA", "International"],
    notes: "Massive selection of supplements and skincare. Ships to Canada affordably with fast delivery. Good for zinc, vitamin D, fish oil, skincare basics.",
    keyPrices: [
      { item: "Vitamin D3 5000IU (360ct)", price: "~$12 USD" },
      { item: "Zinc Picolinate 50mg (100ct)", price: "~$8 USD" },
      { item: "Omega-3 (180ct)", price: "~$15 USD" },
    ],
    trusted: true,
  },
  {
    id: "thorne",
    name: "Thorne",
    url: "https://www.thorne.com",
    type: "supplement-store",
    badge: "NSF Certified",
    categories: ["Supplements"],
    ships: ["US", "CA", "International"],
    notes: "Premium supplement brand used by pro athletes. NSF certified. Higher cost but best-in-class purity and bioavailability. Worth it for magnesium, zinc, D3/K2.",
    keyPrices: [
      { item: "Magnesium Bisglycinate 90ct", price: "~$24 USD" },
      { item: "Zinc Picolinate 60ct", price: "~$18 USD" },
      { item: "D3/K2 60ct", price: "~$22 USD" },
    ],
    trusted: true,
  },

  // ── SKINCARE ──────────────────────────────────────────────────────────────
  {
    id: "the-ordinary",
    name: "The Ordinary",
    url: "https://theordinary.com",
    type: "niche-ecom",
    badge: "Best Value Skincare",
    categories: ["Skincare"],
    ships: ["US", "CA", "International"],
    notes: "Clinical-grade skincare at near-cost pricing. Best source for niacinamide 10%, hyaluronic acid, alpha arbutin, azelaic acid suspension, and AHAs. No fluff, no fragrance.",
    keyPrices: [
      { item: "Niacinamide 10% + Zinc 1% (30mL)", price: "~$7 USD" },
      { item: "Hyaluronic Acid 2% B5 (30mL)", price: "~$7 USD" },
      { item: "Alpha Arbutin 2% + HA (30mL)", price: "~$10 USD" },
      { item: "Azelaic Acid Suspension 10% (30mL)", price: "~$9 USD" },
    ],
    trusted: true,
  },
  {
    id: "paulas-choice",
    name: "Paula's Choice",
    url: "https://www.paulaschoice.com",
    type: "niche-ecom",
    badge: "Best BHA / AHA",
    categories: ["Skincare"],
    ships: ["US", "CA", "International"],
    notes: "Research-backed formulations. The gold standard for BHA (Skin Perfecting 2% BHA Liquid) and AHA exfoliants. No fragrance, no irritants. Ships to Canada.",
    keyPrices: [
      { item: "BHA 2% Liquid Exfoliant (30mL)", price: "~$35 USD" },
      { item: "AHA 8% + BHA 2% Peel (100mL)", price: "~$35 USD" },
    ],
    trusted: true,
  },
  {
    id: "cosrx",
    name: "COSRX",
    url: "https://www.cosrx.com",
    type: "niche-ecom",
    badge: "K-Beauty Essential",
    categories: ["Skincare"],
    ships: ["US", "CA", "International"],
    notes: "Widely-used Korean skincare brand. Best for snail mucin essence, low-pH cleanser, and CICA products. Community-tested and routinely recommended on r/SkincareAddiction.",
    keyPrices: [
      { item: "Snail Mucin 96% Power Essence (100mL)", price: "~$22 USD" },
      { item: "BHA Blackhead Power Liquid (100mL)", price: "~$25 USD" },
    ],
    trusted: true,
  },

  // ── MARKETPLACE ────────────────────────────────────────────────────────────
  {
    id: "amazon-ca",
    name: "Amazon Canada",
    url: "https://www.amazon.ca",
    type: "marketplace",
    badge: "Fastest Shipping",
    categories: ["Supplements", "Skincare", "Minoxidil", "Hair Loss"],
    ships: ["CA"],
    notes: "Prime delivery (1–2 days). Good for name-brand products — Rogaine, Differin, Nizoral, Kirkland. Always verify seller is 'Sold by Amazon.ca' or the brand directly.",
    keyPrices: [],
    trusted: false,
  },
];
