// Maps what a user might type → terms to expand the search with.
// Keys are lowercase. Values are extra terms injected into the search.
const SYNONYM_MAP: Record<string, string[]> = {
  // Brows / lashes
  eyebrow: ["brow", "brows", "thin brows", "sparse brows"],
  eyebrows: ["brow", "brows", "thin brows", "sparse brows"],
  eyelash: ["lash", "lashes", "eyelash growth", "bimatoprost", "careprost"],
  eyelashes: ["lash", "lashes", "eyelash growth", "bimatoprost", "careprost"],
  lashes: ["lash", "eyelash", "bimatoprost", "careprost", "latanoprost"],
  lash: ["eyelash", "lashes", "bimatoprost", "careprost"],

  // Hair
  hair: ["hair loss", "thinning", "alopecia", "bald", "minoxidil"],
  balding: ["hair loss", "alopecia", "mpb", "hairline", "minoxidil", "finasteride"],
  bald: ["hair loss", "alopecia", "minoxidil", "finasteride"],
  hairline: ["hair loss", "receding", "minoxidil", "finasteride"],
  receding: ["hair loss", "hairline", "finasteride", "dutasteride"],
  alopecia: ["hair loss", "thinning", "minoxidil"],
  thinning: ["hair loss", "sparse", "minoxidil", "finasteride"],
  mpb: ["hair loss", "male pattern baldness", "finasteride", "dutasteride"],
  "male pattern baldness": ["hair loss", "mpb", "finasteride", "minoxidil"],
  rogaine: ["minoxidil"],
  minox: ["minoxidil"],

  // Beard
  beard: ["beard growth", "facial hair", "minoxidil"],
  "facial hair": ["beard", "beard growth", "minoxidil"],
  mustache: ["beard", "beard growth"],
  patchy: ["beard growth", "sparse", "minoxidil"],

  // Skin
  acne: ["skin clarity", "breakouts", "pimples", "salicylic acid", "benzoyl peroxide", "tretinoin"],
  pimples: ["acne", "skin clarity", "breakouts", "benzoyl peroxide"],
  breakouts: ["acne", "skin clarity", "pimples", "salicylic acid"],
  blemishes: ["acne", "skin clarity", "hyperpigmentation"],
  blackheads: ["acne", "oily skin", "salicylic acid", "pores"],
  whiteheads: ["acne", "skin clarity", "salicylic acid"],
  scarring: ["acne scars", "hyperpigmentation", "skin clarity", "tretinoin"],
  "acne scars": ["hyperpigmentation", "skin clarity", "tretinoin", "microneedling"],
  texture: ["skin clarity", "skin texture", "glycolic acid", "tretinoin"],
  pores: ["oily skin", "niacinamide", "salicylic acid", "skin clarity"],
  sebum: ["oily skin", "niacinamide", "salicylic acid", "zinc"],
  oily: ["oily skin", "sebum", "niacinamide", "salicylic acid"],
  shine: ["oily skin", "sebum", "niacinamide"],
  dull: ["skin clarity", "vitamin c", "glycolic acid", "exfoliant"],
  dullness: ["skin clarity", "vitamin c", "glycolic acid"],
  glow: ["skin clarity", "vitamin c", "niacinamide", "hyaluronic acid"],

  // Hyperpigmentation
  "dark spots": ["hyperpigmentation", "alpha arbutin", "tranexamic acid", "vitamin c"],
  "dark marks": ["hyperpigmentation", "PIH", "alpha arbutin"],
  pih: ["hyperpigmentation", "post-inflammatory", "alpha arbutin", "tranexamic acid"],
  melasma: ["hyperpigmentation", "tranexamic acid", "kojic acid", "tretinoin"],
  "uneven skin tone": ["hyperpigmentation", "niacinamide", "vitamin c"],
  "sun spots": ["hyperpigmentation", "vitamin c", "tranexamic acid"],
  discoloration: ["hyperpigmentation", "dark spots", "alpha arbutin"],
  brightening: ["hyperpigmentation", "vitamin c", "niacinamide", "alpha arbutin"],

  // Eyes
  "under eye": ["under-eye hollows", "dark circles", "caffeine", "puffy"],
  "dark circles": ["under-eye hollows", "caffeine eye cream", "gua sha"],
  "eye bags": ["under-eye hollows", "puffiness", "caffeine", "gua sha"],
  "puffy eyes": ["under-eye hollows", "facial puffiness", "caffeine", "gua sha"],
  hollow: ["under-eye hollows", "tear trough"],
  "tear trough": ["under-eye hollows", "caffeine eye cream"],

  // Jaw / face shape
  jaw: ["jawline", "jawline definition", "mastic gum", "falim", "gua sha"],
  jawline: ["jawline definition", "mastic gum", "falim gum", "gua sha"],
  chin: ["jawline definition", "cervicomental", "mastic gum"],
  "double chin": ["jawline definition", "body fat", "mastic gum"],
  cervicomental: ["jawline definition", "chin tucks", "mastic gum"],
  chewing: ["falim", "mastic gum", "jaw development"],
  gum: ["mastic gum", "falim", "jaw development"],
  masseter: ["falim", "mastic gum", "jaw development"],
  bloated: ["facial puffiness", "gua sha", "sodium"],
  puffy: ["facial puffiness", "gua sha", "caffeine eye cream"],
  puffiness: ["facial puffiness", "gua sha", "caffeine eye cream"],

  // Body / muscle
  muscle: ["muscle mass", "creatine", "protein", "bpc-157"],
  gains: ["muscle mass", "creatine", "ipamorelin"],
  bulk: ["muscle mass", "creatine", "protein"],
  lean: ["muscle mass", "body composition"],
  physique: ["muscle mass", "body composition", "creatine"],
  strength: ["muscle mass", "creatine"],

  // Recovery
  injury: ["recovery", "bpc-157", "tb-500"],
  injuries: ["recovery", "bpc-157", "tb-500"],
  tendon: ["recovery", "bpc-157", "tb-500", "collagen"],
  joint: ["recovery", "bpc-157", "collagen peptides", "omega-3"],
  inflammation: ["recovery", "omega-3", "bpc-157", "tb-500"],

  // Sleep
  sleep: ["poor sleep", "melatonin", "magnesium", "glycine", "l-theanine"],
  insomnia: ["poor sleep", "melatonin", "magnesium glycinate", "glycine"],
  "sleep quality": ["poor sleep", "magnesium glycinate", "glycine", "melatonin"],

  // Testosterone / hormones
  testosterone: ["hormonal optimization", "tongkat ali", "fadogia", "enclomiphene", "boron", "zinc"],
  test: ["testosterone", "hormonal optimization", "tongkat ali"],
  "low t": ["hormonal optimization", "testosterone", "tongkat ali", "enclomiphene"],
  hormones: ["hormonal optimization", "testosterone", "dhea"],
  libido: ["hormonal optimization", "testosterone", "mucuna pruriens", "enclomiphene"],
  dhea: ["hormonal optimization", "adrenal", "testosterone"],
  trt: ["testosterone", "hormonal optimization", "enclomiphene"],

  // Peptides
  peptide: ["peptides", "bpc-157", "tb-500", "ghk-cu", "ipamorelin"],
  peptides: ["bpc-157", "tb-500", "ghk-cu", "ipamorelin", "epithalon", "sermorelin", "semaglutide"],
  ghk: ["ghk-cu", "copper peptide"],
  bpc: ["bpc-157"],
  "copper peptide": ["ghk-cu"],
  gh: ["ipamorelin", "cjc-1295", "growth hormone", "sermorelin", "tesamorelin"],
  "growth hormone": ["ipamorelin", "cjc-1295", "sermorelin", "tesamorelin"],
  ipamorelin: ["growth hormone", "cjc-1295", "peptides"],
  sermorelin: ["growth hormone", "gh secretagogue", "peptides"],
  tesamorelin: ["growth hormone", "visceral fat", "body fat", "peptides"],
  "mots-c": ["mots c", "metabolic", "body fat", "longevity"],
  "mots c": ["mots-c", "metabolic", "body fat"],
  kpv: ["skin clarity", "anti-inflammatory", "acne", "gut"],
  "thymosin alpha 1": ["thymosin-alpha-1", "immune", "recovery"],
  selank: ["anxiety", "cognitive performance", "nootropic peptide"],
  semax: ["focus", "cognitive performance", "nootropic peptide"],
  "pt-141": ["pt 141", "bremelanotide", "libido", "hormonal optimization"],
  "pt 141": ["pt-141", "bremelanotide", "libido"],
  bremelanotide: ["pt-141", "libido", "hormonal optimization"],

  // GLP-1 / fat loss
  glp: ["glp-1", "semaglutide", "tirzepatide", "body fat", "fat loss"],
  "glp-1": ["semaglutide", "tirzepatide", "ozempic", "body fat", "fat loss"],
  "glp 1": ["glp-1", "semaglutide", "tirzepatide", "fat loss"],
  semaglutide: ["glp-1", "ozempic", "wegovy", "body fat", "fat loss"],
  ozempic: ["semaglutide", "glp-1", "fat loss", "body fat"],
  wegovy: ["semaglutide", "glp-1", "fat loss"],
  tirzepatide: ["glp-1", "mounjaro", "zepbound", "body fat", "fat loss"],
  mounjaro: ["tirzepatide", "glp-1", "fat loss"],
  zepbound: ["tirzepatide", "glp-1", "fat loss"],
  "fat loss": ["body fat", "semaglutide", "tirzepatide", "tesamorelin", "jawline"],
  "body fat": ["fat loss", "semaglutide", "tirzepatide", "jawline definition"],
  "weight loss": ["body fat", "fat loss", "semaglutide", "tirzepatide"],
  lose: ["body fat", "fat loss", "weight loss"],
  cutting: ["body fat", "fat loss", "aod-9604"],
  "aod": ["aod-9604", "fat loss", "body fat"],
  "aod-9604": ["fat loss", "body fat", "peptide"],

  // Retinoids
  retinol: ["tretinoin", "adapalene", "retinoid"],
  retinoid: ["tretinoin", "adapalene", "tazarotene"],
  "retina a": ["tretinoin"],
  retin: ["tretinoin", "retinoid"],
  tret: ["tretinoin"],
  differin: ["adapalene"],
  tazorac: ["tazarotene"],
  accutane: ["isotretinoin"],
  roaccutane: ["isotretinoin"],

  // Skincare general
  spf: ["sunscreen", "sun protection", "skincare"],
  sunscreen: ["spf", "uv protection", "skincare"],
  moisturizer: ["hyaluronic acid", "skin barrier", "centella"],
  serum: ["vitamin c", "niacinamide", "hyaluronic acid", "alpha arbutin"],
  exfoliant: ["glycolic acid", "salicylic acid", "aha", "bha"],
  aha: ["glycolic acid", "lactic acid", "exfoliant"],
  bha: ["salicylic acid", "exfoliant", "pores"],
  "chemical exfoliant": ["glycolic acid", "salicylic acid"],
  "snail mucin": ["snail", "cosrx", "skin repair"],
  snail: ["snail mucin", "cosrx", "skin repair"],
  cica: ["centella asiatica", "skin barrier", "calming"],
  "skin barrier": ["centella asiatica", "snail mucin", "hyaluronic acid"],

  // Needling
  microneedling: ["dermaroller", "needling", "skin rejuvenation"],
  "derma roller": ["dermaroller", "microneedling"],
  needling: ["dermaroller", "microneedling"],
  roller: ["dermaroller", "microneedling"],

  // Tanning
  tan: ["tanning", "melanotan", "melanin", "mt2"],
  tanning: ["melanotan ii", "melanotan 1", "melanin", "mt2"],
  mt2: ["melanotan ii", "tanning peptide"],
  mt1: ["melanotan 1", "afamelanotide", "tanning"],
  "melanotan": ["melanotan ii", "melanotan 1", "tanning"],
  afamelanotide: ["melanotan 1", "tanning"],

  // Topical peptides
  argireline: ["fine lines", "topical botox", "acetyl hexapeptide", "wrinkles"],
  matrixyl: ["fine lines", "palmitoyl peptide", "collagen", "wrinkles"],
  "topical botox": ["argireline", "fine lines"],

  // Anti-aging / longevity
  "anti-aging": ["longevity", "nmn", "nad", "spermidine", "taurine"],
  antiaging: ["longevity", "nmn", "nad", "spermidine"],
  aging: ["longevity", "nmn", "nad+", "spermidine", "epithalon"],
  nad: ["nmn", "nad+", "longevity"],
  "nad+": ["nmn", "nicotinamide", "longevity"],
  autophagy: ["spermidine", "longevity", "berberine"],
  longevity: ["nmn", "taurine", "spermidine", "berberine", "astaxanthin"],

  // Nootropics
  nootropic: ["cognitive performance", "lion's mane", "l-theanine", "rhodiola"],
  nootropics: ["cognitive performance", "lion's mane", "l-theanine", "rhodiola"],
  focus: ["cognitive performance", "l-theanine", "lion's mane", "rhodiola"],
  "brain fog": ["cognitive performance", "lion's mane", "rhodiola"],
  concentration: ["cognitive performance", "l-theanine", "lion's mane"],
  motivation: ["cognitive performance", "mucuna pruriens", "dopamine"],
  dopamine: ["mucuna pruriens", "cognitive performance"],
  anxiety: ["l-theanine", "ashwagandha", "rhodiola", "magnesium"],
  stress: ["ashwagandha", "rhodiola", "l-theanine", "cortisol"],
  cortisol: ["ashwagandha", "rhodiola", "stress"],

  // Misc
  collagen: ["collagen peptides", "skin clarity", "skin firmness", "glycine"],
  protein: ["collagen peptides", "muscle mass"],
  supplement: ["supplements", "creatine", "zinc", "magnesium"],
  supplements: ["creatine", "collagen", "zinc", "magnesium", "vitamin d"],
  vitamin: ["vitamin d3", "vitamin c", "zinc", "biotin"],
  "vitamin d": ["vitamin d3", "hormonal optimization", "testosterone"],
  zinc: ["zinc picolinate", "hormonal optimization", "skin clarity"],
  magnesium: ["magnesium glycinate", "poor sleep", "recovery"],
  gua: ["gua sha", "lymphatic drainage", "facial massage"],
  lymphatic: ["gua sha", "facial puffiness", "drainage"],
  massage: ["gua sha", "facial massage", "lymphatic"],
  "fish oil": ["omega-3", "epa", "dha"],
  omega: ["omega-3", "fish oil", "epa dha"],
  "omega 3": ["omega-3", "fish oil"],
  berberine: ["metformin", "blood sugar", "ampk", "longevity"],
  metformin: ["berberine", "blood sugar", "longevity"],
  ashwagandha: ["ksm-66", "adaptogen", "testosterone", "cortisol"],
  "lion's mane": ["lions mane", "hericium", "ngf", "cognitive"],
  "lions mane": ["lion's mane", "hericium", "ngf", "cognitive"],
  rhodiola: ["adaptogen", "fatigue", "stress", "shr-5"],
  "tongkat ali": ["eurycoma", "testosterone", "shbg", "longjack"],
  longjack: ["tongkat ali", "testosterone"],
  fadogia: ["fadogia agrestis", "testosterone", "lh"],
  enclomiphene: ["serm", "testosterone", "clomid", "fertility"],
  clomid: ["enclomiphene", "clomiphene", "testosterone", "serm"],

  // Redness / sensitivity
  red: ["redness", "azelaic acid", "niacinamide", "centella", "snail mucin", "skin clarity"],
  redness: ["azelaic acid", "niacinamide", "centella", "cica", "skin barrier", "skin clarity"],
  rosacea: ["azelaic acid", "niacinamide", "centella", "redness"],
  flushed: ["redness", "azelaic acid", "niacinamide"],
  flushing: ["redness", "azelaic acid", "niacinamide"],
  irritated: ["skin barrier", "centella", "snail mucin", "niacinamide"],
  irritation: ["skin barrier", "centella", "snail mucin", "niacinamide"],
  inflamed: ["redness", "azelaic acid", "centella", "skin clarity"],
  sensitive: ["skin barrier", "centella", "snail mucin", "hyaluronic acid"],

  // Face areas
  cheek: ["skin clarity", "acne", "redness", "facial puffiness", "pores"],
  cheeks: ["skin clarity", "acne", "redness", "facial puffiness", "pores"],
  forehead: ["skin clarity", "acne", "skin texture"],
  nose: ["pores", "oily skin", "blackheads"],

  // Hair extras
  norwood: ["hair loss", "hairline", "finasteride", "minoxidil"],
  "widows peak": ["hairline", "hair loss", "minoxidil"],
  crown: ["hair loss", "thinning", "minoxidil"],
  temples: ["hairline", "hair loss", "minoxidil"],
  dandruff: ["ketoconazole", "seborrheic", "flaking", "zinc"],
  flakes: ["dandruff", "ketoconazole", "seborrheic"],
  flaky: ["dandruff", "ketoconazole"],
  "itchy scalp": ["dandruff", "ketoconazole"],

  // Aging / dryness / eyes
  wrinkles: ["tretinoin", "collagen", "anti-aging", "fine lines", "argireline", "matrixyl"],
  "fine lines": ["tretinoin", "collagen peptides", "hyaluronic acid", "argireline", "matrixyl"],
  "crows feet": ["tretinoin", "caffeine eye cream", "collagen"],
  dry: ["hyaluronic acid", "snail mucin", "skin barrier", "moisturizer"],
  dehydrated: ["hyaluronic acid", "skin barrier"],
  bags: ["under-eye hollows", "dark circles", "caffeine eye cream"],
  eyebags: ["under-eye hollows", "dark circles", "caffeine eye cream"],
  tired: ["poor sleep", "dark circles", "caffeine eye cream"],

  // Energy / body
  fatigue: ["poor sleep", "rhodiola", "vitamin d3", "cognitive performance"],
  energy: ["cognitive performance", "rhodiola", "vitamin d3", "l-theanine"],
  skinny: ["muscle mass", "creatine", "protein"],

  // Slang / community
  "glow up": ["skin clarity", "vitamin c", "jawline definition", "hair loss"],
  glowup: ["skin clarity", "vitamin c", "jawline definition", "hair loss"],
  looksmax: ["skin clarity", "jawline definition", "hair loss"],
  looksmaxxing: ["skin clarity", "jawline definition", "hair loss"],
  mewing: ["jawline definition", "mastic gum", "falim"],
  "face fat": ["facial puffiness", "jawline definition", "gua sha"],
  "moon face": ["facial puffiness", "gua sha", "sodium"],
};

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function expandQuery(raw: string): { direct: string; synonyms: string[] } {
  const q = raw.toLowerCase().trim();
  const exactSynonyms = SYNONYM_MAP[q] ?? [];
  const partialMatches: string[] = [];
  for (const [key, vals] of Object.entries(SYNONYM_MAP)) {
    if (key === q) continue;
    // short keys ("red", "jaw") must match as whole words, or "tired"
    // would trigger redness and "bulk" would trigger nothing useful
    const inQuery = key.length >= 6
      ? q.includes(key)
      : new RegExp(`\\b${escapeRe(key)}\\b`).test(q);
    const queryInKey = q.length >= 4 && key.includes(q);
    if (inQuery || queryInKey) partialMatches.push(...vals);
  }
  return { direct: q, synonyms: [...exactSynonyms, ...partialMatches] };
}

// Score how relevant an item is to a query.
// Higher = more relevant. Direct matches beat synonym matches.
// Name/title matches beat body text matches.
export function scoreMatch(
  fields: { name: string; body: string; slugs?: string[] },
  query: string
): number {
  const { direct, synonyms } = expandQuery(query);
  const name = fields.name.toLowerCase();
  const body = fields.body.toLowerCase();
  const slugText = (fields.slugs ?? []).join(" ").toLowerCase();

  let score = 0;

  // Direct query hits
  if (name === direct) score += 200;                         // exact name match
  else if (name.startsWith(direct)) score += 150;           // name starts with query
  else if (name.includes(direct)) score += 100;             // query in name
  if (body.includes(direct)) score += 40;                   // query in body text
  if (slugText.includes(direct)) score += 20;               // query in slugs

  // Synonym hits (lower weight)
  for (const syn of synonyms) {
    if (name.includes(syn)) score += 30;
    if (body.includes(syn)) score += 10;
    if (slugText.includes(syn)) score += 5;
  }

  return score;
}
