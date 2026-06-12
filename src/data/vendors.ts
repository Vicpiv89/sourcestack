export type Category =
  | "Minoxidil"
  | "Peptides"
  | "Supplements"
  | "Research Compounds"
  | "Skincare";

export interface Vendor {
  id: string;
  name: string;
  url: string;
  categories: Category[];
  ships: string[];
  notes: string;
  keyPrices: { item: string; price: string }[];
  trusted: boolean;
}

export const vendors: Vendor[] = [
  {
    id: "kirkland-costco",
    name: "Kirkland (Costco)",
    url: "https://www.costco.ca",
    categories: ["Minoxidil"],
    ships: ["CA", "US"],
    notes: "Cheapest minoxidil per mL in Canada. 6-month supply ~$35 CAD.",
    keyPrices: [{ item: "Minoxidil 5% (6-pack 60mL)", price: "~$35 CAD" }],
    trusted: true,
  },
  {
    id: "swanson",
    name: "Swanson Health",
    url: "https://www.swansonvitamins.com",
    categories: ["Supplements"],
    ships: ["US", "CA", "International"],
    notes: "Cheap bulk supplements. Good for creatine, collagen, basic stack.",
    keyPrices: [
      { item: "Creatine Monohydrate 500g", price: "~$12 USD" },
      { item: "Collagen Peptides 400g", price: "~$15 USD" },
    ],
    trusted: true,
  },
  {
    id: "pure-rawz",
    name: "Pure Rawz",
    url: "https://purerawz.co",
    categories: ["Peptides", "Research Compounds"],
    ships: ["US", "International"],
    notes: "Research peptides. BPC-157, TB-500, GHK-Cu. COA available.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$28 USD" },
      { item: "GHK-Cu 50mg", price: "~$22 USD" },
    ],
    trusted: true,
  },
  {
    id: "peptide-sciences",
    name: "Peptide Sciences",
    url: "https://www.peptidesciences.com",
    categories: ["Peptides"],
    ships: ["US", "International"],
    notes: "High purity, widely used in the community. Slightly pricier but reliable.",
    keyPrices: [
      { item: "BPC-157 5mg", price: "~$35 USD" },
      { item: "TB-500 5mg", price: "~$40 USD" },
    ],
    trusted: true,
  },
  {
    id: "bulk-supplements",
    name: "BulkSupplements",
    url: "https://www.bulksupplements.com",
    categories: ["Supplements"],
    ships: ["US", "CA", "International"],
    notes: "Best price per gram on creatine, taurine, mag glycinate, etc.",
    keyPrices: [
      { item: "Creatine Monohydrate 1kg", price: "~$20 USD" },
      { item: "Magnesium Glycinate 500g", price: "~$18 USD" },
    ],
    trusted: true,
  },
  {
    id: "nootropics-depot",
    name: "Nootropics Depot",
    url: "https://nootropicsdepot.com",
    categories: ["Supplements"],
    ships: ["US", "International"],
    notes: "Third-party tested supplements. One of the most trusted sources for quality assurance. Good for ashwagandha, tongkat ali, fadogia.",
    keyPrices: [
      { item: "KSM-66 Ashwagandha 60ct", price: "~$18 USD" },
      { item: "Tongkat Ali 60ct", price: "~$22 USD" },
    ],
    trusted: true,
  },
  {
    id: "chemyo",
    name: "Chemyo",
    url: "https://chemyo.com",
    categories: ["Research Compounds"],
    ships: ["US", "International"],
    notes: "Research compound vendor. Competitive pricing, COA on all products. Widely used alternative to Pure Rawz.",
    keyPrices: [
      { item: "BPC-157 10mg", price: "~$40 USD" },
      { item: "Ipamorelin 5mg", price: "~$32 USD" },
    ],
    trusted: true,
  },
  {
    id: "iherb",
    name: "iHerb",
    url: "https://www.iherb.com",
    categories: ["Supplements", "Skincare"],
    ships: ["US", "CA", "International"],
    notes: "Massive selection of supplements and skincare. Ships to Canada affordably. Good for everyday basics — zinc, vitamin D, fish oil, niacinamide.",
    keyPrices: [
      { item: "Vitamin D3 5000IU (360ct)", price: "~$12 USD" },
      { item: "Zinc Picolinate 50mg (100ct)", price: "~$8 USD" },
    ],
    trusted: true,
  },
  {
    id: "thorne",
    name: "Thorne",
    url: "https://www.thorne.com",
    categories: ["Supplements"],
    ships: ["US", "CA", "International"],
    notes: "Premium supplement brand used by professional athletes. NSF certified. Higher cost but best-in-class purity and bioavailability.",
    keyPrices: [
      { item: "Magnesium Bisglycinate 90ct", price: "~$24 USD" },
      { item: "Zinc Picolinate 60ct", price: "~$18 USD" },
    ],
    trusted: true,
  },
];
