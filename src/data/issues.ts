export interface Issue {
  slug: string;
  name: string;
  description: string;
  treatmentSlugs: string[];
}

export const issues: Issue[] = [
  {
    slug: "thin-brows",
    name: "Thin / Sparse Brows",
    description:
      "Low brow density or short brow tail. One of the higher-leverage facial fixes — brow frame affects perceived eye area size and overall facial harmony.",
    treatmentSlugs: ["minoxidil-topical", "ghk-cu", "biotin"],
  },
  {
    slug: "under-eye-hollows",
    name: "Under-Eye Hollows",
    description:
      "Sunken tear trough area. Caused by low body fat, genetics, or poor sleep. Reduces youthfulness score significantly.",
    treatmentSlugs: ["caffeine-eye-cream", "ghk-cu", "hyaluronic-acid"],
  },
  {
    slug: "beard-growth",
    name: "Patchy / Thin Beard",
    description:
      "Sparse beard coverage or slow growth. Minoxidil is the most studied topical treatment with strong anecdotal and clinical backing.",
    treatmentSlugs: ["minoxidil-topical", "zinc-picolinate"],
  },
  {
    slug: "skin-clarity",
    name: "Skin Clarity / Acne",
    description:
      "Uneven texture, active breakouts, or scarring. Skin clarity is a major trust and health signal — foundational before advanced protocols.",
    treatmentSlugs: [
      "salicylic-acid",
      "niacinamide",
      "tretinoin",
      "azelaic-acid",
      "vitamin-c-serum",
      "zinc-picolinate",
      "omega-3",
      "collagen-peptides",
      "ghk-cu",
    ],
  },
  {
    slug: "hair-loss",
    name: "Hair Loss / Thinning",
    description:
      "Receding hairline or diffuse thinning. Early intervention has a significantly better outcome.",
    treatmentSlugs: [
      "minoxidil-topical",
      "finasteride",
      "dutasteride",
      "ghk-cu",
      "biotin",
      "zinc-picolinate",
    ],
  },
  {
    slug: "jawline-definition",
    name: "Soft Jawline / Neck Definition",
    description:
      "Poor cervicomental angle or undefined jaw. Primary lever is body fat — most other interventions are marginal until fat loss is addressed.",
    treatmentSlugs: ["mastic-gum", "creatine"],
  },
  {
    slug: "muscle-mass",
    name: "Low Muscle Mass",
    description:
      "Under-developed frame. Body composition is the highest-leverage physical change for overall appearance.",
    treatmentSlugs: [
      "creatine",
      "collagen-peptides",
      "bpc-157",
      "ipamorelin-cjc",
      "vitamin-d3",
      "omega-3",
      "magnesium-glycinate",
    ],
  },
  {
    slug: "recovery",
    name: "Poor Recovery / Joint Pain",
    description:
      "Slow gym recovery, tendon issues, or chronic inflammation. Blocks training consistency.",
    treatmentSlugs: ["bpc-157", "tb-500", "collagen-peptides", "magnesium-glycinate", "omega-3"],
  },
  {
    slug: "hyperpigmentation",
    name: "Hyperpigmentation / Dark Spots",
    description:
      "Post-acne marks, sun damage, or uneven skin tone. Fading requires patience and a consistent protocol with the right actives.",
    treatmentSlugs: ["tretinoin", "vitamin-c-serum", "niacinamide", "azelaic-acid"],
  },
  {
    slug: "oily-skin",
    name: "Oily Skin / Large Pores",
    description:
      "Excess sebum production leads to shine, clogged pores, and acne. Largely genetic but manageable with the right topicals.",
    treatmentSlugs: ["niacinamide", "salicylic-acid", "azelaic-acid", "zinc-picolinate"],
  },
  {
    slug: "poor-sleep",
    name: "Poor Sleep Quality",
    description:
      "Inconsistent or low-quality sleep accelerates aging, tanks testosterone, impairs recovery, and makes everything else harder. Sleep is the master lever.",
    treatmentSlugs: ["magnesium-glycinate", "ashwagandha", "melatonin", "ipamorelin-cjc"],
  },
  {
    slug: "hormonal-optimization",
    name: "Hormonal Optimization / Low T",
    description:
      "Suboptimal testosterone affects muscle gain, fat loss, mood, libido, and drive. Natural protocols can meaningfully move the needle before considering pharmaceutical options.",
    treatmentSlugs: [
      "tongkat-ali",
      "fadogia-agrestis",
      "ashwagandha",
      "zinc-picolinate",
      "vitamin-d3",
      "omega-3",
      "boron",
      "dhea",
      "enclomiphene",
      "mucuna-pruriens",
    ],
  },
  {
    slug: "eyelash-growth",
    name: "Sparse / Short Eyelashes",
    description:
      "Thin or short lash line. Prostaglandin analogues are the only clinically proven topical treatment — bimatoprost (Careprost) is FDA-approved and dramatically thickens, lengthens, and darkens lashes.",
    treatmentSlugs: ["careprost-bimatoprost", "latanoprost"],
  },
  {
    slug: "facial-puffiness",
    name: "Facial Puffiness / Water Retention",
    description:
      "Bloated face dilutes bone structure and reduces jawline definition. Root causes: high sodium, alcohol, poor sleep, allergies. Mechanical drainage and targeted topicals can help acutely and chronically.",
    treatmentSlugs: ["gua-sha", "caffeine-eye-cream"],
  },
  {
    slug: "cognitive-performance",
    name: "Cognitive Performance / Focus",
    description:
      "Mental clarity, focus, and motivation. Directly affects productivity in the afternoon gap between detailing and gym. Nootropics and adaptogens with actual RCT evidence.",
    treatmentSlugs: ["l-theanine", "rhodiola-rosea", "lions-mane", "mucuna-pruriens"],
  },
  {
    slug: "longevity",
    name: "Longevity / Anti-Aging",
    description:
      "Compounds with evidence for slowing biological aging, improving metabolic health, and extending healthspan. The stack underneath the visible improvements.",
    treatmentSlugs: ["taurine", "berberine", "spermidine", "nac", "nmn", "astaxanthin", "epithalon"],
  },
  {
    slug: "tanning",
    name: "Skin Tanning",
    description:
      "Achieving a tan — either for aesthetics or the appearance of lower body fat. Includes legitimate methods and research compounds with significant risk profiles.",
    treatmentSlugs: ["melanotan-ii"],
  },
  {
    slug: "acne-scarring",
    name: "Acne Scarring",
    description:
      "Post-inflammatory marks and textural scarring from acne. Ice-pick, boxcar, and rolling scars respond differently — most require a combination of resurfacing and collagen-stimulating actives.",
    treatmentSlugs: ["dermaroller", "tretinoin", "adapalene", "glycolic-acid", "vitamin-c-serum", "niacinamide", "azelaic-acid"],
  },
  {
    slug: "dark-circles",
    name: "Dark Circles",
    description:
      "Discoloration under the eyes from pigmentation, vascular pooling, or thin skin. One of the most aging features on a face — protocol depends on root cause.",
    treatmentSlugs: ["caffeine-eye-cream", "vitamin-c-serum", "niacinamide", "tranexamic-acid", "alpha-arbutin"],
  },
  {
    slug: "enlarged-pores",
    name: "Enlarged Pores",
    description:
      "Visibly large pores, typically on the nose and cheeks. Caused by excess sebum, sun damage, and loss of skin elasticity. Cannot be permanently shrunk but can be significantly minimized.",
    treatmentSlugs: ["salicylic-acid", "niacinamide", "adapalene", "glycolic-acid", "tretinoin"],
  },
  {
    slug: "razor-bumps",
    name: "Razor Bumps / Ingrown Hairs",
    description:
      "Pseudofolliculitis barbae — ingrown hairs causing inflammation and bumps after shaving. More common with coarser, curlier hair. Requires both acute treatment and prevention protocol.",
    treatmentSlugs: ["salicylic-acid", "glycolic-acid", "benzoyl-peroxide", "adapalene", "tretinoin"],
  },
  {
    slug: "melasma",
    name: "Melasma / Pigmentation Patches",
    description:
      "Symmetrical hyperpigmentation patches, common on forehead, cheeks, and upper lip. Triggered by UV exposure and hormones. One of the harder pigmentation conditions to treat — requires layered actives and strict sun protection.",
    treatmentSlugs: ["tranexamic-acid", "azelaic-acid", "kojic-acid", "alpha-arbutin", "vitamin-c-serum"],
  },
  {
    slug: "dandruff",
    name: "Dandruff / Seborrheic Dermatitis",
    description:
      "Flaking and scalp irritation from Malassezia yeast overgrowth. Highly treatable with antifungals — most people over-complicate it. Nutritional deficiencies can contribute.",
    treatmentSlugs: ["ketoconazole-shampoo", "zinc-picolinate", "omega-3"],
  },
  {
    slug: "androgenic-acne",
    name: "Hormonal / Androgenic Acne",
    description:
      "Jawline, chin, and back acne driven by androgens (DHT). Common in males with higher testosterone or sensitivity. Requires addressing both the topical presentation and the hormonal root cause.",
    treatmentSlugs: ["zinc-picolinate", "saw-palmetto", "benzoyl-peroxide", "salicylic-acid", "adapalene", "isotretinoin"],
  },
  {
    slug: "skin-texture",
    name: "Rough Skin Texture",
    description:
      "Uneven, bumpy, or dull skin surface. Often from dead cell buildup, sluggish turnover, or dehydration. The right exfoliant + retinoid stack will address most cases within 8–12 weeks.",
    treatmentSlugs: ["glycolic-acid", "salicylic-acid", "dermaroller", "tretinoin", "niacinamide", "snail-mucin"],
  },
];
