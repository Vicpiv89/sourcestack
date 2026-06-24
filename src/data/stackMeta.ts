export interface StackMeta {
  timing: 'AM' | 'PM' | 'Daily' | 'Weekly';
  monthlyCostEstimate: string;
  beginnerFriendly: boolean;
  requiresRx: boolean;
  isResearchCompound: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Interaction {
  slugs: string[];
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export const stackMeta: Record<string, StackMeta> = {
  'minoxidil-topical':    { timing: 'PM',     monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'ru58841':              { timing: 'PM',     monthlyCostEstimate: '~$45', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'medium' },
  'pyrilutamide':         { timing: 'PM',     monthlyCostEstimate: '~$55', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'medium' },
  'ketoconazole-shampoo': { timing: 'Daily',  monthlyCostEstimate: '~$15', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'rosemary-oil':         { timing: 'PM',     monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'saw-palmetto':         { timing: 'Daily',  monthlyCostEstimate: '~$15', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'finasteride':          { timing: 'Daily',  monthlyCostEstimate: '~$20', beginnerFriendly: false, requiresRx: true,  isResearchCompound: false, riskLevel: 'medium' },
  'dutasteride':          { timing: 'Daily',  monthlyCostEstimate: '~$25', beginnerFriendly: false, requiresRx: true,  isResearchCompound: false, riskLevel: 'medium' },
  'biotin':               { timing: 'Daily',  monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'careprost-bimatoprost':{ timing: 'PM',     monthlyCostEstimate: '~$20', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'medium' },
  'latanoprost':          { timing: 'PM',     monthlyCostEstimate: '~$20', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'medium' },
  'ghk-cu':               { timing: 'AM',     monthlyCostEstimate: '~$22', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'low' },
  'bpc-157':              { timing: 'Daily',  monthlyCostEstimate: '~$35', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'medium' },
  'tb-500':               { timing: 'Daily',  monthlyCostEstimate: '~$45', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'medium' },
  'ipamorelin-cjc':       { timing: 'PM',     monthlyCostEstimate: '~$80', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'medium' },
  'epithalon':            { timing: 'PM',     monthlyCostEstimate: '~$50', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'medium' },
  'dermaroller':          { timing: 'Weekly', monthlyCostEstimate: '~$3',  beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'falim-gum':            { timing: 'Daily',  monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'gua-sha':              { timing: 'AM',     monthlyCostEstimate: '~$2',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'caffeine-eye-cream':   { timing: 'AM',     monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'adapalene':            { timing: 'PM',     monthlyCostEstimate: '~$15', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'tazarotene':           { timing: 'PM',     monthlyCostEstimate: '~$30', beginnerFriendly: false, requiresRx: true,  isResearchCompound: false, riskLevel: 'medium' },
  'tretinoin':            { timing: 'PM',     monthlyCostEstimate: '~$25', beginnerFriendly: false, requiresRx: true,  isResearchCompound: false, riskLevel: 'low' },
  'isotretinoin':         { timing: 'Daily',  monthlyCostEstimate: '~$60', beginnerFriendly: false, requiresRx: true,  isResearchCompound: false, riskLevel: 'high' },
  'benzoyl-peroxide':     { timing: 'AM',     monthlyCostEstimate: '~$12', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'salicylic-acid':       { timing: 'AM',     monthlyCostEstimate: '~$15', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'glycolic-acid':        { timing: 'PM',     monthlyCostEstimate: '~$15', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'alpha-arbutin':        { timing: 'AM',     monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'tranexamic-acid':      { timing: 'AM',     monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'kojic-acid':           { timing: 'PM',     monthlyCostEstimate: '~$12', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'niacinamide':          { timing: 'AM',     monthlyCostEstimate: '~$7',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'vitamin-c-serum':      { timing: 'AM',     monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'hyaluronic-acid':      { timing: 'AM',     monthlyCostEstimate: '~$7',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'azelaic-acid':         { timing: 'PM',     monthlyCostEstimate: '~$9',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'snail-mucin':          { timing: 'PM',     monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'centella-asiatica':    { timing: 'PM',     monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'creatine':             { timing: 'Daily',  monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'collagen-peptides':    { timing: 'Daily',  monthlyCostEstimate: '~$15', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'mastic-gum':           { timing: 'Daily',  monthlyCostEstimate: '~$20', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'zinc-picolinate':      { timing: 'Daily',  monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'vitamin-d3':           { timing: 'Daily',  monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'omega-3':              { timing: 'Daily',  monthlyCostEstimate: '~$15', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'magnesium-glycinate':  { timing: 'PM',     monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'ashwagandha':          { timing: 'PM',     monthlyCostEstimate: '~$18', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'tongkat-ali':          { timing: 'AM',     monthlyCostEstimate: '~$22', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'fadogia-agrestis':     { timing: 'Daily',  monthlyCostEstimate: '~$20', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'medium' },
  'melatonin':            { timing: 'PM',     monthlyCostEstimate: '~$5',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'glycine':              { timing: 'PM',     monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'taurine':              { timing: 'AM',     monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'berberine':            { timing: 'Daily',  monthlyCostEstimate: '~$18', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'medium' },
  'spermidine':           { timing: 'Daily',  monthlyCostEstimate: '~$30', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'nac':                  { timing: 'Daily',  monthlyCostEstimate: '~$10', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'nmn':                  { timing: 'AM',     monthlyCostEstimate: '~$40', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'astaxanthin':          { timing: 'Daily',  monthlyCostEstimate: '~$20', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'l-theanine':           { timing: 'PM',     monthlyCostEstimate: '~$10', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'rhodiola-rosea':       { timing: 'AM',     monthlyCostEstimate: '~$18', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'lions-mane':           { timing: 'AM',     monthlyCostEstimate: '~$25', beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'mucuna-pruriens':      { timing: 'AM',     monthlyCostEstimate: '~$20', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'high' },
  'boron':                { timing: 'Daily',  monthlyCostEstimate: '~$8',  beginnerFriendly: true,  requiresRx: false, isResearchCompound: false, riskLevel: 'low' },
  'dhea':                 { timing: 'AM',     monthlyCostEstimate: '~$15', beginnerFriendly: false, requiresRx: false, isResearchCompound: false, riskLevel: 'high' },
  'enclomiphene':         { timing: 'Daily',  monthlyCostEstimate: '~$80', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'high' },
  'melanotan-ii':         { timing: 'Daily',  monthlyCostEstimate: '~$60', beginnerFriendly: false, requiresRx: false, isResearchCompound: true,  riskLevel: 'high' },
};

export const INTERACTIONS: Interaction[] = [
  { slugs: ['finasteride', 'dutasteride'],      severity: 'error',   message: 'Both are 5-AR inhibitors — do not stack. Choose one. Dutasteride is stronger.' },
  { slugs: ['tretinoin', 'adapalene'],           severity: 'error',   message: 'Redundant — both are retinoids. Tretinoin is more potent. Choose one.' },
  { slugs: ['tretinoin', 'tazarotene'],          severity: 'error',   message: 'Redundant — both are retinoids. Tazarotene is the strongest. Choose one.' },
  { slugs: ['adapalene', 'tazarotene'],          severity: 'error',   message: 'Redundant — both are retinoids. Tazarotene is stronger. Choose one.' },
  { slugs: ['benzoyl-peroxide', 'tretinoin'],    severity: 'warning', message: 'BPO inactivates tretinoin on contact. Use BPO in AM and tretinoin in PM — never the same application.' },
  { slugs: ['benzoyl-peroxide', 'adapalene'],    severity: 'warning', message: 'BPO inactivates adapalene on contact. Use BPO in AM, adapalene in PM.' },
  { slugs: ['niacinamide', 'vitamin-c-serum'],   severity: 'warning', message: 'Apply at different times — combining reduces efficacy of both. Vitamin C in AM, niacinamide flexible.' },
  { slugs: ['glycolic-acid', 'tretinoin'],       severity: 'warning', message: 'Do not use on the same night — combined exfoliation causes significant irritation.' },
  { slugs: ['salicylic-acid', 'tretinoin'],      severity: 'warning', message: 'Avoid same night during first 3 months; combine carefully once fully acclimated to tretinoin.' },
  { slugs: ['glycolic-acid', 'adapalene'],       severity: 'warning', message: 'Do not use on the same night — both increase cell turnover significantly.' },
  { slugs: ['mucuna-pruriens', 'rhodiola-rosea'],severity: 'warning', message: 'Both modulate monoamine neurotransmitters. Monitor for overstimulation, anxiety, or insomnia.' },
  { slugs: ['minoxidil-topical', 'ru58841'],     severity: 'info',    message: 'Good stack — different mechanisms (vasodilation + AR blockade). Apply RU58841 first, minoxidil 30 min later.' },
  { slugs: ['minoxidil-topical', 'pyrilutamide'],severity: 'info',    message: 'Good stack — different mechanisms. Apply pyrilutamide first, minoxidil 30 min later.' },
  { slugs: ['bpc-157', 'tb-500'],               severity: 'info',    message: 'Classic stack — BPC-157 is localized, TB-500 is systemic. Complementary mechanisms, safe to combine.' },
  { slugs: ['tongkat-ali', 'fadogia-agrestis'],  severity: 'info',    message: 'Popular natural testosterone stack. Different mechanisms — combine is common and considered safe.' },
  { slugs: ['dermaroller', 'minoxidil-topical'], severity: 'info',    message: 'Excellent combo — apply minoxidil immediately post-rolling for 40-80x increased absorption.' },
  { slugs: ['dermaroller', 'ghk-cu'],            severity: 'info',    message: 'Excellent combo — apply GHK-Cu immediately post-rolling for dramatically enhanced absorption.' },
];
