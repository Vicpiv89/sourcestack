// Per-treatment animated face illustration

type AnimType =
  | 'hairGrow' | 'beardGrow' | 'browGrow' | 'lashGrow'
  | 'spotClear' | 'spotFade' | 'darkCircleFade'
  | 'textureSmooth' | 'poreReduce'
  | 'jawDefine' | 'depuff' | 'glowUp';

interface AnimConfig { type: AnimType; timeline: string }

const TREATMENT_ANIM: Record<string, AnimConfig> = {
  'minoxidil-topical':    { type: 'hairGrow',      timeline: '1–6 months' },
  'ru58841':              { type: 'hairGrow',      timeline: '3–6 months' },
  'pyrilutamide':         { type: 'hairGrow',      timeline: '3–6 months' },
  'ketoconazole-shampoo': { type: 'hairGrow',      timeline: '3–6 months' },
  'rosemary-oil':         { type: 'hairGrow',      timeline: '3–6 months' },
  'saw-palmetto':         { type: 'hairGrow',      timeline: '6–12 months' },
  'finasteride':          { type: 'hairGrow',      timeline: '6–12 months' },
  'dutasteride':          { type: 'hairGrow',      timeline: '6–12 months' },
  'biotin':               { type: 'browGrow',      timeline: '3–6 months' },
  'careprost-bimatoprost':{ type: 'lashGrow',      timeline: '4–16 weeks' },
  'latanoprost':          { type: 'lashGrow',      timeline: '4–16 weeks' },
  'ghk-cu':               { type: 'textureSmooth', timeline: '4–12 weeks' },
  'bpc-157':              { type: 'glowUp',        timeline: '4–8 weeks' },
  'tb-500':               { type: 'glowUp',        timeline: '4–8 weeks' },
  'ipamorelin-cjc':       { type: 'glowUp',        timeline: '2–6 months' },
  'epithalon':            { type: 'glowUp',        timeline: '3–6 months' },
  'tretinoin':            { type: 'textureSmooth', timeline: '6–12 weeks' },
  'adapalene':            { type: 'spotClear',     timeline: '8–12 weeks' },
  'tazarotene':           { type: 'textureSmooth', timeline: '4–12 weeks' },
  'isotretinoin':         { type: 'spotClear',     timeline: '3–6 months' },
  'benzoyl-peroxide':     { type: 'spotClear',     timeline: '2–8 weeks' },
  'salicylic-acid':       { type: 'poreReduce',    timeline: '4–8 weeks' },
  'glycolic-acid':        { type: 'textureSmooth', timeline: '4–8 weeks' },
  'niacinamide':          { type: 'poreReduce',    timeline: '4–8 weeks' },
  'vitamin-c-serum':      { type: 'spotFade',      timeline: '4–12 weeks' },
  'hyaluronic-acid':      { type: 'glowUp',        timeline: '2–4 weeks' },
  'azelaic-acid':         { type: 'spotFade',      timeline: '6–12 weeks' },
  'alpha-arbutin':        { type: 'spotFade',      timeline: '4–12 weeks' },
  'tranexamic-acid':      { type: 'spotFade',      timeline: '4–12 weeks' },
  'kojic-acid':           { type: 'spotFade',      timeline: '4–12 weeks' },
  'snail-mucin':          { type: 'textureSmooth', timeline: '4–8 weeks' },
  'centella-asiatica':    { type: 'spotClear',     timeline: '4–8 weeks' },
  'caffeine-eye-cream':   { type: 'depuff',        timeline: '2–6 weeks' },
  'dermaroller':          { type: 'textureSmooth', timeline: '3–6 months' },
  'falim-gum':            { type: 'jawDefine',     timeline: '3–12 months' },
  'gua-sha':              { type: 'depuff',        timeline: '1–4 weeks' },
  'creatine':             { type: 'glowUp',        timeline: '4–8 weeks' },
  'collagen-peptides':    { type: 'textureSmooth', timeline: '2–4 months' },
  'mastic-gum':           { type: 'jawDefine',     timeline: '3–12 months' },
  'zinc-picolinate':      { type: 'spotClear',     timeline: '4–8 weeks' },
  'vitamin-d3':           { type: 'glowUp',        timeline: '4–8 weeks' },
  'omega-3':              { type: 'textureSmooth', timeline: '4–12 weeks' },
  'magnesium-glycinate':  { type: 'glowUp',        timeline: '2–4 weeks' },
  'ashwagandha':          { type: 'glowUp',        timeline: '4–8 weeks' },
  'tongkat-ali':          { type: 'glowUp',        timeline: '4–8 weeks' },
  'fadogia-agrestis':     { type: 'glowUp',        timeline: '4–8 weeks' },
  'melatonin':            { type: 'glowUp',        timeline: '1–4 weeks' },
  'glycine':              { type: 'glowUp',        timeline: '2–4 weeks' },
  'taurine':              { type: 'glowUp',        timeline: '4–8 weeks' },
  'berberine':            { type: 'glowUp',        timeline: '4–12 weeks' },
  'spermidine':           { type: 'glowUp',        timeline: '3–6 months' },
  'nac':                  { type: 'glowUp',        timeline: '4–8 weeks' },
  'nmn':                  { type: 'glowUp',        timeline: '3–6 months' },
  'astaxanthin':          { type: 'glowUp',        timeline: '4–8 weeks' },
  'l-theanine':           { type: 'glowUp',        timeline: '1–2 weeks' },
  'rhodiola-rosea':       { type: 'glowUp',        timeline: '2–4 weeks' },
  'lions-mane':           { type: 'glowUp',        timeline: '4–8 weeks' },
  'mucuna-pruriens':      { type: 'glowUp',        timeline: '2–4 weeks' },
  'boron':                { type: 'glowUp',        timeline: '4–8 weeks' },
  'dhea':                 { type: 'glowUp',        timeline: '4–8 weeks' },
  'enclomiphene':         { type: 'glowUp',        timeline: '4–12 weeks' },
  'melanotan-ii':         { type: 'glowUp',        timeline: '2–4 weeks' },
  'melanotan-1':          { type: 'glowUp',        timeline: '2–4 weeks' },
  'semaglutide':          { type: 'jawDefine',     timeline: '3–12 months' },
  'tirzepatide':          { type: 'jawDefine',     timeline: '3–12 months' },
  'tesamorelin':          { type: 'jawDefine',     timeline: '3–6 months' },
  'aod-9604':             { type: 'jawDefine',     timeline: '2–3 months' },
  'mots-c':               { type: 'glowUp',        timeline: '4–8 weeks' },
  'sermorelin':           { type: 'glowUp',        timeline: '4–12 weeks' },
  'thymosin-alpha-1':     { type: 'glowUp',        timeline: '2–6 weeks' },
  'kpv':                  { type: 'spotClear',     timeline: '4–8 weeks' },
  'pt-141':               { type: 'glowUp',        timeline: 'on-demand' },
  'selank':               { type: 'glowUp',        timeline: '1–2 weeks' },
  'semax':                { type: 'glowUp',        timeline: '1–2 weeks' },
  'argireline':           { type: 'textureSmooth', timeline: '4–8 weeks' },
  'matrixyl':             { type: 'textureSmooth', timeline: '8–12 weeks' },
};

// ── Dot position data ─────────────────────────────────────────────────────────
const SCALP_DOTS = [
  {x:74,y:46},{x:82,y:42},{x:90,y:39},{x:98,y:38},{x:106,y:38},{x:114,y:40},{x:122,y:43},{x:130,y:47},
  {x:70,y:54},{x:78,y:51},{x:86,y:48},{x:94,y:46},{x:102,y:46},{x:110,y:48},{x:118,y:51},{x:126,y:55},
  {x:75,y:61},{x:84,y:58},{x:93,y:57},{x:102,y:56},{x:111,y:57},{x:120,y:59},
];
const BEARD_DOTS = [
  {x:57,y:207},{x:64,y:211},{x:71,y:215},{x:78,y:212},{x:85,y:207},
  {x:58,y:219},{x:65,y:223},{x:72,y:225},{x:79,y:222},{x:86,y:218},
  {x:115,y:207},{x:122,y:211},{x:129,y:215},{x:136,y:212},{x:143,y:207},
  {x:114,y:219},{x:121,y:223},{x:128,y:225},{x:135,y:222},{x:141,y:218},
];
const BROW_DOTS = [
  {x:63,y:113},{x:68,y:110},{x:73,y:109},{x:78,y:109},{x:83,y:110},{x:88,y:112},
  {x:112,y:112},{x:117,y:110},{x:122,y:109},{x:127,y:109},{x:132,y:110},{x:137,y:112},
];
const ACNE_SPOTS = [
  {x:47,y:150},{x:56,y:162},{x:63,y:169},{x:51,y:177},
  {x:150,y:152},{x:155,y:163},{x:148,y:174},{x:157,y:168},
  {x:89,y:83},{x:101,y:79},
];
const PIGMENT_SPOTS = [
  {x:50,y:153},{x:58,y:164},{x:54,y:176},
  {x:148,y:155},{x:154,y:165},{x:150,y:176},
  {x:88,y:87},{x:100,y:82},
];
const TEXTURE_DOTS = [
  {x:43,y:149},{x:50,y:155},{x:57,y:161},{x:63,y:157},{x:58,y:169},{x:50,y:175},{x:44,y:166},{x:56,y:179},
  {x:140,y:150},{x:147,y:155},{x:154,y:160},{x:159,y:156},{x:153,y:168},{x:146,y:175},{x:141,y:167},{x:154,y:179},
];
const PORE_DOTS = [
  {x:95,y:149},{x:101,y:147},{x:107,y:149},
  {x:93,y:156},{x:99,y:154},{x:105,y:156},{x:111,y:154},
  {x:95,y:163},{x:101,y:161},{x:107,y:163},
  {x:88,y:157},{x:113,y:157},
];
const LEFT_LASHES_X  = [65, 69, 73, 76, 80, 84, 88];
const RIGHT_LASHES_X = [112, 116, 120, 124, 128, 132, 136];

// ── Model-tier face line art ──────────────────────────────────────────────────
function FaceLines() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      {/* Face outline */}
      <path
        d="M 100 42 C 120 44 138 52 150 68 C 166 84 172 110 172 136 C 172 162 164 188 146 208 A 50 28 0 0 1 54 208 C 36 188 28 162 28 136 C 28 110 34 84 50 68 C 62 52 80 44 100 42 Z"
        stroke="rgba(255,255,255,0.22)" strokeWidth="0.9"
      />
      {/* Hairline */}
      <path d="M 50 68 C 64 52 80 44 100 42 C 120 44 136 52 150 68"
        stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      {/* Left ear */}
      <path d="M 28 136 C 24 126 20 134 24 144 C 26 150 28 147"
        stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      {/* Right ear */}
      <path d="M 172 136 C 176 126 180 134 176 144 C 174 150 172 147"
        stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />

      {/* Left eye — fox eye, outer corner (62,121) well above inner (90,130) */}
      <path d="M 62 121 Q 72 113 90 130 Q 76 136 62 121 Z"
        stroke="rgba(255,255,255,0.32)" strokeWidth="0.9" fill="rgba(255,255,255,0.03)" />
      {/* Right eye */}
      <path d="M 138 121 Q 128 113 110 130 Q 124 136 138 121 Z"
        stroke="rgba(255,255,255,0.32)" strokeWidth="0.9" fill="rgba(255,255,255,0.03)" />
      {/* Iris rings */}
      <circle cx="75" cy="124" r="5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" fill="none" />
      <circle cx="125" cy="124" r="5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" fill="none" />
      {/* Pupils */}
      <circle cx="75" cy="124" r="2.5" fill="rgba(255,255,255,0.28)" />
      <circle cx="125" cy="124" r="2.5" fill="rgba(255,255,255,0.28)" />

      {/* Left brow — straight, thick, sits close over the eye */}
      <path d="M 59 110 C 68 106 78 105 91 109"
        stroke="rgba(255,255,255,0.38)" strokeWidth="1.6" />
      {/* Right brow */}
      <path d="M 109 109 C 122 105 132 106 141 110"
        stroke="rgba(255,255,255,0.38)" strokeWidth="1.6" />

      {/* Nose bridge + nostrils */}
      <path d="M 98 136 C 96 150 93 162 93 167 C 93 172 96 174 100 174 C 104 174 107 172 107 167 C 107 162 104 150 102 136"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />

      {/* Upper lip — Cupid's bow */}
      <path d="M 84 190 C 90 184 95 182 100 184 C 105 182 110 184 116 190"
        stroke="rgba(255,255,255,0.26)" strokeWidth="0.85" />
      {/* Lower lip */}
      <path d="M 84 190 Q 100 201 116 190"
        stroke="rgba(255,255,255,0.26)" strokeWidth="0.85" />
    </g>
  );
}

// ── Growth types: static problem state (left face) ────────────────────────────
function GrowthBefore({ type }: { type: AnimType }) {
  switch (type) {
    case 'hairGrow':
      return (
        <>
          <ellipse cx={100} cy={50} rx={50} ry={22} fill="rgba(16,185,129,0.07)" stroke="rgba(16,185,129,0.18)" strokeWidth="0.5" />
          {[{x:82,y:43},{x:100,y:40},{x:118,y:43}].map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.5} fill="rgba(16,185,129,0.38)" />
          ))}
        </>
      );
    case 'beardGrow':
      return (
        <>
          <ellipse cx={73} cy={216} rx={20} ry={14} fill="rgba(163,230,53,0.07)" stroke="rgba(163,230,53,0.18)" strokeWidth="0.5" />
          <ellipse cx={127} cy={216} rx={20} ry={14} fill="rgba(163,230,53,0.07)" stroke="rgba(163,230,53,0.18)" strokeWidth="0.5" />
          {[{x:65,y:212},{x:80,y:218},{x:120,y:212},{x:135,y:218}].map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.5} fill="rgba(163,230,53,0.38)" />
          ))}
        </>
      );
    case 'browGrow':
      return (
        <>
          <ellipse cx={76} cy={112} rx={17} ry={7} fill="rgba(192,132,252,0.08)" stroke="rgba(192,132,252,0.18)" strokeWidth="0.5" />
          <ellipse cx={124} cy={112} rx={17} ry={7} fill="rgba(192,132,252,0.08)" stroke="rgba(192,132,252,0.18)" strokeWidth="0.5" />
          {[{x:70,y:112},{x:82,y:110},{x:118,y:112},{x:130,y:110}].map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2} fill="rgba(192,132,252,0.38)" />
          ))}
        </>
      );
    case 'lashGrow':
      return (
        <>
          {LEFT_LASHES_X.slice(0, 4).map((lx,i) => (
            <line key={`l${i}`} x1={lx} y1={132} x2={lx} y2={128} stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          ))}
          {RIGHT_LASHES_X.slice(0, 4).map((lx,i) => (
            <line key={`r${i}`} x1={lx} y1={132} x2={lx} y2={128} stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </>
      );
    default:
      return <></>;
  }
}

// ── Growth types: animated improvement state (right face) ─────────────────────
function GrowthAfter({ type }: { type: AnimType }) {
  const dur = '6s';
  switch (type) {
    case 'hairGrow':
      return (
        <>
          <ellipse cx={100} cy={50} rx={50} ry={22} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
          {SCALP_DOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.8} fill="#10b981"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${i * 0.27}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    case 'beardGrow':
      return (
        <>
          <ellipse cx={73} cy={216} rx={20} ry={14} fill="rgba(163,230,53,0.12)" stroke="rgba(163,230,53,0.28)" strokeWidth="0.5" />
          <ellipse cx={127} cy={216} rx={20} ry={14} fill="rgba(163,230,53,0.12)" stroke="rgba(163,230,53,0.28)" strokeWidth="0.5" />
          {BEARD_DOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.5} fill="#a3e635"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${i * 0.3}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    case 'browGrow':
      return (
        <>
          <ellipse cx={76} cy={112} rx={17} ry={7} fill="rgba(192,132,252,0.14)" stroke="rgba(192,132,252,0.28)" strokeWidth="0.5" />
          <ellipse cx={124} cy={112} rx={17} ry={7} fill="rgba(192,132,252,0.14)" stroke="rgba(192,132,252,0.28)" strokeWidth="0.5" />
          {BROW_DOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={2.2} fill="#c084fc"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${i * 0.45}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    case 'lashGrow':
      return (
        <>
          {LEFT_LASHES_X.map((lx,i) => (
            <line key={`l${i}`} x1={lx} y1={132} x2={lx} y2={122} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${i * 0.35}s`, opacity: 0 }}
            />
          ))}
          {RIGHT_LASHES_X.map((lx,i) => (
            <line key={`r${i}`} x1={lx} y1={132} x2={lx} y2={122} stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${(i + LEFT_LASHES_X.length) * 0.35}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    default:
      return <></>;
  }
}

// ── Non-growth types: single-face crossfade animation ─────────────────────────
// Problem elements use problemFadeOut, improvement elements use improveAppear.
function TransformLayer({ type }: { type: AnimType }) {
  const dur = '6s';
  const pOut = `problemFadeOut ${dur} ease-in-out infinite`;
  const aIn  = `improveAppear  ${dur} ease-in-out infinite`;

  switch (type) {
    case 'spotClear':
      return (
        <>
          {ACNE_SPOTS.map((d,i) => (
            <circle key={`p${i}`} cx={d.x} cy={d.y} r={i < 8 ? 3.5 : 4}
              fill="rgba(239,68,68,0.78)"
              style={{ animation: pOut, animationDelay: `${i * 0.06}s` }}
            />
          ))}
          <ellipse cx={52} cy={162} rx={20} ry={24} fill="rgba(96,165,250,0.18)"
            style={{ animation: aIn, opacity: 0 }} />
          <ellipse cx={148} cy={162} rx={20} ry={24} fill="rgba(96,165,250,0.18)"
            style={{ animation: aIn, animationDelay: '0.3s', opacity: 0 }} />
        </>
      );
    case 'spotFade':
      return (
        <>
          {PIGMENT_SPOTS.map((d,i) => (
            <circle key={`p${i}`} cx={d.x} cy={d.y} r={3}
              fill="rgba(180,120,60,0.72)"
              style={{ animation: pOut, animationDelay: `${i * 0.08}s` }}
            />
          ))}
          <ellipse cx={100} cy={148} rx={65} ry={105} fill="rgba(245,158,11,0.1)"
            style={{ animation: aIn, opacity: 0 }} />
        </>
      );
    case 'darkCircleFade':
      return (
        <>
          <ellipse cx={76} cy={134} rx={15} ry={9} fill="rgba(15,10,5,0.65)"
            style={{ animation: pOut }} />
          <ellipse cx={124} cy={134} rx={15} ry={9} fill="rgba(15,10,5,0.65)"
            style={{ animation: pOut, animationDelay: '0.2s' }} />
          <ellipse cx={76} cy={134} rx={14} ry={8} fill="rgba(129,140,248,0.28)"
            style={{ animation: aIn, opacity: 0 }} />
          <ellipse cx={124} cy={134} rx={14} ry={8} fill="rgba(129,140,248,0.28)"
            style={{ animation: aIn, animationDelay: '0.2s', opacity: 0 }} />
        </>
      );
    case 'textureSmooth':
      return (
        <>
          {TEXTURE_DOTS.map((d,i) => (
            <circle key={`p${i}`} cx={d.x} cy={d.y} r={1.8}
              fill="rgba(255,255,255,0.28)"
              style={{ animation: pOut, animationDelay: `${i * 0.04}s` }}
            />
          ))}
          <ellipse cx={52} cy={162} rx={20} ry={24} fill="rgba(96,165,250,0.2)"
            style={{ animation: aIn, opacity: 0 }} />
          <ellipse cx={148} cy={162} rx={20} ry={24} fill="rgba(96,165,250,0.2)"
            style={{ animation: aIn, animationDelay: '0.4s', opacity: 0 }} />
        </>
      );
    case 'poreReduce':
      return (
        <>
          {PORE_DOTS.map((d,i) => (
            <circle key={`p${i}`} cx={d.x} cy={d.y} r={4.5}
              fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="0.8"
              style={{ animation: pOut, animationDelay: `${i * 0.08}s` }}
            />
          ))}
          {PORE_DOTS.map((d,i) => (
            <circle key={`a${i}`} cx={d.x} cy={d.y} r={2.2}
              fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="0.5"
              style={{ animation: aIn, animationDelay: `${i * 0.08}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    case 'jawDefine':
      return (
        <>
          <path
            d="M 54 208 A 55 32 0 0 0 146 208"
            fill="none" stroke="rgba(251,191,36,0.45)" strokeWidth="1.5" strokeLinecap="round"
            style={{ animation: pOut }}
          />
          <path
            d="M 54 208 L 100 232 L 146 208"
            fill="none" stroke="rgba(251,191,36,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: aIn, opacity: 0 }}
          />
        </>
      );
    case 'depuff':
      return (
        <>
          <ellipse cx={52} cy={162} rx={24} ry={28} fill="rgba(96,165,250,0.18)" stroke="rgba(96,165,250,0.28)" strokeWidth="0.8"
            style={{ animation: pOut }} />
          <ellipse cx={148} cy={162} rx={24} ry={28} fill="rgba(96,165,250,0.18)" stroke="rgba(96,165,250,0.28)" strokeWidth="0.8"
            style={{ animation: pOut, animationDelay: '0.3s' }} />
        </>
      );
    case 'glowUp':
    default:
      return (
        <ellipse cx={100} cy={148} rx={65} ry={108} fill="rgba(245,158,11,0.12)"
          style={{ animation: aIn, opacity: 0 }} />
      );
  }
}

// ── Main export ───────────────────────────────────────────────────────────────
const GROWTH_TYPES: AnimType[] = ['hairGrow', 'beardGrow', 'browGrow', 'lashGrow'];

export default function TreatmentFaceAnim({ slug }: { slug: string }) {
  const config: AnimConfig = TREATMENT_ANIM[slug] ?? { type: 'glowUp', timeline: '4–12 weeks' };
  const isGrowth = GROWTH_TYPES.includes(config.type);

  return (
    <div className="border border-white/[0.07] rounded-2xl px-5 py-5 bg-white/[0.01]">
      {isGrowth ? (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <svg viewBox="0 0 200 270" className="w-full" style={{ maxWidth: 150, display: 'block', margin: '0 auto' }}>
              <FaceLines />
              <GrowthBefore type={config.type} />
            </svg>
          </div>
          <div className="flex flex-col items-center gap-2 shrink-0">
            <span
              className="text-white/30 text-sm"
              style={{ animation: 'arrowPulse 2s ease-in-out infinite', display: 'inline-block' }}
            >
              →
            </span>
            <span className="text-[9px] text-white/25 text-center whitespace-nowrap leading-tight">
              {config.timeline}
            </span>
          </div>
          <div className="flex-1">
            <svg viewBox="0 0 200 270" className="w-full" style={{ maxWidth: 150, display: 'block', margin: '0 auto' }}>
              <FaceLines />
              <GrowthAfter type={config.type} />
            </svg>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <svg viewBox="0 0 200 270" className="w-full" style={{ maxWidth: 172, display: 'block', margin: '0 auto' }}>
            <FaceLines />
            <TransformLayer type={config.type} />
          </svg>
          <span className="text-[9px] text-white/30 px-2.5 py-1 rounded-full border border-white/[0.08] tracking-wider uppercase">
            {config.timeline}
          </span>
        </div>
      )}
    </div>
  );
}
