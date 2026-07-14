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

  // ── PEPTIDE / RESEARCH HOUSES ─────────────────────────────────────────────
  {
    id: "peptide-sciences",
    name: "Peptide Sciences",
    url: "https://www.peptidesciences.com",
    type: "research",
    badge: "Highest Purity",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US", "International"],
    notes: "US-based, one of the most established peptide vendors. Mass-spec + HPLC COA on every batch, ≥99% purity. Premium pricing but the reference standard for injectable peptides (BPC-157, TB-500, GH secretagogues, GLP-1s, tesamorelin).",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$40 USD" },
      { item: "Tesamorelin 5mg", price: "~$65 USD" },
      { item: "Semaglutide 5mg", price: "~$180 USD" },
    ],
    trusted: true,
  },
  {
    id: "limitless-life",
    name: "Limitless Life Nootropics",
    url: "https://limitlesslifenootropics.com",
    type: "research",
    badge: "Broad Peptide Range",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US", "International"],
    notes: "Wide catalog covering GH secretagogues, GLP-1s, tesamorelin, MOTS-c, and healing peptides. Third-party COA per batch. Strong community reputation for consistency and customer service.",
    keyPrices: [
      { item: "Ipamorelin/CJC-1295 blend 10mg", price: "~$70 USD" },
      { item: "Tirzepatide 10mg", price: "~$150 USD" },
      { item: "MOTS-c 10mg", price: "~$60 USD" },
    ],
    trusted: true,
  },
  {
    id: "amino-asylum",
    name: "Amino Asylum",
    url: "https://aminoasylum.shop",
    type: "research",
    badge: "Best Value Peptides",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US", "International"],
    notes: "Budget-friendly peptide and research-compound house. Cheapest common source for GLP-1s (semaglutide, tirzepatide), healing peptides, PT-141, and nootropic peptides. COA on request. Verify batch testing — value comes with more variance than premium vendors.",
    keyPrices: [
      { item: "Semaglutide 10mg", price: "~$90 USD" },
      { item: "BPC-157 10mg", price: "~$40 USD" },
      { item: "PT-141 10mg", price: "~$35 USD" },
    ],
    trusted: true,
  },
  {
    id: "swiss-chems",
    name: "Swiss Chems",
    url: "https://swisschems.is",
    type: "research",
    badge: "Best for Enclomiphene / PT-141",
    categories: ["Research Compounds", "Peptides"],
    ships: ["US", "International"],
    notes: "Research vendor known for orals in capsule form — enclomiphene, tadalafil — plus PT-141, melanotan, and peptides. Third-party COA published per product. Reliable international shipping.",
    keyPrices: [
      { item: "Enclomiphene 12.5mg (60ct)", price: "~$60 USD" },
      { item: "PT-141 10mg", price: "~$40 USD" },
      { item: "Melanotan II 10mg", price: "~$35 USD" },
    ],
    trusted: true,
  },
  {
    id: "mountain-west",
    name: "Mountain West MC",
    url: "https://mountainwestmc.com",
    type: "research",
    badge: "US Domestic Ship",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US"],
    notes: "US-domestic research peptide vendor — fast domestic shipping, third-party tested. Good for BPC-157, TB-500, GHK-Cu, and GH secretagogues when speed matters over the lowest price.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$35 USD" },
      { item: "GHK-Cu 50mg", price: "~$28 USD" },
    ],
    trusted: true,
  },

  // ── TELEHEALTH / PRESCRIPTION ─────────────────────────────────────────────
  {
    id: "felix",
    name: "Felix Health",
    url: "https://felixforyou.ca",
    type: "pharmacy",
    badge: "Canadian Telehealth",
    categories: ["Hair Loss", "Skincare", "Minoxidil"],
    ships: ["CA"],
    notes: "Canadian online medical platform — async consult with a licensed provider, prescription filled and shipped. Legitimate route for finasteride, dutasteride, tretinoin, and topical Rx blends without an in-person GP visit. Consult fee + medication cost.",
    keyPrices: [
      { item: "Finasteride 1mg (monthly)", price: "~$25 CAD/mo" },
      { item: "Tretinoin Rx (compounded)", price: "~$50 CAD" },
    ],
    trusted: true,
  },
  {
    id: "rocky",
    name: "Rocky Health",
    url: "https://www.rockyhealth.com",
    type: "pharmacy",
    badge: "Telehealth Rx (CA)",
    categories: ["Hair Loss", "Minoxidil", "Skincare"],
    ships: ["CA"],
    notes: "Canadian telehealth for hair loss and skin — finasteride, oral/topical minoxidil, and topical tretinoin via licensed prescribers. Offers compounded topical fin+min formulas popular on r/tressless.",
    keyPrices: [
      { item: "Topical Fin + Min compound", price: "~$45 CAD/mo" },
      { item: "Finasteride 1mg", price: "~$20 CAD/mo" },
    ],
    trusted: true,
  },
  {
    id: "alldaychemist",
    name: "AllDayChemist",
    url: "https://www.alldaychemist.com",
    type: "pharmacy",
    badge: "Generic Rx (International)",
    categories: ["Hair Loss", "Skincare", "Research Compounds"],
    ships: ["International", "CA", "US"],
    notes: "India-based mail-order pharmacy widely used by the community for generic prescription items — finasteride, dutasteride, tretinoin (Retino-A), tazarotene, isotretinoin, and Careprost (bimatoprost). Cheap, but grey-market: no local prescription enforced, longer shipping, and customs risk. Verify current legality for your region.",
    keyPrices: [
      { item: "Careprost (bimatoprost 0.03%, 3mL)", price: "~$18 USD" },
      { item: "Finasteride 1mg (Finpecia, 90ct)", price: "~$15 USD" },
      { item: "Tretinoin 0.05% (Retino-A)", price: "~$8 USD" },
    ],
    trusted: false,
  },
];
