export interface Treatment {
  slug: string;
  name: string;
  category: string;
  summary: string;
  protocol: string[];
  safety: string[];
  issueSlugs: string[];
  vendorIds: string[];
  vendorProductUrls?: Record<string, string>;
}

export const treatments: Treatment[] = [

  // ── MINOXIDIL ──────────────────────────────────────────────────────────────
  {
    slug: "minoxidil-topical",
    name: "Minoxidil (Topical 5%)",
    category: "Hair Loss",
    summary:
      "Topical vasodilator that extends the anagen (growth) phase of hair follicles. Most studied OTC treatment for beard and brow growth. Results at 3–6 months. Kirkland 5% is the cheapest legitimate source in Canada.",
    protocol: [
      "Apply 1mL to target area once daily (PM preferred)",
      "Use a 0.5mm dermaroller 1–2x/week on rest days to increase absorption by up to 80%",
      "Do not wash area for 4 hours post-application",
      "Minimum 6-month commitment — results visible at 3 months",
      "For brow tails: use a separate small applicator, apply sparingly, avoid eye area",
    ],
    safety: [
      "Do not apply near eyes — use separate applicator for brow tail",
      "Avoid if pregnant or breastfeeding",
      "Discontinue if severe scalp/skin irritation occurs",
      "Shedding in weeks 2–8 is normal (telogen effluvium) — don't stop",
    ],
    issueSlugs: ["thin-brows", "beard-growth", "hair-loss"],
    vendorIds: ["kirkland-costco", "foligain", "shoppers-drug-mart", "amazon-ca"],
    vendorProductUrls: {
      "kirkland-costco": "https://www.costco.ca/rogaine-men%27s-hair-regrowth-foam-with-5%25-minoxidil%2C-6-x-60-g.product.100513970.html",
      "foligain": "https://www.foligain.com/products/foligain-minoxidil-5-hair-regrowth-treatment-for-men-3-month-supply-3-month-supply",
      "shoppers-drug-mart": "https://www.shoppersdrugmart.ca/rogaine-men-s-5-minoxidil-foam-hair-loss-and-thinning-trea/p/BB_062600962348",
      "amazon-ca": "https://www.amazon.ca/Kirkland-Minoxidil-Strength-Regrowth-wLCqOt/dp/B0719S59PW",
    },
  },

  // ── HAIR LOSS ──────────────────────────────────────────────────────────────
  {
    slug: "ru58841",
    name: "RU58841",
    category: "Hair Loss",
    summary:
      "Non-steroidal topical androgen receptor antagonist that blocks DHT from binding to scalp follicle receptors without reducing systemic testosterone. Never taken through full clinical trials — community use on r/tressless is widespread but entirely anecdotal. Applied topically so systemic exposure is low but not zero.",
    protocol: [
      "Dissolve to 5% solution in a carrier (PG/ethanol mix); common pre-made solutions are 50mg/mL",
      "Apply 1mL (50mg) once daily to dry scalp, or 0.5mL twice daily — BID preferred given the ~1hr topical half-life",
      "Target temples, vertex, and hairline; massage gently and allow full absorption before lying down",
      "Wait 30–60 min before applying other products or minoxidil; most users stack both",
      "Reassess at 3–6 months; if stopping, taper over 2 weeks to avoid rebound shedding",
    ],
    safety: [
      "No completed human clinical trials — long-term systemic absorption data is entirely absent",
      "Anecdotal reports of chest pain, brain fog, and sexual dysfunction exist; causation unconfirmed but cannot be ruled out",
      "KB carrier vehicles increase systemic absorption vs PG/ethanol — lower-absorption vehicles are safer",
      "Scalp irritation and dryness are the most common real-world side effects, often carrier-related",
      "Sourcing risk is high — purity varies wildly; only use vendors with third-party lab COAs",
    ],
    issueSlugs: ["hair-loss"],
    vendorIds: ["chemyo", "pure-rawz"],
    vendorProductUrls: {
      "chemyo": "https://www.chemyo.com/ru58841/",
      "pure-rawz": "https://purerawz.co/product/ru58841/",
    },
  },
  {
    slug: "pyrilutamide",
    name: "Pyrilutamide (KX-826)",
    category: "Hair Loss",
    summary:
      "Next-generation topical anti-androgen developed by Kintor Pharma — the furthest-along topical anti-androgen in clinical trials. Phase III data confirmed 46% of patients achieved ≥10 hairs/cm² increase at 52 weeks with zero drug-related sexual dysfunction. Not yet approved by any regulator but available as a research compound.",
    protocol: [
      "Phase III used 0.5% solution once daily (women) or twice daily (men); 1.0% shows superior outcomes",
      "Apply 1mL to affected scalp areas daily; split BID for men preferred",
      "Apply to dry scalp, allow full absorption (~30 min) before pillow contact or other topicals",
      "Stack with minoxidil: different mechanisms (AR blockade vs vasodilation); apply minoxidil 30 min after pyrilutamide",
      "Minimum 6-month trial; 53% hair count response rate in men, 48% in women at 52 weeks",
    ],
    safety: [
      "Not FDA or EMA approved — only available as research chemical or gray-market imports",
      "Mild adverse effects in trials: skin irritation, redness, itch — incidence was low and transient",
      "No systemic hormonal suppression observed in Phase III — FSH, LH, and testosterone levels were stable",
      "No long-term (>52 week) safety data for DIY users yet exists",
      "Gray-market solutions may be mislabeled — purity verification is essential",
    ],
    issueSlugs: ["hair-loss"],
    vendorIds: ["chemyo", "pure-rawz"],
    vendorProductUrls: {
      "chemyo": "https://www.chemyo.com/pyrilutamide/",
      "pure-rawz": "https://purerawz.co/product/pyrilutamide/",
    },
  },
  {
    slug: "ketoconazole-shampoo",
    name: "Ketoconazole Shampoo",
    category: "Hair Loss",
    summary:
      "Antifungal shampoo with mild local anti-androgenic effects at the scalp — reduces follicular DHT by 12–16% and improves anagen-to-telogen ratio over 6 months. Lowest-risk adjunct in a hair-loss stack. The 2% prescription version shows stronger results than 1% OTC (Nizoral).",
    protocol: [
      "Use 2% ketoconazole shampoo (prescription) or 1% OTC Nizoral, 2–3x per week",
      "Apply to wet scalp, lather, and leave on for 5 minutes before rinsing — contact time is essential",
      "On non-keto days use a gentle sulfate-free shampoo to avoid over-drying",
      "Cumulative benefit — use indefinitely as maintenance alongside minoxidil or finasteride",
      "1% OTC can be used 3x/week if 2% unavailable; slightly less effective but still beneficial",
    ],
    safety: [
      "Daily use causes significant scalp dryness and irritation — cap at 3x per week",
      "Do not use on broken, eczematous, or actively inflamed scalp",
      "Systemic absorption from shampoo use is minimal; relevant only if known liver sensitivity",
      "Mild contact dermatitis in a small percentage of users — discontinue if persistent",
      "Not a standalone treatment; clinical significance is as an adjunct to minoxidil or 5AR inhibitors",
    ],
    issueSlugs: ["hair-loss", "dandruff"],
    vendorIds: ["shoppers-drug-mart", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "amazon-ca": "https://www.amazon.ca/Nizoral-Ketoconazole-Percent-Anti-dandruff-Shampoo/dp/B0FV52GFBX",
    },
  },
  {
    slug: "rosemary-oil",
    name: "Rosemary Oil (Topical)",
    category: "Hair Loss",
    summary:
      "Demonstrated equivalent hair-count improvement to 2% minoxidil in a 2015 RCT (Panahi et al., 100 participants, 6 months) with less scalp itching. Mechanism: improved scalp microcirculation and mild 5-alpha reductase inhibition. The most evidence-backed natural hair-loss intervention — works well as a low-risk starting point or minoxidil stack.",
    protocol: [
      "Dilute rosemary essential oil to 2–3% in jojoba carrier: ~12–15 drops per 30mL carrier",
      "Apply 1–2mL of diluted oil directly to scalp twice daily, massage 2–3 minutes",
      "Leave on scalp — overnight application + morning rinse works well",
      "Stack with minoxidil: apply rosemary oil first, wait 20–30 min, then apply minoxidil",
      "Consistency over 6 months matters most — equal to 2% (not 5%) minoxidil at 6 months",
    ],
    safety: [
      "Never apply undiluted rosemary essential oil — causes chemical burns",
      "Patch test diluted solution on inner arm first — allergic contact dermatitis is documented",
      "Effects are modest — equivalent to 2% minoxidil only; set realistic expectations",
      "Use GC/MS-tested brands (Florihana, Plant Therapy) — cheap oils are often adulterated",
      "No significant systemic risks at topical doses",
    ],
    issueSlugs: ["hair-loss", "thin-brows"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "saw-palmetto",
    name: "Saw Palmetto",
    category: "Hair Loss",
    summary:
      "Competitive non-selective inhibitor of 5-alpha reductase (both Type I and II), reducing DHT from testosterone. Effect size is meaningfully weaker than finasteride 1mg but with a better sexual side-effect profile. A 2025 RCT confirmed hair-count improvements — reasonable low-risk entry point before committing to pharmaceuticals.",
    protocol: [
      "320mg/day of liposterolic extract (85–95% fatty acids) in one dose or 160mg BID",
      "Take with a fat-containing meal — fatty acid content improves absorption with dietary fat",
      "Allow 3–6 months minimum before evaluating efficacy",
      "Stack with ketoconazole shampoo and rosemary oil for a full natural approach before considering finasteride",
      "If moving to finasteride, taper off over 2 weeks to avoid confounding shedding patterns",
    ],
    safety: [
      "GI upset (nausea, diarrhea) is the most common side effect — take with food",
      "Reduced libido reported less frequently than finasteride, but it does occur in a minority of users",
      "Inhibits both Type I and II 5AR — affects more tissues than finasteride (Type II selective); unclear clinical significance",
      "Potentiates anticoagulants (warfarin, aspirin) — increased bleeding risk; avoid pre-surgery",
      "Supplement quality varies enormously — use products standardized to fatty acid content",
    ],
    issueSlugs: ["hair-loss", "androgenic-acne"],
    vendorIds: ["nootropics-depot", "iherb"],
  },
  {
    slug: "finasteride",
    name: "Finasteride",
    category: "Research Compounds",
    summary:
      "5-alpha reductase inhibitor. Reduces DHT conversion, directly blocking the primary driver of male pattern baldness. Most effective pharmaceutical option for hairline preservation. Often stacked with minoxidil for compounding effect.",
    protocol: [
      "1mg orally once daily — consistency matters more than timing",
      "Results visible at 6–12 months — give it a full year before evaluating",
      "Stack with minoxidil for compounding effect: different mechanisms work synergistically",
    ],
    safety: [
      "Prescription required in most countries — consult a physician",
      "Post-finasteride syndrome (persistent sexual side effects) reported in a minority of users",
      "Do not use if trying to conceive — affects sperm quality",
      "Not for use by women, especially those who are or may become pregnant",
      "Discontinue if mood changes or sexual side effects occur",
    ],
    issueSlugs: ["hair-loss"],
    vendorIds: ["felix", "rocky", "alldaychemist", "swiss-chems"],
    vendorProductUrls: {
      "felix": "https://felixforyou.ca/hair-loss/",
      "rocky": "https://www.rockyhealth.com",
    },
  },
  {
    slug: "dutasteride",
    name: "Dutasteride",
    category: "Research Compounds",
    summary:
      "Stronger 5-alpha reductase inhibitor than finasteride — blocks both type I and II enzymes, reducing DHT more completely. Off-label for hair loss but more effective at equivalent doses.",
    protocol: [
      "0.5mg orally once daily",
      "Half-life is 5 weeks — takes months to reach steady state",
      "Can be dosed less frequently (0.5mg 3x/week) off-cycle",
    ],
    safety: [
      "Prescription required — consult a physician",
      "All finasteride warnings apply, potentially amplified",
      "Very long half-life — side effects persist long after stopping",
      "Not for use by women",
    ],
    issueSlugs: ["hair-loss"],
    vendorIds: ["felix", "alldaychemist", "swiss-chems"],
  },
  {
    slug: "biotin",
    name: "Biotin (Vitamin B7)",
    category: "Supplements",
    summary:
      "B-vitamin essential for keratin production. Most effective for those with a confirmed deficiency — which is a real and underdiagnosed cause of hair thinning. Aggressively marketed but weak evidence for those without deficiency.",
    protocol: [
      "2500–5000mcg daily with food",
      "Most effective if deficiency confirmed — bloodwork helps",
      "Takes 3–6 months to see hair/nail changes",
    ],
    safety: [
      "Very safe — water soluble, excess excreted",
      "Can interfere with thyroid and cardiac biomarker lab tests at high doses — inform your doctor",
    ],
    issueSlugs: ["hair-loss", "thin-brows"],
    vendorIds: ["iherb", "swanson", "amazon-ca"],
  },

  // ── EYELASH / BROW ─────────────────────────────────────────────────────────
  {
    slug: "careprost-bimatoprost",
    name: "Careprost / Bimatoprost 0.03%",
    category: "Skincare",
    summary:
      "Bimatoprost (Latisse in the US; Careprost is the Indian generic at 1/10th the cost) is the only FDA-approved topical treatment for eyelash hypotrichosis. Extends anagen phase and increases the number of hairs in anagen. Clinical studies show significant improvements in lash length, thickness, and darkness over 12–16 weeks.",
    protocol: [
      "Apply one drop of 0.03% bimatoprost to a sterile eyeliner brush or single-use applicator",
      "Swipe once along upper eyelid margin at the base of lashes — not lower lid (fluid migrates down naturally)",
      "Apply every night before bed; remove excess with tissue to reduce ocular exposure",
      "Growth visible at 8 weeks; full effect at 12–16 weeks",
      "For brow application: thin line along desired brow area nightly — off-label but effective per trials",
    ],
    safety: [
      "Permanent iris pigmentation change (increased brown pigment) reported in 0.4–3% of glaucoma patients using ocular drops — risk is lower with lid-line application but is non-reversible",
      "Periorbital fat atrophy (sunken eye appearance) is a real documented side effect with chronic eyelid application — avoid excess product",
      "Effects completely reverse 4–6 months after stopping — requires ongoing use to maintain",
      "Redness and itching of the eyelid margin are common early side effects; usually resolves in 1–2 weeks",
      "Buy Careprost from verified international pharmacy sources — gray-market purity varies",
    ],
    issueSlugs: ["eyelash-growth", "thin-brows"],
    vendorIds: ["alldaychemist", "amazon-ca"],
    vendorProductUrls: {
      "alldaychemist": "https://www.alldaychemist.com/careprost-bimatoprost-ophthalmic-solution.html",
    },
  },
  {
    slug: "latanoprost",
    name: "Latanoprost 0.005%",
    category: "Skincare",
    summary:
      "Prostaglandin F2α analogue (same class as bimatoprost) with documented eyelash-lengthening and darkening effects. Available as generic Xalatan — cheaper than Careprost in some markets. Less studied for cosmetic lash use than bimatoprost but shows comparable results.",
    protocol: [
      "Apply 1 drop of 0.005% latanoprost ophthalmic solution to a sterile brush, swipe along upper lash line nightly",
      "Growth visible at 8–12 weeks; color change (darkening) often occurs within 4–6 weeks",
      "For eyebrow growth: apply thinly along existing brow hair nightly — works better for sparse healthy brows",
      "Results maintained with ongoing use; fade within 3–4 months of stopping",
    ],
    safety: [
      "Same iris pigmentation risk as bimatoprost — real but lower-probability with careful lid-line application",
      "Periorbital fat atrophy risk — do not let solution pool around the orbital rim",
      "Vellus hair darkening on periorbital skin is common — blot excess immediately",
      "Effects are not permanent — requires ongoing use",
    ],
    issueSlugs: ["eyelash-growth", "thin-brows"],
    vendorIds: ["alldaychemist", "felix"],
  },

  // ── PEPTIDES ───────────────────────────────────────────────────────────────
  {
    slug: "ghk-cu",
    name: "GHK-Cu (Copper Peptide)",
    category: "Peptides",
    summary:
      "Naturally occurring copper complex with strong evidence for hair follicle stimulation, collagen synthesis, and wound healing. Used topically or subcutaneously. One of the safest peptides with decades of clinical research.",
    protocol: [
      "Topical: apply 2–3 drops to target area AM or PM, allow to absorb",
      "Injectable: 200–400mcg subcutaneous daily, cycle 8 weeks on / 4 weeks off",
      "Stack with dermaroller for enhanced topical penetration — 40–80x absorption increase post-needling",
    ],
    safety: [
      "Generally well tolerated — one of the safest peptides",
      "Topical may cause mild redness initially — expected",
      "Source from vendors with COA — purity matters for injectables",
    ],
    issueSlugs: ["thin-brows", "under-eye-hollows", "hair-loss", "skin-clarity"],
    vendorIds: ["pure-rawz", "cosmic-peptides", "peptide-sciences", "limitless-life", "mountain-west"],
    vendorProductUrls: {
      "pure-rawz": "https://purerawz.co/product/ghk-cu/",
      "cosmic-peptides": "https://cosmicpeptides.com/products/ghk-cu",
      "peptide-sciences": "https://www.peptidesciences.com/ghk-cu-50mg",
      "mountain-west": "https://mountainwestmc.com",
    },
  },
  {
    slug: "bpc-157",
    name: "BPC-157",
    category: "Peptides",
    summary:
      "Body Protection Compound. Accelerates tendon, ligament, and muscle repair. Strong anecdotal and animal model evidence for injury recovery and gut health. Most commonly used by athletes for joint and tendon issues.",
    protocol: [
      "250–500mcg subcutaneous or intramuscular, once or twice daily",
      "Inject near injury site for targeted effect",
      "Cycle 4–8 weeks — most users see results within 2 weeks",
    ],
    safety: [
      "Not approved for human use — research compound",
      "No serious adverse effects reported at standard doses",
      "Buy from vendors with third-party COA only",
      "Store lyophilized at -20°C, reconstituted at 4°C, use within 30 days",
    ],
    issueSlugs: ["recovery", "muscle-mass"],
    vendorIds: ["pure-rawz", "cosmic-peptides", "peptide-sciences", "amino-asylum", "mountain-west"],
    vendorProductUrls: {
      "pure-rawz": "https://purerawz.co/product/bpc-157/",
      "cosmic-peptides": "https://cosmicpeptides.com/products/bpc-157",
      "peptide-sciences": "https://www.peptidesciences.com/bpc-157-5mg",
    },
  },
  {
    slug: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    category: "Peptides",
    summary:
      "Systemic recovery peptide. Promotes tissue repair, reduces inflammation, increases flexibility. Often stacked with BPC-157 for injury recovery — different mechanisms work synergistically.",
    protocol: [
      "Loading: 4–8mg/week for 4–6 weeks split across 2 injections",
      "Maintenance: 2–2.5mg biweekly",
      "Typically subcutaneous — injection site doesn't need to be near the injury",
    ],
    safety: [
      "Research compound — not approved for human use",
      "May promote growth in existing tumors — avoid if cancer history",
      "No significant side effects at standard doses in healthy individuals",
    ],
    issueSlugs: ["recovery"],
    vendorIds: ["pure-rawz", "cosmic-peptides", "peptide-sciences", "amino-asylum"],
    vendorProductUrls: {
      "pure-rawz": "https://purerawz.co/product/tb-500/",
      "cosmic-peptides": "https://cosmicpeptides.com/products/tb-500",
    },
  },
  {
    slug: "ipamorelin-cjc",
    name: "Ipamorelin / CJC-1295",
    category: "Peptides",
    summary:
      "Growth hormone secretagogue stack. Ipamorelin triggers GH pulses; CJC-1295 extends the release window. Used for improved body composition, recovery, and sleep quality. Sleep-time dosing maximizes GH pulse during the natural nocturnal peak.",
    protocol: [
      "100–300mcg Ipamorelin + 100–300mcg CJC-1295 (no DAC) per injection",
      "Inject subcutaneously 30–60 min before sleep on an empty stomach",
      "5 days on / 2 days off or daily — cycle 8–12 weeks",
      "Fast for 2 hours before dosing — food (especially carbs) blunts GH response",
    ],
    safety: [
      "Research compounds — not approved for human use",
      "May cause water retention and tingling in hands/feet initially",
      "Do not use if active cancer — GH elevation is contraindicated",
      "Can cause insulin resistance at very high doses — stay in range",
    ],
    issueSlugs: ["muscle-mass", "recovery", "poor-sleep"],
    vendorIds: ["pure-rawz", "cosmic-peptides", "peptide-sciences", "limitless-life"],
    vendorProductUrls: {
      "pure-rawz": "https://purerawz.co/product/ipamorelin/",
      "cosmic-peptides": "https://cosmicpeptides.com/products/ipamorelin-cjc-1295",
    },
  },
  {
    slug: "epithalon",
    name: "Epithalon",
    category: "Peptides",
    summary:
      "Tetrapeptide that stimulates telomerase activity, potentially extending telomere length. Used for anti-aging, sleep improvement, and skin quality. Infrequent cycle use — 1–2x per year protocol.",
    protocol: [
      "5–10mg subcutaneous daily for 10–20 days, 1–2 cycles per year",
      "Inject PM — associated with improved sleep in some users",
      "Cycle infrequently — not designed for continuous use",
    ],
    safety: [
      "Research compound — no long-term human safety data",
      "Generally well tolerated in short cycles",
      "Theoretical concern with telomerase activation in cancer cells — avoid if cancer history",
    ],
    issueSlugs: ["skin-clarity", "poor-sleep", "longevity"],
    vendorIds: ["pure-rawz", "cosmic-peptides", "peptide-sciences", "limitless-life"],
    vendorProductUrls: {
      "pure-rawz": "https://purerawz.co/product/epithalon/",
      "cosmic-peptides": "https://cosmicpeptides.com/products/epithalon",
    },
  },

  // ── EYELASH / MECHANICAL ───────────────────────────────────────────────────
  {
    slug: "dermaroller",
    name: "Dermaroller / Microneedling",
    category: "Mechanical",
    summary:
      "Creates controlled micro-injuries that trigger wound-healing cascades (collagen induction, growth factor release) and dramatically enhance topical absorption post-needling. For hair loss, 1.5mm scalp needling in published RCTs produced significantly more hair count improvement than minoxidil alone.",
    protocol: [
      "Face (skin rejuvenation): 0.25–0.5mm roller, 1–2x per week; H, V, and diagonal directions",
      "Scalp (hair loss): 1.0–1.5mm dermaroller once every 1–2 weeks; 1.5mm = minimum 2–3 weeks recovery",
      "Sterilize with 70% isopropyl alcohol before each session; discard after 2–3 months",
      "Apply treatment serum (minoxidil for scalp, HA or growth serum for face) immediately post-rolling — absorption is 40–80x higher in the micro-injury window",
      "Post-session: no harsh actives for 24 hours; use only barrier-supportive products (snail mucin, CICA, HA)",
    ],
    safety: [
      "Never use on active acne, eczema, psoriasis, rosacea, or open wounds — causes bacterial spread",
      "Sharing a roller transmits bloodborne pathogens — strictly single-person use",
      "1.5mm scalp needling causes minor bleeding — this is expected",
      "Hyperpigmentation risk for darker skin tones (Fitzpatrick IV–VI) at deeper needle lengths — stay at 0.5–1.0mm",
      "Apply retinoids or vitamin C the day AFTER needling, not immediately post-session (exception: minoxidil for scalp)",
    ],
    issueSlugs: ["hair-loss", "thin-brows", "skin-clarity", "hyperpigmentation", "acne-scarring", "skin-texture"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "falim-gum",
    name: "Falim / Hard Gum (Jaw Development)",
    category: "Mechanical",
    summary:
      "Turkish hard gum used for masseter hypertrophy and perceived jawline widening. A 2024 RCT (Jung et al., Journal of Oral Rehabilitation) confirmed gum chewing training increases masseter thickness and occlusal force over a controlled period. Mastic gum provides even greater resistance once a baseline is built.",
    protocol: [
      "Start with 20–30 minutes of Falim chewing daily — focus on back molars (masseter origin area)",
      "Progress to 40–60 minutes daily after 3–4 weeks; switch to mastic gum for greater resistance",
      "Chew bilaterally for symmetric development — avoid predominantly one side",
      "One rest day per week minimum — masseters need recovery like any muscle",
      "Measurable masseter thickness changes at 3 months; significant jawline appearance change at 6–12 months",
    ],
    safety: [
      "TMJ aggravation is a real risk — jaw clicking, popping, pain, or headaches = reduce immediately",
      "Do not chew excessively in initial weeks — masseters in modern soft-food diets are undertrained",
      "Dental work (crowns, veneers, braces, retainers) can be damaged — consult dentist",
      "Masseter hypertrophy widens the lower third — counterproductive for already wide/square lower thirds",
      "Build up to mastic over weeks — don't start there if you have no gum-chewing baseline",
    ],
    issueSlugs: ["jawline-definition"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "gua-sha",
    name: "Gua Sha (Facial Lymphatic Drainage)",
    category: "Mechanical",
    summary:
      "Smooth jade or rose quartz tool used to manually move lymphatic fluid through the face toward cervical lymph nodes, reducing puffiness and temporarily creating a more defined appearance. Effects last hours, not permanently, but consistent daily use reduces chronic facial water retention.",
    protocol: [
      "Start with clean skin and a facial oil (jojoba, rosehip) — tool must glide without pulling",
      "Step 1: Massage the supraclavicular (collarbone) area downward 5x to open the terminal lymph ducts",
      "Step 2: Feather-light pressure in upward and outward strokes along neck, jawline, cheekbones, under-eye",
      "Direction: midface outward toward ears, then ears/jawline downward toward neck and collarbone",
      "Daily or 5x/week AM for anti-puffiness; 2–3x/week for maintenance",
    ],
    safety: [
      "Do not use over active acne, open wounds, sunburned skin, or rosacea flares",
      "Excess pressure causes petechiae or bruising — lighter is always better, especially under-eye",
      "Results are temporary (hours) — not structural; gua sha does not reshape bone or fat",
      "Address root causes of chronic puffiness (high sodium, alcohol, poor sleep) — gua sha can't compensate",
      "Wash jade tool with gentle soap and warm water after each use — harbors bacteria if not cleaned",
    ],
    issueSlugs: ["facial-puffiness", "under-eye-hollows", "jawline-definition"],
    vendorIds: ["iherb", "amazon-ca"],
  },

  // ── SKINCARE ───────────────────────────────────────────────────────────────
  {
    slug: "caffeine-eye-cream",
    name: "Caffeine Eye Cream",
    category: "Skincare",
    summary:
      "Topical caffeine constricts blood vessels and reduces fluid retention under the eye. Addresses puffiness and dark circles. Best used consistently AM. Minimal risk, immediate visible effect.",
    protocol: [
      "Apply small amount under eye using ring finger — tap, don't rub",
      "Use AM after cleansing, before moisturizer",
      "Store in fridge for enhanced de-puffing effect",
    ],
    safety: [
      "Extremely well tolerated — minimal risk",
      "Avoid direct contact with eyes",
      "Look for formulas with hyaluronic acid or peptides for added benefit",
    ],
    issueSlugs: ["under-eye-hollows", "facial-puffiness", "dark-circles"],
    vendorIds: ["the-ordinary", "cosrx", "iherb", "amazon-ca"],
  },
  {
    slug: "adapalene",
    name: "Adapalene / Differin",
    category: "Skincare",
    summary:
      "Third-generation synthetic retinoid with selective RAR-β and RAR-γ binding — more stable, less irritating, and better tolerated than tretinoin while still highly effective for acne. FDA-approved OTC at 0.1%. The best entry-level retinoid for most people. 0.3% Rx version approaches tretinoin in anti-aging efficacy.",
    protocol: [
      "Start with 0.1% adapalene gel 3x/week at night for weeks 1–4",
      "Apply pea-sized amount to entire face (not just spots) on clean, fully dry skin",
      "Increase to every other night weeks 5–8, then nightly from week 9 onward if tolerated",
      "Sandwich method for sensitive skin: moisturizer → 10 min → adapalene → 10 min → moisturize",
      "Consider stepping up to 0.3% adapalene or tretinoin after 6+ months of 0.1% tolerance",
    ],
    safety: [
      "Initial purge (increased breakouts weeks 2–6) is expected — indicates cell turnover is accelerating",
      "Mandatory SPF 50+ daily — photosensitivity is significantly increased",
      "Absolutely avoid during pregnancy — all retinoids are teratogenic",
      "Do not combine with benzoyl peroxide in the same application — BP oxidizes adapalene, inactivating it; use BP AM and adapalene PM",
      "Avoid combining with AHAs/BHAs on the same night during first 3 months",
    ],
    issueSlugs: ["skin-clarity", "hyperpigmentation", "oily-skin", "acne-scarring", "enlarged-pores", "razor-bumps", "androgenic-acne"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "tazarotene",
    name: "Tazarotene (Tazorac / Arazlo)",
    category: "Skincare",
    summary:
      "Most potent prescription topical retinoid available — binds RAR-β and RAR-γ more selectively and potently than tretinoin. Superior results on photoaging, fine wrinkling, mottled pigmentation, and acne. Faster and more aggressive than tretinoin with higher irritation potential requiring careful introduction.",
    protocol: [
      "Begin with 0.045% Arazlo lotion every other night for weeks 1–4 — significantly less irritating than 0.1% gel",
      "Apply pea-sized amount to completely dry skin (wait 30+ min after cleansing)",
      "Advance to nightly 0.045% after 4–6 weeks; step up to 0.1% only if well tolerated",
      "Sandwich method strongly recommended: moisturizer → 10 min → tazarotene → 10 min → moisturizer",
      "SPF 50+ daily non-negotiable — more UV-sensitive than tretinoin-treated skin",
    ],
    safety: [
      "More irritating than tretinoin — dryness, peeling, erythema are common and more severe; do not rush titration",
      "Absolutely contraindicated in pregnancy — highest teratogenic potential of all topical retinoids",
      "Short-contact therapy (1 hr then wash off) is valid for very sensitive skin during initial months",
      "Can exacerbate rosacea and perioral dermatitis — avoid these areas",
      "Do not combine with chemical exfoliants or vitamin C on same night",
    ],
    issueSlugs: ["skin-clarity", "hyperpigmentation", "fine-lines"],
    vendorIds: ["felix", "alldaychemist"],
  },
  {
    slug: "tretinoin",
    name: "Tretinoin",
    category: "Skincare",
    summary:
      "Gold standard topical retinoid. Increases cell turnover, thickens dermis, fades hyperpigmentation, and reduces fine lines. Requires prescription in most countries. More effective than OTC retinol or adapalene.",
    protocol: [
      "Start at 0.025% — apply pea-sized amount PM to dry skin",
      "3x/week for 4 weeks, then increase frequency",
      "Purging period 4–6 weeks is normal — don't stop",
      "Always use SPF 50+ AM",
    ],
    safety: [
      "Causes photosensitivity — SPF is mandatory",
      "Do not use if pregnant",
      "Avoid on broken skin or active eczema",
      "Purging (initial breakout) is expected — not a reaction",
    ],
    issueSlugs: ["skin-clarity", "hyperpigmentation", "acne-scarring", "enlarged-pores", "razor-bumps", "skin-texture", "fine-lines"],
    vendorIds: ["felix", "rocky", "alldaychemist"],
    vendorProductUrls: {
      "felix": "https://felixforyou.ca/skin/",
    },
  },
  {
    slug: "isotretinoin",
    name: "Isotretinoin / Accutane",
    category: "Skincare",
    summary:
      "The only oral acne treatment that produces lasting remission (cure) — ~61% of patients are cured after one course by permanently shrinking sebaceous glands. Addresses all four pathological factors of acne simultaneously. Requires dermatologist supervision, monthly bloodwork, and mandatory pregnancy prevention programs.",
    protocol: [
      "Standard dose: 0.5mg/kg/day for month 1, titrate to 1.0mg/kg/day — target cumulative 120–150mg/kg",
      "Split into two doses daily taken with a fatty meal — absorption drops ~50% fasted",
      "Monthly CBC, LFTs, lipid panel, and pregnancy test required throughout",
      "Typical course: 15–20 weeks — do not stop early even if skin clears; cumulative dose drives efficacy",
      "Ceramide moisturizer + gentle cleanser + SPF 50+ + lubricating eye drops for dry eyes",
    ],
    safety: [
      "Absolutely contraindicated in pregnancy — causes severe fetal malformations; iPLEDGE enrollment required in US",
      "Elevated liver enzymes and triglycerides are common — lipid panels at baseline, months 1 and 2 mandatory",
      "Depression and mood changes: meta-analyses show no overall increased risk, but individual cases documented — monitor closely",
      "Musculoskeletal pain is common — reduce high-impact exercise during treatment",
      "Initial purge in weeks 1–4 is real and can be severe at high starting doses — start at 0.5mg/kg",
    ],
    issueSlugs: ["skin-clarity", "androgenic-acne"],
    vendorIds: ["felix", "alldaychemist"],
  },
  {
    slug: "benzoyl-peroxide",
    name: "Benzoyl Peroxide",
    category: "Skincare",
    summary:
      "Proven bactericidal agent that kills P. acnes by releasing free oxygen radicals. Crucially, bacteria cannot develop resistance to BPO unlike antibiotics. 2.5% is equivalent in efficacy to 10% with significantly less irritation — higher concentrations add dryness, not efficacy.",
    protocol: [
      "Start with 2.5% BPO wash or leave-on gel once daily in AM — 2.5% is the optimal concentration",
      "Wash: apply to face, lather 60 seconds, rinse — reduces contact time vs leave-on",
      "Leave-on: thin layer to entire acne-prone area, not just spot-treating — prevents new lesions",
      "Split AM/PM with retinoid: BPO in AM, adapalene/tretinoin in PM — BPO inactivates retinoids on contact",
      "Apply BPO first, wait 5 min, then moisturize",
    ],
    safety: [
      "BPO bleaches fabric — pillowcases, towels, clothing permanently stained; use white bedding or rinse thoroughly before contact",
      "Do not mix with tretinoin or adapalene in same application — BPO oxidizes and inactivates retinoids",
      "Overuse significantly disrupts skin barrier — higher concentrations are not more effective",
      "Contact allergy (true sensitization) in ~1–2% of users — if hives or spreading redness, discontinue permanently",
      "Avoid hair and eyebrows — bleaches on direct contact",
    ],
    issueSlugs: ["skin-clarity", "oily-skin", "razor-bumps", "androgenic-acne"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "salicylic-acid",
    name: "Salicylic Acid (BHA)",
    category: "Skincare",
    summary:
      "Beta hydroxy acid that exfoliates inside the pore. Best OTC option for blackheads, congestion, and acne-prone skin. Oil-soluble — penetrates sebum. One of the most useful everyday actives.",
    protocol: [
      "0.5–2% concentration — start low if new to actives",
      "Apply to clean skin AM or PM (not both to start)",
      "Follow with moisturizer and SPF 50 in AM",
    ],
    safety: [
      "Can over-dry at high concentrations — limit to once daily initially",
      "Avoid combining with other strong exfoliants (AHA) in same routine",
      "SPF non-negotiable when using any exfoliant",
    ],
    issueSlugs: ["skin-clarity", "oily-skin", "enlarged-pores", "razor-bumps", "androgenic-acne", "skin-texture"],
    vendorIds: ["paulas-choice", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "paulas-choice": "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201.html",
    },
  },
  {
    slug: "glycolic-acid",
    name: "Glycolic Acid (AHA)",
    category: "Skincare",
    summary:
      "Smallest-molecule AHA — deepest skin penetration of any alpha-hydroxy acid. Dissolves bonds between dead skin cells, improving texture, fading hyperpigmentation, and stimulating collagen at higher concentrations. Stacks powerfully with retinoids (separate nights) and vitamin C.",
    protocol: [
      "Beginners: 5–7% leave-on toner or serum 2–3x/week PM on clean dry skin",
      "Intermediate: after 4–6 weeks, increase to 10% nightly or weekly 20–30% peel (2–5 min wash-off)",
      "Leave-on: ≤10% can stay on overnight; 20–30% must be timed and rinsed",
      "Layer order: cleanse → glycolic → 5 min → other serums → moisturizer → (AM) SPF 50+",
    ],
    safety: [
      "Dramatically increases UV sensitivity — SPF 50+ non-negotiable",
      "Do not combine with retinoids, BPO, or vitamin C on same night at high concentrations",
      "Products >10% at pH <3.5 are professional-grade peels — adverse events increase sharply on unseasoned skin",
      "Darker skin tones (Fitzpatrick IV–VI) higher risk of post-inflammatory hyperpigmentation from over-exfoliation — start conservatively",
      "Stinging that builds to burning during a peel = rinse immediately",
    ],
    issueSlugs: ["hyperpigmentation", "skin-clarity", "oily-skin", "acne-scarring", "razor-bumps", "skin-texture"],
    vendorIds: ["paulas-choice", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "paulas-choice": "https://www.paulaschoice.com/skin-perfecting-25pct-aha-and-2pct-bha-exfoliant-peel/9560.html",
    },
  },
  {
    slug: "alpha-arbutin",
    name: "Alpha Arbutin",
    category: "Skincare",
    summary:
      "Glycosylated hydroquinone derivative that inhibits tyrosinase more safely than hydroquinone itself — no risk of ochronosis. At 2%, it's the optimal OTC concentration. Pairs synergistically with vitamin C, niacinamide, and tranexamic acid for stacked brightening.",
    protocol: [
      "2% alpha arbutin serum — apply 2–3 drops to entire face after cleansing, AM and PM",
      "Layer under moisturizer and SPF (AM); retinoid goes on after arbutin (PM)",
      "Patch test on inner arm first",
      "Visible improvement at 4–6 weeks; significant results at 8–12 weeks",
      "Stack with niacinamide AM and retinoid PM for fastest results",
    ],
    safety: [
      "Do not use above 2% long-term — at very high concentrations arbutin can paradoxically increase melanin",
      "SPF skip defeats the purpose entirely — UV triggers melanin production that offsets progress",
      "Unlike hydroquinone, no risk of ochronosis — safe for long-term use",
      "Pregnancy safety not well established — defer to OB-GYN",
      "Can destabilize in low-pH environments — don't layer directly over AHAs without wait time",
    ],
    issueSlugs: ["hyperpigmentation", "skin-clarity", "dark-circles", "melasma"],
    vendorIds: ["the-ordinary", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "the-ordinary": "https://theordinary.com/en-us/alpha-arbutin-2-ha-serum-100401.html",
    },
  },
  {
    slug: "tranexamic-acid",
    name: "Tranexamic Acid (TXA)",
    category: "Skincare",
    summary:
      "Inhibits plasmin-mediated melanocyte stimulation and UV-induced prostaglandin synthesis. One of the most effective treatments for melasma and PIH with an excellent safety profile. Clinical data supports both topical (3–5%) and oral (250–500mg/day) routes — topical preferred for most users.",
    protocol: [
      "Topical: 3–5% TXA serum to affected areas AM and PM after cleansing, under moisturizer",
      "Clinical trials showed significant 13% dark spot reduction after 8 weeks of twice-daily 3% cream",
      "Oral (moderate/severe melasma only, physician-supervised): 250mg twice daily for 8–24 weeks max",
      "Combine topical TXA with SPF 50+ and niacinamide for additive brightening",
    ],
    safety: [
      "Oral TXA carries real, dose-dependent thromboembolic risk (DVT, PE) — avoid in those with clotting disorders, OCP users, or smokers",
      "Topical TXA has minimal systemic absorption — far safer than oral; prioritize topical",
      "Not suitable during pregnancy",
      "GI upset (nausea, cramping) is the most common oral side effect",
    ],
    issueSlugs: ["hyperpigmentation", "dark-circles", "melasma"],
    vendorIds: ["the-ordinary", "iherb", "amazon-ca"],
  },
  {
    slug: "kojic-acid",
    name: "Kojic Acid",
    category: "Skincare",
    summary:
      "Tyrosinase inhibitor derived from fungal fermentation. Effective for brightening hyperpigmentation at 1–2%. Slightly higher irritation potential than alpha arbutin. Often formulated with glycolic acid or niacinamide for additive effects.",
    protocol: [
      "1–2% kojic acid serum or cream; start 2–3x/week PM to assess tolerance, then advance to nightly",
      "Apply to clean, dry skin; layer below moisturizer",
      "Combine with niacinamide or alpha arbutin for synergistic brightening — all can be used same routine",
      "First visible results at 4–6 weeks; significant reduction at 8–12 weeks",
      "SPF 50+ AM — UV completely offsets progress",
    ],
    safety: [
      "Higher irritation potential than alpha arbutin — contact dermatitis documented more frequently; always patch test",
      "EU limits leave-on products to 1% kojic acid due to sensitization risk — don't exceed 2%",
      "Paradoxical darkening if skin becomes inflamed from irritation — reduce frequency if persistent redness",
      "Unstable in light and air — dark glass packaging indicates better formulation quality",
      "Avoid pairing with high-concentration AHAs or retinoids on same night until fully acclimatized",
    ],
    issueSlugs: ["hyperpigmentation", "melasma"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "niacinamide",
    name: "Niacinamide (Vitamin B3)",
    category: "Skincare",
    summary:
      "Versatile topical that reduces sebum, minimizes pore appearance, fades dark spots, and strengthens the skin barrier. One of the safest and most well-tolerated actives. Compatible with most other actives.",
    protocol: [
      "5–10% concentration applied AM and/or PM after cleansing",
      "Compatible with most actives — can be layered freely",
      "Consistent use for 8–12 weeks for visible pore and tone results",
    ],
    safety: [
      "Very well tolerated at 5–10%",
      "High concentrations (>20%) may cause flushing in some",
      "Avoid combining with pure vitamin C (L-ascorbic acid) in same step — reduces efficacy of both",
    ],
    issueSlugs: ["skin-clarity", "oily-skin", "hyperpigmentation", "acne-scarring", "dark-circles", "enlarged-pores", "skin-texture"],
    vendorIds: ["the-ordinary", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "the-ordinary": "https://theordinary.com/en-ca/niacinamide-10-zinc-1-serum-100436.html",
    },
  },
  {
    slug: "vitamin-c-serum",
    name: "Vitamin C Serum (L-Ascorbic Acid)",
    category: "Skincare",
    summary:
      "Antioxidant that brightens, fades hyperpigmentation, and boosts collagen synthesis. Most effective form is L-ascorbic acid at 10–20% with low pH. Pairs powerfully with SPF for a proven anti-photoaging combo.",
    protocol: [
      "Apply 2–3 drops to clean, dry skin in AM before moisturizer",
      "10–20% L-ascorbic acid — higher isn't always better",
      "Follow with SPF — vitamin C + sun protection is a proven anti-aging combination",
      "Store in dark, cool place — oxidizes quickly once opened",
    ],
    safety: [
      "Can cause temporary stinging on application — normal",
      "Oxidized (orange/brown) serum loses efficacy — discard",
      "Do not layer with niacinamide in same step",
    ],
    issueSlugs: ["skin-clarity", "hyperpigmentation", "acne-scarring", "dark-circles", "melasma"],
    vendorIds: ["the-ordinary", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "the-ordinary": "https://theordinary.com/en-ca/aha-30-bha-2-peeling-solution-exfoliator-100400.html",
    },
  },
  {
    slug: "hyaluronic-acid",
    name: "Hyaluronic Acid",
    category: "Skincare",
    summary:
      "Humectant that draws moisture into the skin. Improves plumpness and reduces fine lines from dehydration. Works best in humid environments or layered under a moisturizer to lock in hydration.",
    protocol: [
      "Apply to damp skin AM and PM before moisturizer",
      "Layer under moisturizer to seal in moisture",
      "2–5 drops sufficient",
    ],
    safety: [
      "Extremely well tolerated — suitable for all skin types",
      "In dry environments, apply over a hydrating mist or it can pull moisture from the skin",
    ],
    issueSlugs: ["under-eye-hollows", "skin-clarity"],
    vendorIds: ["the-ordinary", "cosrx", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "the-ordinary": "https://theordinary.com/en-ca/hyaluronic-acid-2-b5-serum-with-ceramides-100637.html",
    },
  },
  {
    slug: "azelaic-acid",
    name: "Azelaic Acid",
    category: "Skincare",
    summary:
      "Multifunctional acid targeting acne, rosacea, and hyperpigmentation simultaneously. Gentler than tretinoin — good entry point for sensitive skin or as a complement to an existing routine.",
    protocol: [
      "10–20% applied AM or PM to clean skin",
      "Start with 10% — 15–20% formulas are stronger (prescription in some countries)",
      "Can be used with most other actives — very compatible",
    ],
    safety: [
      "Mild tingling on application is normal",
      "One of the safest actives — suitable for use during pregnancy",
      "Higher concentrations require prescription in some regions",
    ],
    issueSlugs: ["skin-clarity", "hyperpigmentation", "oily-skin", "acne-scarring", "melasma"],
    vendorIds: ["the-ordinary", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "the-ordinary": "https://theordinary.com/en-us/azelaic-acid-suspension-10-exfoliator-100407.html",
    },
  },
  {
    slug: "snail-mucin",
    name: "Snail Mucin",
    category: "Skincare",
    summary:
      "Complex blend of glycoproteins, hyaluronic acid, allantoin, and growth factors that hydrate, repair, and regenerate skin. Core K-beauty ingredient shown to improve barrier function, reduce PIH, and accelerate wound healing. COSRX 96% is the community gold standard.",
    protocol: [
      "Apply thin layer of essence/serum to cleansed face AM and PM before moisturizer",
      "On retinoid nights: apply snail mucin generously as first serum layer to cushion and repair",
      "Can be layered under or mixed with hyaluronic acid — fully compatible",
      "Use nightly during retinoid acclimatization to counteract dryness and accelerate barrier adaptation",
    ],
    safety: [
      "Not vegan — ethically sourced snail mucin comes from humane harvesting; synthetic alternatives exist",
      "Rare allergic reactions in those with shellfish or mollusc hypersensitivity — patch test",
      "Pure mucin is non-comedogenic; check full formula if acne-prone",
    ],
    issueSlugs: ["skin-clarity", "hyperpigmentation", "skin-texture"],
    vendorIds: ["cosrx", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "cosrx": "https://www.cosrx.com/products/advanced-snail-96-mucin-power-essence",
    },
  },
  {
    slug: "centella-asiatica",
    name: "Centella Asiatica (CICA)",
    category: "Skincare",
    summary:
      "Contains triterpenoids (asiaticoside, madecassoside) that reduce inflammation, stimulate collagen synthesis, and reinforce the skin barrier. The go-to calming and repair ingredient for post-retinoid, post-laser, or sensitized skin. Synergizes with snail mucin for comprehensive barrier repair.",
    protocol: [
      "Apply CICA serum or cream (with madecassoside or asiaticoside in top 5 ingredients) AM and PM",
      "On retinoid nights: apply CICA cream as final step to seal and soothe",
      "For inflammation flare-ups: use CICA-focused products exclusively for 5–7 days, pausing all actives",
      "Combine with niacinamide for amplified barrier reinforcement",
    ],
    safety: [
      "Extremely well tolerated — one of the lowest irritant-potential actives in skincare",
      "Some with grass pollen or parsley family allergies may cross-react — patch test",
      "Oral Centella supplements are hepatotoxic at high doses — distinct from topical use",
    ],
    issueSlugs: ["skin-clarity"],
    vendorIds: ["cosrx", "iherb", "amazon-ca"],
    vendorProductUrls: {
      "cosrx": "https://www.cosrx.com/products/bha-blackhead-power-liquid",
    },
  },

  // ── SUPPLEMENTS ────────────────────────────────────────────────────────────
  {
    slug: "creatine",
    name: "Creatine Monohydrate",
    category: "Supplements",
    summary:
      "Most researched supplement in sports science. Increases phosphocreatine stores for ATP resynthesis — directly improves strength output and muscle volumization. 30+ years of safety data.",
    protocol: [
      "3–5g daily — timing doesn't matter, consistency does",
      "No loading phase needed",
      "Take with water — no special mixing required",
    ],
    safety: [
      "Extremely safe — studied extensively over 30+ years",
      "May cause slight water retention initially — expected",
      "Ensure adequate hydration (extra 500mL/day)",
    ],
    issueSlugs: ["muscle-mass", "jawline-definition"],
    vendorIds: ["bulk-supplements", "swanson", "amazon-ca"],
    vendorProductUrls: {
      "bulk-supplements": "https://www.bulksupplements.com/products/creatine-monohydrate",
    },
  },
  {
    slug: "collagen-peptides",
    name: "Collagen Peptides",
    category: "Supplements",
    summary:
      "Hydrolyzed collagen providing amino acid building blocks for skin, tendon, and joint repair. Stacks with vitamin C for enhanced synthesis. Visible skin results at 8–12 weeks.",
    protocol: [
      "10–15g daily mixed in water, coffee, or food",
      "Take with vitamin C source for maximum synthesis benefit",
      "Consistent daily use — results at 8–12 weeks",
    ],
    safety: [
      "No known risks at standard doses",
      "Not a complete protein — don't use as primary protein source",
    ],
    issueSlugs: ["skin-clarity", "muscle-mass", "recovery"],
    vendorIds: ["bulk-supplements", "swanson"],
  },
  {
    slug: "mastic-gum",
    name: "Mastic Gum",
    category: "Supplements",
    summary:
      "Natural resin with significantly more masseter resistance than regular gum. Anecdotal improvement in jawline definition with consistent use. Combine with chin tucks for cervicomental angle improvement.",
    protocol: [
      "Chew 1–2 pieces for 20–30 minutes, 2x/day",
      "Start with soft pieces — mastic is harder than regular gum",
      "Combine with chin tucks for cervicomental angle improvement",
    ],
    safety: [
      "Generally safe — natural product",
      "May cause jaw soreness initially — normal",
      "Avoid if TMJ issues",
    ],
    issueSlugs: ["jawline-definition"],
    vendorIds: ["iherb", "amazon-ca"],
  },
  {
    slug: "zinc-picolinate",
    name: "Zinc Picolinate",
    category: "Supplements",
    summary:
      "Highly bioavailable zinc form. Essential for testosterone production, immune function, wound healing, and sebum regulation. Deficiency is common and directly worsens acne and hair loss.",
    protocol: [
      "25–50mg daily with food to reduce nausea",
      "Picolinate or bisglycinate forms for best absorption",
      "Take away from iron supplements — compete for absorption",
    ],
    safety: [
      "Do not exceed 40mg/day long-term without medical supervision",
      "High doses deplete copper — consider 1–2mg copper if using >30mg long-term",
      "Take with food — fasted zinc causes nausea",
    ],
    issueSlugs: ["skin-clarity", "hair-loss", "hormonal-optimization", "dandruff", "androgenic-acne"],
    vendorIds: ["iherb", "thorne"],
    vendorProductUrls: {
      "iherb": "https://www.iherb.com/pr/now-foods-zinc-picolinate-50-mg-120-veg-capsules/878",
    },
  },
  {
    slug: "vitamin-d3",
    name: "Vitamin D3 + K2",
    category: "Supplements",
    summary:
      "Vitamin D3 acts more like a hormone than a vitamin. Supports testosterone production, immune function, mood, and bone density. Most people are deficient — especially in northern climates like Canada.",
    protocol: [
      "2000–5000IU D3 daily with a fatty meal for absorption",
      "Pair with vitamin K2 (100–200mcg MK-7) to direct calcium properly",
      "Get bloodwork to confirm levels if possible — target 50–80 ng/mL",
    ],
    safety: [
      "Toxicity possible at very high doses (>10,000IU/day long-term) — stay within range",
      "K2 pairing is important at higher doses to avoid arterial calcium buildup",
      "Safe for most people at 2000–5000IU",
    ],
    issueSlugs: ["hormonal-optimization", "muscle-mass"],
    vendorIds: ["iherb", "thorne"],
    vendorProductUrls: {
      "iherb": "https://www.iherb.com/pr/now-foods-vitamin-d-3-high-potency-125-mcg-5-000-iu-120-softgels/10421",
    },
  },
  {
    slug: "omega-3",
    name: "Omega-3 Fish Oil",
    category: "Supplements",
    summary:
      "EPA and DHA reduce systemic inflammation, improve skin barrier, reduce acne severity, and support cardiovascular health. Most diets are severely deficient in EPA+DHA.",
    protocol: [
      "2–3g combined EPA+DHA daily with a fatty meal",
      "Look at the EPA+DHA content on the label, not total fish oil weight",
      "Triglyceride form absorbs better than ethyl ester",
    ],
    safety: [
      "High doses (>3g EPA+DHA) may thin blood — avoid before surgery",
      "Can cause fishy burps — try enteric-coated or freeze the capsules",
      "Potential drug interaction with blood thinners",
    ],
    issueSlugs: ["skin-clarity", "muscle-mass", "hormonal-optimization", "dandruff"],
    vendorIds: ["iherb", "thorne"],
  },
  {
    slug: "magnesium-glycinate",
    name: "Magnesium Glycinate",
    category: "Supplements",
    summary:
      "Most bioavailable magnesium form. Supports deep sleep quality, muscle relaxation, testosterone production, and anxiety reduction. Deficiency is widespread — especially in people who train hard.",
    protocol: [
      "200–400mg elemental magnesium PM — 1–2 hours before bed",
      "Glycinate form preferred for sleep and gut tolerance",
      "Consistent nightly use for 2–4 weeks to notice sleep improvements",
    ],
    safety: [
      "Very safe — excess is excreted",
      "High doses may cause loose stools — reduce if this occurs",
      "Avoid oxide form — poor bioavailability",
    ],
    issueSlugs: ["poor-sleep", "muscle-mass", "recovery"],
    vendorIds: ["bulk-supplements", "thorne"],
    vendorProductUrls: {
      "bulk-supplements": "https://www.bulksupplements.com/products/magnesium-glycinate-powder",
    },
  },
  {
    slug: "ashwagandha",
    name: "Ashwagandha (KSM-66)",
    category: "Supplements",
    summary:
      "Adaptogen with the most clinical evidence of any adaptogen. Reduces cortisol, improves testosterone levels, reduces anxiety, and enhances exercise performance. KSM-66 is the most studied and bioavailable extract form.",
    protocol: [
      "300–600mg KSM-66 extract daily — PM or split AM/PM",
      "Take with food for best absorption",
      "8–12 week cycle, then 4 weeks off — tolerance builds",
    ],
    safety: [
      "Avoid if thyroid conditions — may increase thyroid hormone levels",
      "Not for use during pregnancy",
      "Rare reports of liver toxicity at very high doses — stay in range",
      "May interact with sedatives or immunosuppressants",
    ],
    issueSlugs: ["hormonal-optimization", "poor-sleep"],
    vendorIds: ["nootropics-depot", "iherb"],
    vendorProductUrls: {
      "nootropics-depot": "https://nootropicsdepot.com/ksm-66-ashwagandha-extract-300mg-capsules",
    },
  },
  {
    slug: "tongkat-ali",
    name: "Tongkat Ali",
    category: "Supplements",
    summary:
      "Herbal testosterone booster with legitimate clinical evidence. Increases free testosterone by reducing SHBG binding. Most effective for those with suboptimal baseline testosterone.",
    protocol: [
      "200–400mg standardized extract (1:200 or Physta-standardized) daily",
      "Take AM or split AM/PM with food",
      "Cycle 5 days on / 2 days off or 8 weeks on / 2 weeks off",
    ],
    safety: [
      "Generally well tolerated",
      "Avoid if prostate cancer history",
      "Some insomnia reported — dose in AM if sleep is affected",
    ],
    issueSlugs: ["hormonal-optimization"],
    vendorIds: ["nootropics-depot"],
    vendorProductUrls: {
      "nootropics-depot": "https://nootropicsdepot.com/tongkat-ali-extract-tablets-10-eurycomanone/",
    },
  },
  {
    slug: "fadogia-agrestis",
    name: "Fadogia Agrestis",
    category: "Supplements",
    summary:
      "Nigerian shrub extract that stimulates LH and raises testosterone. Often stacked with tongkat ali and zinc for a full natural testosterone protocol. Strong anecdotal backing — clinical evidence still limited.",
    protocol: [
      "400–600mg daily with food",
      "Cycle 8 weeks on / 4 weeks off",
      "Stack with tongkat ali and zinc for complete natural testosterone support",
    ],
    safety: [
      "Limited long-term human safety data",
      "Animal studies at very high doses showed testicular toxicity — stay in range and cycle",
      "Avoid if prostate cancer history",
    ],
    issueSlugs: ["hormonal-optimization"],
    vendorIds: ["nootropics-depot"],
  },
  {
    slug: "melatonin",
    name: "Melatonin",
    category: "Supplements",
    summary:
      "Hormone that regulates circadian rhythm. Most people overdose it — 0.5–1mg is as effective as 10mg with far fewer side effects and less morning grogginess. Use to anchor sleep schedule, not as a sedative.",
    protocol: [
      "0.3–1mg, 30–60 minutes before target sleep time",
      "Avoid light exposure after dosing",
      "Use to anchor sleep schedule — not as a nightly sedative",
    ],
    safety: [
      "More is not better — standard doses (10mg) are too high; use lowest effective",
      "May cause vivid dreams or grogginess at higher doses",
      "Long-term use at high doses may suppress endogenous production",
    ],
    issueSlugs: ["poor-sleep"],
    vendorIds: ["iherb"],
  },
  {
    slug: "glycine",
    name: "Glycine",
    category: "Supplements",
    summary:
      "Simplest amino acid — comprises ~1/3 of collagen's amino acid content. At 3g before bed, reliably improves sleep quality and reduces sleep-onset latency via NMDA receptor modulation. One of the most cost-effective supplements with consistent RCT-backed sleep data.",
    protocol: [
      "Sleep: 3g in water or juice, 30–60 minutes before bed",
      "Collagen synthesis support: 5–10g/day total (glycine + collagen peptides) with vitamin C",
      "Stack with L-theanine (200mg) for synergistic sleep quality without morning grogginess",
    ],
    safety: [
      "Exceptionally safe — no reported toxicity at supplemental doses; GRAS status",
      "High doses (>30g/day) may cause mild nausea — stay well below this",
      "Avoid or use cautiously with advanced kidney disease",
    ],
    issueSlugs: ["poor-sleep", "skin-clarity"],
    vendorIds: ["bulk-supplements"],
  },
  {
    slug: "taurine",
    name: "Taurine",
    category: "Supplements",
    summary:
      "Most abundant intracellular amino acid in the body — declines with aging. A landmark 2023 Science paper found taurine supplementation extended median lifespan 10–12% in middle-aged mice. A 2024 meta-analysis (25 RCTs) confirmed cardiovascular benefits including blood pressure, fasting glucose, and triglyceride reduction at 0.5–6g/day.",
    protocol: [
      "General longevity/health: 1–2g/day with morning meal",
      "Cardiovascular support: 2–3g/day split into two doses AM and midday",
      "Exercise performance: 1–3g taken 60–90 minutes pre-workout",
      "No cycling required — daily long-term use is safe",
    ],
    safety: [
      "No toxicity up to 6g/day — EFSA established 6g/day as safe",
      "Caution with kidney impairment — taurine is renally cleared",
      "Can mildly lower blood pressure — additive with antihypertensives",
    ],
    issueSlugs: ["longevity", "muscle-mass", "recovery"],
    vendorIds: ["bulk-supplements", "iherb"],
  },
  {
    slug: "berberine",
    name: "Berberine",
    category: "Supplements",
    summary:
      "Isoquinoline alkaloid that activates AMPK — the same pathway as metformin. Reduces blood sugar, insulin resistance, LDL, and triglycerides with effect sizes comparable to pharmaceutical metformin in Type 2 diabetes RCTs. Often called 'nature's metformin.'",
    protocol: [
      "500mg berberine HCl, 2–3x daily with meals (1,000–1,500mg/day total)",
      "Start at 500mg once daily for 1 week to assess GI tolerance, then titrate",
      "Cycle: 8 weeks on, 2 weeks off to prevent gut microbiome disruption",
    ],
    safety: [
      "GI side effects (constipation, diarrhea, cramping, bloating) affect ~30% of users — start low and titrate",
      "Strong CYP3A4 inhibitor — significantly interacts with cyclosporine, statins, metformin; disclose to prescribing physician",
      "Can cause hypoglycemia when combined with insulin, sulfonylureas, or metformin",
      "Do not use during pregnancy — embryotoxic in animal studies",
    ],
    issueSlugs: ["longevity", "hormonal-optimization"],
    vendorIds: ["nootropics-depot", "iherb"],
  },
  {
    slug: "spermidine",
    name: "Spermidine",
    category: "Supplements",
    summary:
      "Naturally occurring polyamine that induces autophagy — the cellular self-cleaning process that declines with age. Observational studies link high dietary spermidine intake to a 5–6-year reduction in mortality-equivalent risk. Safety trials show no adverse effects up to 5mg/day.",
    protocol: [
      "Start at 1mg/day with food; increase to 2–3mg/day after 2–4 weeks",
      "Wheat germ-based supplements (Primeadine) are the most researched source",
      "Taking during a fasting window synergizes with fasting-induced autophagy — not yet clinically validated",
      "Food-first: wheat germ (1–2 tbsp/day), aged cheese, mushrooms, soybeans are richest dietary sources",
    ],
    safety: [
      "No significant adverse effects at up to 5mg/day in human safety trials",
      "Theoretical concern: spermidine promotes cell proliferation alongside autophagy — complex role in cancer; context-specific risks",
      "Quality varies dramatically — choose brands with standardized verified spermidine content",
    ],
    issueSlugs: ["longevity"],
    vendorIds: ["iherb"],
  },
  {
    slug: "nac",
    name: "NAC (N-Acetyl Cysteine)",
    category: "Supplements",
    summary:
      "Cysteine precursor that directly replenishes glutathione — the body's master antioxidant. Reduces oxidative stress, supports liver detoxification, and has emerging evidence in OCD/anxiety (glutamate modulation). Decades of clinical use in acetaminophen overdose treatment.",
    protocol: [
      "600–900mg/day in two divided doses (300–450mg AM, 300–450mg PM)",
      "Take on empty stomach or 30 min before meals for optimal absorption",
      "For skin antioxidant support: 600mg twice daily with vitamin C 500mg for synergistic glutathione upregulation",
    ],
    safety: [
      "GI side effects (nausea, cramping) — take with small amount of food to mitigate",
      "High-dose NAC (>3,000mg) can paradoxically inhibit glutathione synthesis — stay within 1,800mg/day",
      "Potential interaction with nitroglycerin — can cause severe hypotension",
      "Sulfur odor in breath and urine is common and harmless",
    ],
    issueSlugs: ["skin-clarity", "longevity"],
    vendorIds: ["bulk-supplements", "iherb"],
  },
  {
    slug: "nmn",
    name: "NMN (Nicotinamide Mononucleotide)",
    category: "Supplements",
    summary:
      "Direct precursor to NAD+ that converts in a single enzymatic step. Restores declining NAD+ levels associated with aging and metabolic dysfunction. Human trials at 250–500mg/day show improvements in insulin sensitivity and muscle function. NAD+ declines ~50% between age 20 and 60.",
    protocol: [
      "250–500mg daily in the AM, fasted or with breakfast",
      "Sublingual powder/tablets show higher bioavailability than standard capsules",
      "Split 250mg AM + 250mg early PM for sustained NAD+ elevation",
      "Minimum 8-week trial — peak benefits at 12+ weeks",
    ],
    safety: [
      "Safe up to 1,250mg/day per current human studies",
      "Theoretical concern about NAD+ restoration and cancer-cell proliferation — inconclusive but worth awareness",
      "GI discomfort at doses >500mg for some users",
      "Quality varies dramatically — use third-party-tested brands",
    ],
    issueSlugs: ["longevity", "muscle-mass"],
    vendorIds: ["iherb"],
  },
  {
    slug: "astaxanthin",
    name: "Astaxanthin",
    category: "Supplements",
    summary:
      "Ketocarotenoid antioxidant from microalgae with singlet oxygen quenching capacity 6,000x stronger than vitamin C. RCTs at 4–12mg/day for 8–16 weeks show significant improvements in skin wrinkles, UV resistance, moisture, and elasticity. One of the only oral supplements with direct, measurable skin benefits in RCTs.",
    protocol: [
      "4mg/day minimum for skin benefits; 6–12mg/day for clinical sweet spot",
      "Always take with a fatty meal — fat-soluble, absorption negligible without fat",
      "Natural astaxanthin from H. pluvialis preferred over synthetic — better bioavailability",
      "Allow 6–8 weeks before evaluating skin changes",
      "Stack with omega-3s (same fatty meal) and collagen peptides",
    ],
    safety: [
      "Very clean safety profile — no toxicity at up to 40mg/day in short-term studies",
      "High doses (>20mg/day long-term) can cause slight orange tinting of skin — harmless but undesirable; stay ≤12mg",
      "May lower blood pressure — caution with antihypertensives",
      "Synthetic astaxanthin (common in cheap products) is not equivalent to H. pluvialis-derived",
    ],
    issueSlugs: ["skin-clarity", "longevity"],
    vendorIds: ["iherb"],
  },
  {
    slug: "l-theanine",
    name: "L-Theanine",
    category: "Supplements",
    summary:
      "Non-protein amino acid from green tea that promotes alpha-brain-wave activity — calm alertness without sedation. At 200mg paired with 100mg caffeine (2:1 ratio) it's the most validated nootropic stack in the literature. Reliable sleep quality improvement at 200mg PM.",
    protocol: [
      "Focus stack: 200mg L-theanine + 100mg caffeine, 30 min before focused work",
      "Sleep: 200mg taken 30–60 minutes before bed",
      "Stress/anxiety: 200–400mg taken 45–60 minutes before high-pressure situation",
      "Tolerance does not appear to develop — daily use does not reduce efficacy",
    ],
    safety: [
      "Extremely safe — up to 900mg/day used safely in clinical settings",
      "Mild blood pressure lowering — additive with antihypertensives",
      "No rebound anxiety or withdrawal on discontinuation",
      "Drowsiness at doses >400mg in some individuals",
    ],
    issueSlugs: ["poor-sleep", "cognitive-performance"],
    vendorIds: ["nootropics-depot", "iherb"],
  },
  {
    slug: "rhodiola-rosea",
    name: "Rhodiola Rosea",
    category: "Supplements",
    summary:
      "Scandinavian adaptogen with the strongest clinical evidence of any adaptogen for acute stress relief and mental/physical fatigue reduction. Modulates HPA axis and monoamine neurotransmitters. A 2022 RCT showed significant fatigue reduction after just 1 week at 400mg/day.",
    protocol: [
      "SHR-5 standardized extract (3% rosavins, 1% salidrosides): 200–400mg/day",
      "Take AM or pre-workout on empty stomach — mildly stimulating; PM dosing can impair sleep",
      "Acute fatigue/stress: 288–680mg as single dose before demanding event",
      "Cycle: 8–12 weeks on, 2–4 weeks off — prevents HPA axis accommodation",
    ],
    safety: [
      "MAO-inhibiting activity — potential interaction with SSRIs, MAOIs; physician oversight required if on antidepressants",
      "Mild stimulating effect — insomnia and headaches if taken PM or >600mg",
      "Adaptogens stimulate immune activity — use cautiously with autoimmune conditions",
      "Standardization matters — unstandardized products extremely common; verify COA",
    ],
    issueSlugs: ["cognitive-performance", "poor-sleep"],
    vendorIds: ["nootropics-depot"],
  },
  {
    slug: "lions-mane",
    name: "Lion's Mane",
    category: "Supplements",
    summary:
      "Culinary mushroom whose erinacines and hericenones stimulate Nerve Growth Factor (NGF) and BDNF synthesis. RCTs show improvements in cognitive function, particularly in mild cognitive impairment. The landmark study used 3,000mg/day fruiting body extract for 16 weeks.",
    protocol: [
      "500mg/day starting dose (fruiting body extract, hot-water extracted); increase to 1,000–3,000mg/day",
      "3,000mg/day is the dose used in the landmark Mori et al. RCT",
      "AM or split AM/PM — some report mild stimulating effect at high doses",
      "Ensure hot-water extraction — beta-glucans require water extraction; ethanol alone is insufficient",
      "NGF synthesis builds over weeks — expect 4–8 weeks before cognitive benefits are noticeable",
    ],
    safety: [
      "Well tolerated at 1g/day per 16-week clinical data",
      "Rare allergic reactions in those with mushroom allergies",
      "Cheap 'mycelium on grain' powders are mostly grain substrate — use fruiting body or verified dual-extract",
      "Vivid dreams or mild dysphoria at high doses (>3,000mg) — reduce if bothersome",
    ],
    issueSlugs: ["cognitive-performance"],
    vendorIds: ["nootropics-depot"],
  },
  {
    slug: "mucuna-pruriens",
    name: "Mucuna Pruriens",
    category: "Supplements",
    summary:
      "Richest natural source of L-DOPA (levodopa), a direct dopamine precursor. Increases dopamine, suppresses prolactin, and upregulates androgen receptors. In infertile men, 5g/day for 90 days raised testosterone by 38%. Potent pharmacological activity — treat it like a drug, not a casual supplement.",
    protocol: [
      "Start with 100–150mg L-DOPA equivalent (15% standardized extract = ~700–1,000mg extract) once daily on empty stomach",
      "Titrate to maximum 300–500mg L-DOPA equivalent/day — do not rush",
      "Take AM for motivation; avoid PM — L-DOPA crashes are real",
      "Cycle: 5 days on / 2 days off, or 4 weeks on / 1 week off — receptor downregulation occurs with continuous use",
      "Do not take within 30 min of protein-rich meals — large neutral amino acids compete with L-DOPA for blood-brain barrier transport",
    ],
    safety: [
      "Absolutely contraindicated with MAOIs — potentially fatal hypertensive crisis",
      "Contraindicated alongside antipsychotics or other dopaminergic drugs",
      "Chronic high-dose use leads to receptor downregulation — cycling is essential",
      "Nausea, anxiety, low blood pressure, and involuntary muscle movements at doses exceeding individual tolerance",
      "L-DOPA is a pharmaceutical compound — treat with pharmaceutical-level respect",
    ],
    issueSlugs: ["hormonal-optimization", "cognitive-performance"],
    vendorIds: ["nootropics-depot"],
  },

  // ── HORMONAL ───────────────────────────────────────────────────────────────
  {
    slug: "enclomiphene",
    name: "Enclomiphene",
    category: "Research Compounds",
    summary:
      "Trans-isomer of clomiphene citrate — a SERM that blocks hypothalamic estrogen receptors, increasing LH and FSH to drive endogenous testosterone production. Unlike TRT, it preserves fertility and testicular function. Clinical trials show 80–90% increases in total testosterone while maintaining normal sperm production.",
    protocol: [
      "12.5–25mg orally once daily; clinical protocols often use 25mg 5 days/week",
      "AM with or without food — consistent daily timing improves hormonal rhythm",
      "Baseline + 6-week blood panel: total T, free T, LH, FSH, estradiol, SHBG",
      "If estradiol rises significantly (>50–60 pg/mL) with symptoms, anastrozole 0.5mg 2x/week may be added",
      "Typical course 3–6 months; assess response at 6 weeks",
    ],
    safety: [
      "Not FDA-approved for male hypogonadism — available as research compound or via men's health clinics",
      "Hot flashes, headaches, and mild GI distress in first 2–4 weeks — usually transient",
      "Rare vision disturbances (inherited from clomiphene class) — discontinue if vision changes occur",
      "May increase DHT proportionally with testosterone — monitor shedding if hair loss prone",
      "Do not combine with exogenous testosterone",
    ],
    issueSlugs: ["hormonal-optimization"],
    vendorIds: ["swiss-chems", "amino-asylum", "limitless-life"],
    vendorProductUrls: {
      "swiss-chems": "https://swisschems.is/product/enclomiphene-citrate/",
    },
  },
  {
    slug: "boron",
    name: "Boron",
    category: "Supplements",
    summary:
      "Trace mineral supplementation at 6mg/day shown to decrease SHBG and increase free testosterone by up to 25% within one week. Works by displacing testosterone from SHBG, increasing bioavailable hormone. Low-cost, low-risk, stacks cleanly with any testosterone optimization protocol.",
    protocol: [
      "6mg elemental boron daily — boron glycinate or citrate forms have better GI tolerance",
      "Take with any meal; timing not critical",
      "Effects on SHBG and free testosterone measurable within 7 days; consistent daily use required",
      "Do not exceed 20mg/day (NIH tolerable upper limit); no additional benefit beyond 10mg/day",
      "Pair with zinc (25–30mg) and magnesium glycinate (400mg) for a complete natural testosterone support stack",
    ],
    safety: [
      "Very safe up to 20mg/day; toxic only at multi-gram doses — impossible to reach with supplements",
      "GI discomfort at >10mg/day — stay at 6mg",
      "May slightly increase estradiol along with testosterone",
      "Conflicting evidence — some studies show minimal effect at 6mg; individual response varies",
    ],
    issueSlugs: ["hormonal-optimization"],
    vendorIds: ["iherb"],
  },
  {
    slug: "dhea",
    name: "DHEA",
    category: "Supplements",
    summary:
      "Most abundant circulating adrenal steroid and precursor to both testosterone and estrogen. Production peaks at age 25 and declines ~2% per year. Supplementation at 25–50mg/day can restore youthful DHEA-S levels — but downstream hormonal effects are unpredictable; some individuals convert preferentially to estradiol.",
    protocol: [
      "Start at 25mg/day orally in the AM",
      "Baseline blood panel before starting: DHEA-S, total/free T, estradiol, PSA (men over 30)",
      "Assess at 8 weeks; if unchanged, titrate to 50mg/day",
      "Do not exceed 50mg/day without confirmed lab evidence of deficiency",
    ],
    safety: [
      "Converts to estradiol in many men — gynecomastia and water retention are real risks; mandatory lab monitoring",
      "Acne flares are common at initiation — excess conversion to androgens spikes sebum",
      "Potential prostate stimulation — PSA monitoring recommended for men over 40",
      "Diabetics and prediabetics should monitor blood glucose — DHEA can impair insulin response",
    ],
    issueSlugs: ["hormonal-optimization"],
    vendorIds: ["iherb"],
  },

  // ── TANNING ────────────────────────────────────────────────────────────────
  {
    slug: "melanotan-ii",
    name: "Melanotan II (MT-2)",
    category: "Research Compounds",
    summary:
      "Synthetic α-MSH analogue that activates MC1R–MC4R melanocortin receptors, stimulating melanin production (tanning without equivalent UV), reducing appetite, and causing spontaneous erections. Unregulated, not FDA-approved. Widely used for tanning and body composition — but carries documented risks of nevi activation and melanoma promotion that are non-trivial.",
    protocol: [
      "Loading: 0.25mg subcutaneous injection daily for 7–14 days; combine with 15–20 min moderate UV 1–2x/week",
      "Titrate upward only if 0.25mg is well tolerated; most cap at 0.5mg/day during loading",
      "Maintenance: 0.5–1mg twice weekly with continued UV exposure",
      "Reconstitute lyophilized powder with bacteriostatic water (not sterile water — antimicrobial agent essential for multi-use vials)",
      "Full tanning effect at 3–6 weeks; fades 4–8 weeks post-discontinuation",
    ],
    safety: [
      "MELANOMA RISK — activates all melanocortin receptors indiscriminately, causing existing moles/nevi to darken and potentially change morphology. Anyone with dysplastic nevi, >50 moles, family history of melanoma, or Fitzpatrick Type I–II should NOT use MT-2",
      "Nausea affects 30–65% of users 30–90 min post-injection — ondansetron 4mg taken 30 min prior largely eliminates this",
      "Spontaneous, prolonged erections (priapism risk at extremes) — clinically documented common side effect",
      "Gray-market purity varies enormously — bacterial contamination from poor reconstitution causes serious infection",
      "Cardiovascular effects (BP elevation, tachycardia) documented — avoid with hypertension or cardiac conditions",
    ],
    issueSlugs: ["tanning"],
    vendorIds: ["swiss-chems", "amino-asylum", "peptide-sciences"],
    vendorProductUrls: {
      "swiss-chems": "https://swisschems.is/product/melanotan-2-10mg/",
    },
  },
  {
    slug: "melanotan-1",
    name: "Melanotan I (Afamelanotide)",
    category: "Research Compounds",
    summary:
      "Linear α-MSH analogue that stimulates melanin production more selectively than MT-2 — it activates MC1R without the strong MC4R (libido/appetite) crossover, so it has a cleaner side-effect profile. Slower to tan but far less nausea and no priapism. The safer of the two melanotans for pure tanning, though still carries the core mole/melanoma concern of any melanocortin agonist.",
    protocol: [
      "0.5–1mg subcutaneous daily during a 1–2 week loading phase with 15–20 min moderate UV 2–3x/week",
      "Maintenance: 1mg 2–3x weekly with continued light UV exposure",
      "Reconstitute lyophilized powder with bacteriostatic water; store reconstituted vial refrigerated",
      "Tan develops more gradually than MT-2 (2–4 weeks) but is more even and predictable",
      "Requires more total peptide than MT-2 for the same tan — factor into cost",
    ],
    safety: [
      "Still a melanocortin agonist — existing moles/nevi can darken; anyone with dysplastic nevi, many moles, or melanoma history should NOT use it",
      "Far less nausea than MT-2 and no priapism/appetite crossover — the main safety advantage",
      "Gray-market purity varies — use vendors with COA and reconstitute cleanly to avoid infection",
      "UV is still required for the tan to express — do not overexpose chasing faster results",
      "Not FDA-approved for cosmetic use (prescription Scenesse exists for a rare photodermatosis only)",
    ],
    issueSlugs: ["tanning"],
    vendorIds: ["swiss-chems", "peptide-sciences", "amino-asylum"],
  },

  // ── GLP-1 / FAT LOSS ─────────────────────────────────────────────────────
  {
    slug: "semaglutide",
    name: "Semaglutide (GLP-1)",
    category: "Peptides",
    summary:
      "GLP-1 receptor agonist (Ozempic/Wegovy) that slows gastric emptying and blunts appetite, driving significant fat loss — trial average ~15% body weight over 68 weeks. For looksmaxxing, body fat is the master lever for jawline, cheekbones, and facial definition, which makes GLP-1s one of the highest-impact aesthetic compounds available. Prescription as Wegovy; also sold as a research peptide.",
    protocol: [
      "Start 0.25mg subcutaneous once weekly for 4 weeks to build tolerance — do not rush the titration",
      "Titrate up every 4 weeks: 0.25 → 0.5 → 1.0 → 1.7 → 2.4mg weekly as tolerated",
      "Inject same day each week, subcutaneous (abdomen, thigh, or upper arm), rotate sites",
      "Pair with 1.6–2.2g/kg protein and resistance training — GLP-1s cause muscle loss if protein/training slip",
      "Plateau or GI intolerance = hold the dose, don't push higher",
    ],
    safety: [
      "Nausea, constipation, and reflux are near-universal early — titrate slowly and eat smaller meals",
      "Muscle loss is significant without high protein + lifting — this directly undermines the aesthetic goal",
      "Contraindicated with personal/family history of medullary thyroid cancer or MEN2",
      "Rare pancreatitis and gallbladder issues — seek care for severe persistent abdominal pain",
      "Research-grade GLP-1 dosing is easy to get wrong — underdose from mis-reconstitution is common; verify concentration math",
    ],
    issueSlugs: ["body-fat", "jawline-definition"],
    vendorIds: ["amino-asylum", "limitless-life", "peptide-sciences"],
  },
  {
    slug: "tirzepatide",
    name: "Tirzepatide (GLP-1 / GIP)",
    category: "Peptides",
    summary:
      "Dual GLP-1 and GIP receptor agonist (Mounjaro/Zepbound) — more effective than semaglutide, with ~21% average body weight reduction at the top dose in trials. The strongest fat-loss compound currently available. Same aesthetic rationale as semaglutide: dropping body fat is what reveals bone structure.",
    protocol: [
      "Start 2.5mg subcutaneous weekly for 4 weeks (non-therapeutic tolerance dose)",
      "Titrate in 2.5mg steps every 4 weeks toward 5–15mg as tolerated",
      "Weekly subcutaneous injection, rotate sites; keep the same day each week",
      "Protein 1.6–2.2g/kg + resistance training are non-negotiable to preserve muscle",
      "Hold titration if GI side effects are strong — tolerance builds with time at dose",
    ],
    safety: [
      "Same GI side-effect profile as semaglutide, sometimes stronger given the higher efficacy",
      "Muscle and even bone loss with aggressive deficits — anchor with protein, lifting, and a moderate deficit",
      "Contraindicated with medullary thyroid cancer / MEN2 history",
      "Pancreatitis and gallbladder risk — same monitoring as semaglutide",
      "Grey-market vials require careful reconstitution and dosing math — errors are common and consequential",
    ],
    issueSlugs: ["body-fat", "jawline-definition"],
    vendorIds: ["amino-asylum", "limitless-life"],
  },
  {
    slug: "retatrutide",
    name: "Retatrutide (GLP-1 / GIP / Glucagon)",
    category: "Peptides",
    summary:
      "Triple receptor agonist (GLP-1 + GIP + glucagon) — the strongest fat-loss compound in the pipeline, with ~24% average body weight reduction at 48 weeks in phase 2 at the top dose. The glucagon component adds energy expenditure on top of appetite suppression, which is why it outperforms tirzepatide. NOT approved — still in phase 3 trials — so everything circulating is gray-market research material.",
    protocol: [
      "Start low: 0.5–1mg subcutaneous once weekly for the first 4 weeks — triple agonism hits harder than sema/tirz at equivalent steps",
      "Titrate every 4 weeks toward 4–8mg weekly as tolerated; trial top dose was 12mg but most gray-market users stay well below it",
      "Weekly subcutaneous injection, same day each week, rotate sites",
      "Protein 1.6–2.2g/kg + resistance training are non-negotiable — the faster the loss, the faster muscle goes with it",
      "Track resting heart rate — the glucagon component raises it; a sustained climb is a signal to hold or reduce dose",
    ],
    safety: [
      "NOT FDA-approved and phase 3 is unfinished — long-term safety is genuinely unknown, and dosing conventions are community-derived, not clinical",
      "Raises resting heart rate more than sema/tirzepatide — avoid with any cardiac condition or arrhythmia history",
      "Same class GI profile (nausea, constipation, reflux) — often stronger; titrate slowly",
      "Contraindicated with medullary thyroid cancer / MEN2 family history, same as all incretin agonists",
      "Muscle loss risk scales with the speed of weight loss — this is the compound where skipping protein/lifting hurts most",
      "Gray-market vials vary in purity and concentration — COA-backed vendors and careful reconstitution math only",
    ],
    issueSlugs: ["body-fat", "jawline-definition"],
    vendorIds: ["amino-asylum", "limitless-life", "swiss-chems"],
  },
  {
    slug: "cagrilintide",
    name: "Cagrilintide (Amylin Analogue)",
    category: "Peptides",
    summary:
      "Long-acting amylin analogue that drives satiety through a different receptor system than GLP-1s — which is exactly why it stacks with them. CagriSema (cagrilintide + semaglutide) hit ~23% weight loss in phase 3, beating either alone. Standalone it's a moderate ~10–12% agent with a gentler side-effect profile. In the gray market it's mostly used to amplify a GLP-1 run.",
    protocol: [
      "Start 0.25–0.5mg subcutaneous once weekly; titrate monthly toward 1.7–2.4mg as tolerated",
      "Commonly stacked with semaglutide at matched doses (the CagriSema pattern) — start both low if stacking",
      "Weekly subcutaneous injection, rotate sites",
      "Same muscle-preservation rules as any strong satiety agent: protein anchored, lifting non-negotiable",
      "Satiety effect builds over the first weeks — don't chase early doses upward",
    ],
    safety: [
      "Not approved standalone — CagriSema is still in trials; long-term solo data is thin",
      "Nausea and early fullness are the main complaints — milder than GLP-1s for most, additive when stacked",
      "Stacking with a GLP-1 amplifies both effect and GI side effects — titrate the stack, not just one compound",
      "Rapid weight loss without training = muscle loss, same as the rest of the class",
      "Gray-market purity/concentration caveats apply — reconstitute carefully, verify vendor COAs",
    ],
    issueSlugs: ["body-fat", "jawline-definition"],
    vendorIds: ["amino-asylum", "limitless-life", "peptide-sciences"],
  },
  {
    slug: "5-amino-1mq",
    name: "5-Amino-1MQ",
    category: "Research Compounds",
    summary:
      "Oral small-molecule NNMT inhibitor that raises NAD+ and pushes fat cells toward higher metabolic activity — in mice. Rodent data shows reduced fat mass without appetite suppression; human evidence is essentially anecdotal. Popular as an oral, needle-free adjunct to a cut, but it is a tier below the incretin agonists in evidence. Treat it as experimental.",
    protocol: [
      "Common community dosing: 50–100mg oral once daily, some run up to 150mg",
      "Cycle 8–12 weeks on, 4 weeks off — no long-term human data supports continuous use",
      "Run alongside a deficit and training — it is an adjunct, not a driver",
      "No injection, no reconstitution — capsule form is standard",
    ],
    safety: [
      "Human safety data is nearly nonexistent — everything is extrapolated from rodents; that is a real, not theoretical, caveat",
      "NNMT/NAD+ pathways interact with methylation broadly — long-term systemic effects unknown",
      "GI upset is the commonly reported side effect at higher doses",
      "Avoid stacking with other unstudied metabolics — one experiment at a time",
      "Quality varies hard between vendors for niche compounds like this — COA or skip",
    ],
    issueSlugs: ["body-fat"],
    vendorIds: ["peptide-sciences", "swiss-chems", "amino-asylum"],
  },
  {
    slug: "slu-pp-332",
    name: "SLU-PP-332",
    category: "Research Compounds",
    summary:
      "Pan-ERR agonist billed as an 'exercise mimetic' — it activates the receptors that signal chronic aerobic training, increasing fat oxidation and mitochondrial output in muscle. Mice ran farther and lost fat without eating less. There is no human data yet — everything about human dosing, safety, and whether it works at all is extrapolation. The most experimental compound in this category; interesting mechanism, essentially zero clinical backing.",
    protocol: [
      "No established human protocol — community dosing is guesswork; commonly cited range is 100–500mcg/day, oral or subcutaneous",
      "Short exploratory cycles only (4–6 weeks) given the complete absence of long-term human data",
      "Pair with training and a deficit — the premise is that it complements exercise, not replaces it",
      "Treat any result as anecdotal and monitor how you feel closely",
    ],
    safety: [
      "ZERO human safety data — this is the least-studied compound on the list; that caveat is the headline, not a footnote",
      "ERR receptors sit on heart and muscle metabolism — cardiac effects are plausible and unstudied in people",
      "Purity is a lottery for a compound this niche — COA-backed sourcing or don't touch it",
      "Do not stack with other experimental metabolics — impossible to attribute a bad reaction",
      "If you have any cardiac history, skip this one entirely",
    ],
    issueSlugs: ["body-fat"],
    vendorIds: ["swiss-chems", "amino-asylum"],
  },
  {
    slug: "tesamorelin",
    name: "Tesamorelin",
    category: "Peptides",
    summary:
      "GHRH analogue FDA-approved to reduce visceral adipose tissue. Uniquely targets deep/visceral fat and shows real effect on facial and truncal fat via elevated IGF-1 — relevant for reducing facial puffiness and softness that blunts bone structure. One of the few GH secretagogues with proper human fat-loss data.",
    protocol: [
      "2mg subcutaneous once daily, injected at night on an empty stomach",
      "Rotate injection sites around the abdomen; reconstitute per vial and refrigerate",
      "Fast ~2 hours before and 30 min after — food (especially carbs/insulin) blunts the GH pulse",
      "Effects on body composition build over 3–6 months; IGF-1 should be checked to stay in range",
      "Stacks with GLP-1s (appetite/fat) and ipamorelin — different mechanisms",
    ],
    safety: [
      "Injection-site reactions and joint aches/fluid retention are the common complaints",
      "Raises IGF-1 — periodic bloodwork advised; avoid with active cancer",
      "Can worsen insulin sensitivity at high IGF-1 — monitor glucose if predisposed",
      "Not for use in pregnancy or with known GH-sensitive conditions",
      "Research-grade purity matters — use COA-backed vendors",
    ],
    issueSlugs: ["body-fat", "facial-puffiness", "jawline-definition"],
    vendorIds: ["peptide-sciences", "limitless-life"],
  },
  {
    slug: "aod-9604",
    name: "AOD-9604",
    category: "Peptides",
    summary:
      "Modified fragment of the C-terminus of human growth hormone (residues 176–191) marketed as a fat-loss peptide. It stimulates lipolysis and inhibits lipogenesis without the IGF-1 elevation or blood-sugar effects of full GH. Evidence in humans is weak compared to GLP-1s — a mild adjunct, not a primary driver.",
    protocol: [
      "250–500mcg subcutaneous daily, typically AM fasted",
      "Often run alongside a caloric deficit and cardio rather than as a standalone",
      "Cycle 8–12 weeks; reconstitute and refrigerate per standard peptide handling",
      "Best framed as a marginal add-on to diet + training, not a substitute",
    ],
    safety: [
      "Generally well tolerated — no significant GH/IGF-1 or glucose effects reported",
      "Human efficacy data is limited and mixed — set low expectations vs GLP-1s",
      "Research compound, not approved — use COA-backed sources",
      "Injection-site reactions are the main complaint",
    ],
    issueSlugs: ["body-fat"],
    vendorIds: ["amino-asylum", "limitless-life"],
  },
  {
    slug: "mots-c",
    name: "MOTS-c",
    category: "Peptides",
    summary:
      "Mitochondrial-derived peptide that acts on metabolic regulation — improves insulin sensitivity, promotes fat oxidation, and enhances exercise capacity in animal models. Used by athletes and biohackers for metabolic health and endurance. Human data is early but mechanistically promising.",
    protocol: [
      "5–10mg subcutaneous 2–3x per week, cycled 4–6 weeks",
      "Time doses around training for the endurance/metabolic benefit",
      "Reconstitute and refrigerate; rotate injection sites",
      "Pair with training — the effect is metabolic support, not a standalone fat-loss driver",
    ],
    safety: [
      "Limited human safety data — early-stage compound",
      "Generally well tolerated in reported use; injection-site reactions possible",
      "Research compound, not approved — COA-backed sourcing only",
      "Avoid stacking blindly with other metabolic agents without monitoring",
    ],
    issueSlugs: ["body-fat", "longevity"],
    vendorIds: ["amino-asylum", "limitless-life"],
  },

  // ── GH SECRETAGOGUES ──────────────────────────────────────────────────────
  {
    slug: "sermorelin",
    name: "Sermorelin",
    category: "Peptides",
    summary:
      "GHRH analogue that stimulates the pituitary to release its own growth hormone in natural pulses. Milder and more physiologic than direct GH — used for improved sleep quality, recovery, body composition, and skin. A gentler entry point into GH optimization than ipamorelin/CJC or tesamorelin.",
    protocol: [
      "100–300mcg subcutaneous nightly before bed on an empty stomach",
      "Fast ~2 hours before dosing — food blunts the GH pulse",
      "Cycle 3–6 months; benefits (sleep, recovery) often appear within weeks",
      "Stacks with ipamorelin for a stronger GH pulse (GHRH + GHRP synergy)",
    ],
    safety: [
      "Injection-site redness, flushing, or head-rush shortly after dosing are common and transient",
      "Raises IGF-1 modestly — avoid with active cancer; periodic bloodwork sensible on longer runs",
      "Water retention and tingling possible early",
      "Research compound — COA-backed sourcing only",
    ],
    issueSlugs: ["poor-sleep", "recovery", "muscle-mass", "skin-clarity"],
    vendorIds: ["peptide-sciences", "limitless-life", "amino-asylum"],
  },
  {
    slug: "thymosin-alpha-1",
    name: "Thymosin Alpha-1",
    category: "Peptides",
    summary:
      "Immune-modulating peptide (a fragment of thymosin) that supports T-cell function and dampens excess inflammation. Used to shorten illness recovery, support immune resilience during hard training blocks, and reduce chronic inflammatory load that shows up as skin and recovery issues. One of the better-studied peptides, with approved use for hepatitis in some countries.",
    protocol: [
      "1.5mg subcutaneous 2x per week is a common maintenance protocol",
      "Higher frequency (daily for 1–2 weeks) during acute illness or heavy stress",
      "Reconstitute and refrigerate; rotate injection sites",
      "Cycle as needed rather than continuously",
    ],
    safety: [
      "One of the better-tolerated peptides — mild injection-site reactions are the main issue",
      "Because it modulates immunity, caution with autoimmune conditions — discuss with a clinician",
      "Research/prescription status varies by country",
      "COA-backed sourcing only",
    ],
    issueSlugs: ["recovery", "skin-clarity"],
    vendorIds: ["peptide-sciences", "limitless-life"],
  },
  {
    slug: "kpv",
    name: "KPV",
    category: "Peptides",
    summary:
      "Tripeptide (lysine-proline-valine, the C-terminal fragment of α-MSH) with anti-inflammatory action that works both systemically and topically. Used for gut inflammation and for calming inflammatory skin conditions — acne, eczema, rosacea — without the melanocortin/tanning effects of the full peptide. Popular as an oral/topical adjunct for stubborn inflammatory skin.",
    protocol: [
      "Topical: KPV in a serum/cream applied to affected skin 1–2x daily",
      "Oral capsules (200–500mcg) used for gut-driven inflammation that manifests on the skin",
      "Subcutaneous (250–500mcg) also used for systemic anti-inflammatory effect",
      "Pair with a standard acne routine — KPV calms inflammation, it doesn't replace actives",
    ],
    safety: [
      "Very well tolerated — no melanocortin/tanning or libido effects despite the α-MSH lineage",
      "Topical irritation is rare; patch test new formulations",
      "Research compound — quality of compounded topicals varies, use reputable sources",
      "Not a substitute for treating severe or cystic acne medically",
    ],
    issueSlugs: ["skin-clarity", "oily-skin", "recovery"],
    vendorIds: ["amino-asylum", "limitless-life"],
  },

  // ── LIBIDO / COGNITIVE PEPTIDES ───────────────────────────────────────────
  {
    slug: "pt-141",
    name: "PT-141 (Bremelanotide)",
    category: "Peptides",
    summary:
      "Melanocortin agonist FDA-approved (as Vyleesi) for low sexual desire — acts centrally on the nervous system rather than the vascular system like PDE5 inhibitors, so it drives desire/arousal itself. Used on-demand for libido. Shares the melanocortin family with the melanotans, so mild tanning/darkening is possible with frequent use.",
    protocol: [
      "0.5–1mg subcutaneous roughly 45 min to a few hours before activity, on-demand",
      "Start low (0.5mg or less) to gauge nausea tolerance before going higher",
      "Not for daily use — on-demand only; limit frequency to reduce melanocortin side effects",
      "Reconstitute and refrigerate per standard peptide handling",
    ],
    safety: [
      "Nausea and flushing are the most common effects — starting low mitigates this",
      "Transient blood-pressure rise — avoid with uncontrolled hypertension or cardiac disease",
      "Frequent use can darken skin/moles (melanocortin effect) — same nevi caution as the melanotans",
      "Research/prescription status varies — COA-backed sourcing only",
    ],
    issueSlugs: ["hormonal-optimization"],
    vendorIds: ["swiss-chems", "amino-asylum"],
  },
  {
    slug: "selank",
    name: "Selank",
    category: "Peptides",
    summary:
      "Anxiolytic peptide developed in Russia (a synthetic analogue of tuftsin) used for anxiety reduction and mild cognitive/mood support without sedation or dependence. Modulates GABA and serotonin systems and BDNF. Popular as a calm-focus nootropic, typically delivered as a nasal spray.",
    protocol: [
      "Nasal spray is the common route: 250–500mcg 1–2x daily",
      "Subcutaneous dosing is also used at similar amounts",
      "Use as needed for acute anxiety or in short daily cycles (2–4 weeks)",
      "Often paired with Semax for a calm-but-sharp cognitive stack",
    ],
    safety: [
      "Very well tolerated — no sedation, no dependence reported",
      "Occasional mild fatigue or nasal irritation from the spray",
      "Limited long-term human data outside Russian clinical use",
      "Research compound in most markets — COA-backed sourcing only",
    ],
    issueSlugs: ["cognitive-performance", "poor-sleep"],
    vendorIds: ["peptide-sciences", "amino-asylum"],
  },
  {
    slug: "semax",
    name: "Semax",
    category: "Peptides",
    summary:
      "Russian nootropic peptide (an ACTH fragment analogue) used for focus, memory, and mental stamina. Increases BDNF and modulates dopamine/serotonin, producing a clean cognitive lift without stimulant jitter. Commonly used as a nasal spray during demanding work or study blocks — directly relevant to the afternoon focus gap.",
    protocol: [
      "Nasal spray: 300–600mcg 1–2x daily, dosed earlier in the day",
      "Use during focus-heavy blocks; cycle 2–4 weeks with breaks",
      "Stacks with Selank (calm) for a balanced focus-without-anxiety effect",
      "Avoid late-day dosing if it affects sleep",
    ],
    safety: [
      "Well tolerated — no stimulant crash or dependence reported",
      "Occasional nasal irritation or mild overstimulation at higher doses",
      "Limited long-term human data outside Russian clinical use",
      "Research compound in most markets — COA-backed sourcing only",
    ],
    issueSlugs: ["cognitive-performance"],
    vendorIds: ["peptide-sciences", "amino-asylum"],
  },

  // ── TOPICAL PEPTIDES (SKINCARE) ───────────────────────────────────────────
  {
    slug: "argireline",
    name: "Argireline (Acetyl Hexapeptide-8)",
    category: "Skincare",
    summary:
      "Topical peptide marketed as 'topical Botox' — it partially inhibits neurotransmitter release at the muscle, modestly softening expression lines (forehead, crow's feet) with consistent use. Effect is real but mild and temporary compared to injectables; best as a low-risk daily-use option for early fine lines.",
    protocol: [
      "Apply a 5–10% argireline serum to expression-line areas AM and/or PM before moisturizer",
      "Consistency over 4–8 weeks is required; effect fades if discontinued",
      "Layer under moisturizer and SPF; pairs well with a retinoid at night",
      "Set realistic expectations — softening of dynamic lines, not paralysis",
    ],
    safety: [
      "Very well tolerated topically — irritation is uncommon",
      "Effect is modest and reversible — not a replacement for injectable neuromodulators",
      "Patch test new serums; avoid broken skin",
      "No systemic absorption concern at cosmetic concentrations",
    ],
    issueSlugs: ["fine-lines"],
    vendorIds: ["the-ordinary", "iherb", "amazon-ca"],
  },
  {
    slug: "matrixyl",
    name: "Matrixyl (Palmitoyl Peptides)",
    category: "Skincare",
    summary:
      "Signal-peptide complex (palmitoyl pentapeptide-4 / Matrixyl 3000) that stimulates collagen and elastin synthesis, improving skin firmness and reducing fine lines over time. One of the better-evidenced cosmetic peptides for anti-aging, and it layers cleanly with retinoids and vitamin C.",
    protocol: [
      "Apply a Matrixyl serum AM and/or PM to clean skin before heavier creams",
      "Results build over 8–12 weeks of consistent use",
      "Layers well with hyaluronic acid, niacinamide, and retinoids (use retinoid PM)",
      "Always follow with SPF in the AM to protect new collagen",
    ],
    safety: [
      "Very well tolerated — one of the gentlest anti-aging actives",
      "Effect is gradual and cumulative — not an overnight change",
      "Patch test; avoid combining too many actives at once if sensitive",
      "No significant systemic concern at cosmetic use",
    ],
    issueSlugs: ["fine-lines", "skin-texture"],
    vendorIds: ["the-ordinary", "iherb"],
  },
];
