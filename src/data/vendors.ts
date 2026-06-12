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
    name: "Rogaine @ Costco CA",
    url: "https://www.costco.ca/rogaine-men%27s-hair-regrowth-foam-with-5%25-minoxidil%2C-6-x-60-g.product.100513970.html",
    type: "big-box",
    badge: "Best Price in CA",
    categories: ["Minoxidil"],
    ships: ["CA"],
    notes: "Costco Canada stocks Rogaine 5% foam in bulk — cheapest per-application price for minoxidil in Canada. Kirkland-brand minoxidil is US-only.",
    keyPrices: [{ item: "Rogaine 5% Foam (6×60g)", price: "~$60 CAD" }],
    trusted: true,
  },
  {
    id: "foligain",
    name: "Foligain",
    url: "https://www.foligain.com/products/foligain-minoxidil-5-hair-regrowth-treatment-for-men-3-month-supply-3-month-supply",
    type: "niche-ecom",
    badge: "Minoxidil Specialist",
    categories: ["Minoxidil", "Hair Loss"],
    ships: ["US", "CA", "International"],
    notes: "Hair loss specialist. Standard 5% minoxidil solution and Trioxidil (proprietary 10% blend with additional actives). Ships to Canada.",
    keyPrices: [
      { item: "Minoxidil 5% Solution (3-month supply)", price: "~$22 USD" },
      { item: "Trioxidil 10% Blend (3-month supply)", price: "~$35 USD" },
    ],
    trusted: true,
  },
  {
    id: "shoppers-drug-mart",
    name: "Shoppers Drug Mart",
    url: "https://www.shoppersdrugmart.ca/rogaine-men-s-5-minoxidil-foam-hair-loss-and-thinning-trea/p/BB_062600962348",
    type: "pharmacy",
    badge: "Most Accessible (CA)",
    categories: ["Minoxidil", "Skincare", "Hair Loss"],
    ships: ["CA"],
    notes: "In-store across Canada. Stocks Rogaine 5% and Life Brand generic minoxidil. Pharmacist on-site. Can fill ketoconazole 2% Rx.",
    keyPrices: [
      { item: "Rogaine 5% Foam (2×60g)", price: "~$50 CAD" },
      { item: "Life Brand Minoxidil 5% (2×60mL)", price: "~$35 CAD" },
    ],
    trusted: true,
  },

  // ── RESEARCH COMPOUNDS ────────────────────────────────────────────────────
  {
    id: "chemyo",
    name: "Chemyo",
    url: "https://www.chemyo.com/ru58841/",
    type: "research",
    badge: "Best for RU58841",
    categories: ["Research Compounds"],
    ships: ["US", "International"],
    notes: "Research compound vendor focused on hair-loss compounds and SARMs. COA on all products. Best source for RU58841 and pyrilutamide.",
    keyPrices: [
      { item: "RU58841 50mg/mL (50mL)", price: "~$45 USD" },
      { item: "Pyrilutamide 1% solution (50mL)", price: "~$55 USD" },
    ],
    trusted: true,
  },
  {
    id: "pure-rawz",
    name: "Pure Rawz",
    url: "https://purerawz.co/product/bpc-157/",
    type: "research",
    badge: "Wide Selection",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US", "International"],
    notes: "Research peptides and compounds. BPC-157, TB-500, GHK-Cu. COA available on all products.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$28 USD" },
      { item: "GHK-Cu 50mg", price: "~$22 USD" },
      { item: "RU58841 50mg/mL (50mL)", price: "~$48 USD" },
    ],
    trusted: true,
  },
  {
    id: "cosmic-peptides",
    name: "Cosmic Peptides",
    url: "https://cosmicpeptides.com/products/bpc-157",
    type: "research",
    badge: "Canada Friendly",
    categories: ["Peptides"],
    ships: ["US", "CA", "International"],
    notes: "Research peptide vendor with strong community reputation. Ships to Canada reliably. COA on all products. Competitive on BPC-157, TB-500, and GHK-Cu.",
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
    url: "https://www.bulksupplements.com/products/creatine-monohydrate",
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
    url: "https://nootropicsdepot.com/ksm-66-ashwagandha-extract-300mg-capsules",
    type: "supplement-store",
    badge: "Third-Party Tested",
    categories: ["Supplements"],
    ships: ["US", "International"],
    notes: "One of the most trusted supplement vendors for quality assurance. Third-party tested. Best for ashwagandha (KSM-66), tongkat ali, lion's mane, and nootropics.",
    keyPrices: [
      { item: "KSM-66 Ashwagandha 300mg (90ct)", price: "~$18 USD" },
      { item: "Tongkat Ali Extract (60ct)", price: "~$22 USD" },
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
    notes: "Massive selection of supplements and skincare. Ships to Canada affordably. Good for zinc, vitamin D, fish oil, and skincare basics.",
    keyPrices: [
      { item: "NOW Vitamin D3 5000IU (120ct)", price: "~$12 USD" },
      { item: "NOW Zinc Picolinate 50mg (120ct)", price: "~$8 USD" },
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
    notes: "Premium supplement brand used by pro athletes. NSF certified. Higher cost but best-in-class purity and bioavailability.",
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
    notes: "Clinical-grade skincare at near-cost pricing. Best source for niacinamide 10%, hyaluronic acid, alpha arbutin, azelaic acid, and AHA/BHA peels.",
    keyPrices: [
      { item: "Niacinamide 10% + Zinc 1% (30mL)", price: "~$7 USD" },
      { item: "Hyaluronic Acid 2% + B5 (30mL)", price: "~$7 USD" },
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
    notes: "Research-backed formulations. Gold standard for BHA (2% BHA Liquid Exfoliant) and AHA peels. No fragrance, no irritants.",
    keyPrices: [
      { item: "Skin Perfecting 2% BHA Liquid (30mL)", price: "~$35 USD" },
      { item: "25% AHA + 2% BHA Exfoliant Peel", price: "~$35 USD" },
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
    notes: "Widely-used Korean skincare brand. Best for snail mucin essence, BHA blackhead liquid, and CICA repair products.",
    keyPrices: [
      { item: "Snail 96 Mucin Power Essence (100mL)", price: "~$22 USD" },
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
