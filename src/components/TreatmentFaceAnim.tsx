// Per-treatment animated before/after face illustration

type AnimType =
  | 'hairGrow' | 'beardGrow' | 'browGrow'
  | 'spotClear' | 'spotFade' | 'darkCircleFade'
  | 'lashGrow' | 'textureSmooth' | 'poreReduce'
  | 'jawDefine' | 'depuff' | 'glowUp';

interface AnimConfig { type: AnimType; timeline: string }

// ── Treatment → animation mapping ────────────────────────────────────────────
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
};

// ── SVG element position data ─────────────────────────────────────────────────
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

// Left/right lash X positions along the eye bottom (y≈132)
const LEFT_LASHES_X  = [65, 69, 73, 76, 80, 84, 88];
const RIGHT_LASHES_X = [112, 116, 120, 124, 128, 132, 136];

// ── Face line art (reused in both SVGs) ──────────────────────────────────────
function FaceLines() {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
      <path
        d="M 100 252 C 80 252 62 234 54 210 C 44 184 38 158 38 132 C 37 104 44 78 58 64 C 68 52 82 42 100 40 C 118 42 132 52 142 64 C 156 78 163 104 162 132 C 162 158 156 184 146 210 C 138 234 120 252 100 252 Z"
        stroke="rgba(255,255,255,0.2)" strokeWidth="0.9"
      />
      <path d="M 58 64 C 70 50 84 44 100 42 C 116 44 130 50 142 64" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
      <path d="M 62 126 Q 76 118 90 126 Q 76 132 62 126 Z" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.04)" />
      <path d="M 110 126 Q 124 118 138 126 Q 124 132 110 126 Z" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" fill="rgba(255,255,255,0.04)" />
      <circle cx="76" cy="126" r="2" fill="rgba(255,255,255,0.18)" />
      <circle cx="124" cy="126" r="2" fill="rgba(255,255,255,0.18)" />
      <path d="M 60 112 C 68 107 76 106 90 110" stroke="rgba(255,255,255,0.24)" strokeWidth="1.1" />
      <path d="M 110 110 C 124 106 132 107 140 112" stroke="rgba(255,255,255,0.24)" strokeWidth="1.1" />
      <path d="M 96 135 C 94 148 90 162 90 167 C 90 171 94 173 100 173 C 106 173 110 171 110 167 C 110 162 106 148 104 135"
        stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      <path d="M 84 190 C 90 185 96 183 100 185 C 104 183 110 185 116 190" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
      <path d="M 84 190 C 92 198 108 198 116 190" stroke="rgba(255,255,255,0.18)" strokeWidth="0.7" />
    </g>
  );
}

// ── Before layer (static problem state) ──────────────────────────────────────
function BeforeLayer({ type }: { type: AnimType }) {
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
    case 'spotClear':
      return (
        <>
          {ACNE_SPOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={i < 8 ? 3.5 : 4} fill="rgba(239,68,68,0.78)" />
          ))}
        </>
      );
    case 'spotFade':
      return (
        <>
          {PIGMENT_SPOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={3} fill="rgba(180,120,60,0.72)" />
          ))}
        </>
      );
    case 'darkCircleFade':
      return (
        <>
          <ellipse cx={76} cy={134} rx={15} ry={9} fill="rgba(15,10,5,0.65)" />
          <ellipse cx={124} cy={134} rx={15} ry={9} fill="rgba(15,10,5,0.65)" />
        </>
      );
    case 'lashGrow':
      return (
        <>
          {LEFT_LASHES_X.slice(0, 4).map((lx,i) => (
            <line key={`l${i}`} x1={lx} y1={132} x2={lx} y2={128} stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
          ))}
          {RIGHT_LASHES_X.slice(0, 4).map((lx,i) => (
            <line key={`r${i}`} x1={lx} y1={132} x2={lx} y2={128} stroke="rgba(255,255,255,0.45)" strokeWidth="1.2" strokeLinecap="round" />
          ))}
        </>
      );
    case 'textureSmooth':
      return (
        <>
          {TEXTURE_DOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={1.8} fill="rgba(255,255,255,0.28)" />
          ))}
        </>
      );
    case 'poreReduce':
      return (
        <>
          {PORE_DOTS.map((d,i) => (
            <circle key={i} cx={d.x} cy={d.y} r={4.5} fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="0.8" />
          ))}
        </>
      );
    case 'jawDefine':
      return (
        <path
          d="M 62 208 C 68 218 80 234 100 243 C 120 234 132 218 138 208"
          fill="none"
          stroke="rgba(251,191,36,0.2)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      );
    case 'depuff':
      return (
        <>
          <ellipse cx={52} cy={162} rx={24} ry={28} fill="rgba(96,165,250,0.14)" stroke="rgba(96,165,250,0.22)" strokeWidth="0.6" />
          <ellipse cx={148} cy={162} rx={24} ry={28} fill="rgba(96,165,250,0.14)" stroke="rgba(96,165,250,0.22)" strokeWidth="0.6" />
        </>
      );
    case 'glowUp':
    default:
      return <></>;
  }
}

// ── After layer (animated improvement state) ──────────────────────────────────
function AfterLayer({ type }: { type: AnimType }) {
  const dur = '6s';
  switch (type) {
    case 'hairGrow':
      return (
        <>
          <ellipse cx={100} cy={50} rx={50} ry={22} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" strokeWidth="0.5" />
          {SCALP_DOTS.map((d,i) => (
            <circle
              key={i} cx={d.x} cy={d.y} r={2.8}
              fill="#10b981"
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
            <circle
              key={i} cx={d.x} cy={d.y} r={2.5}
              fill="#a3e635"
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
            <circle
              key={i} cx={d.x} cy={d.y} r={2.2}
              fill="#c084fc"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${i * 0.45}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    case 'spotClear':
      return (
        <>
          {ACNE_SPOTS.map((d,i) => (
            <circle
              key={i} cx={d.x} cy={d.y} r={i < 8 ? 3.5 : 4}
              fill="rgba(239,68,68,0.78)"
              style={{ animation: `spotOut 5s ease-in-out infinite`, animationDelay: `${i * 0.48}s`, opacity: 0.85 }}
            />
          ))}
        </>
      );
    case 'spotFade':
      return (
        <>
          {PIGMENT_SPOTS.map((d,i) => (
            <circle
              key={i} cx={d.x} cy={d.y} r={3}
              fill="rgba(180,120,60,0.72)"
              style={{ animation: `spotOut 5s ease-in-out infinite`, animationDelay: `${i * 0.6}s`, opacity: 0.72 }}
            />
          ))}
        </>
      );
    case 'darkCircleFade':
      return (
        <>
          <ellipse cx={76} cy={134} rx={15} ry={9} fill="rgba(15,10,5,0.65)"
            style={{ animation: 'areaLighten 5s ease-in-out infinite' }} />
          <ellipse cx={124} cy={134} rx={15} ry={9} fill="rgba(15,10,5,0.65)"
            style={{ animation: 'areaLighten 5s ease-in-out infinite', animationDelay: '0.3s' }} />
        </>
      );
    case 'lashGrow':
      return (
        <>
          {LEFT_LASHES_X.map((lx,i) => (
            <line
              key={`l${i}`} x1={lx} y1={132} x2={lx} y2={122}
              stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${i * 0.35}s`, opacity: 0 }}
            />
          ))}
          {RIGHT_LASHES_X.map((lx,i) => (
            <line
              key={`r${i}`} x1={lx} y1={132} x2={lx} y2={122}
              stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: `hairDotIn ${dur} ease-in-out infinite`, animationDelay: `${(i + LEFT_LASHES_X.length) * 0.35}s`, opacity: 0 }}
            />
          ))}
        </>
      );
    case 'textureSmooth':
      return (
        <>
          {TEXTURE_DOTS.map((d,i) => (
            <circle
              key={i} cx={d.x} cy={d.y} r={1.8}
              fill="rgba(255,255,255,0.28)"
              style={{ animation: `spotOut 5s ease-in-out infinite`, animationDelay: `${i * 0.32}s`, opacity: 0.28 }}
            />
          ))}
          {/* Smooth overlay that fades in as texture dots fade out */}
          <ellipse cx={52} cy={162} rx={20} ry={24} fill="rgba(96,165,250,0)"
            style={{ animation: 'skinSheen 5s ease-in-out infinite' }} />
          <ellipse cx={148} cy={162} rx={20} ry={24} fill="rgba(96,165,250,0)"
            style={{ animation: 'skinSheen 5s ease-in-out infinite', animationDelay: '0.5s' }} />
        </>
      );
    case 'poreReduce':
      return (
        <>
          {PORE_DOTS.map((d,i) => (
            <circle
              key={i} cx={d.x} cy={d.y} r={4.5}
              fill="none" stroke="rgba(148,163,184,0.55)" strokeWidth="0.8"
              style={{ animation: `poreClose 5s ease-in-out infinite`, animationDelay: `${i * 0.38}s` }}
            />
          ))}
        </>
      );
    case 'jawDefine':
      return (
        <>
          {/* Soft undefined before */}
          <path
            d="M 62 208 C 68 218 80 234 100 243 C 120 234 132 218 138 208"
            fill="none" stroke="rgba(251,191,36,0.2)" strokeWidth="1.5" strokeLinecap="round"
          />
          {/* Sharp defined chin that fades in */}
          <path
            d="M 66 210 L 100 244 L 134 210"
            fill="none" stroke="rgba(251,191,36,0.85)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: 'areaGlow 5s ease-in-out infinite', opacity: 0 }}
          />
        </>
      );
    case 'depuff':
      return (
        <>
          <ellipse cx={52} cy={162} rx={24} ry={28} fill="rgba(96,165,250,0.14)" stroke="rgba(96,165,250,0.22)" strokeWidth="0.6"
            style={{ animation: 'areaLighten 5s ease-in-out infinite' }} />
          <ellipse cx={148} cy={162} rx={24} ry={28} fill="rgba(96,165,250,0.14)" stroke="rgba(96,165,250,0.22)" strokeWidth="0.6"
            style={{ animation: 'areaLighten 5s ease-in-out infinite', animationDelay: '0.3s' }} />
        </>
      );
    case 'glowUp':
    default:
      return (
        <>
          <ellipse cx={100} cy={148} rx={65} ry={105}
            fill="rgba(245,158,11,0)"
            style={{ animation: 'skinSheen 5s ease-in-out infinite' }}
          />
        </>
      );
  }
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function TreatmentFaceAnim({ slug }: { slug: string }) {
  const config: AnimConfig = TREATMENT_ANIM[slug] ?? { type: 'glowUp', timeline: '4–12 weeks' };

  return (
    <div className="border border-white/[0.07] rounded-2xl px-5 py-5 bg-white/[0.01]">
      <p className="text-[10px] text-white/25 uppercase tracking-widest text-center mb-4">
        Expected results
      </p>

      <div className="flex items-start gap-3">
        {/* Before */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">Before</span>
          <svg
            viewBox="0 0 200 270"
            className="w-full"
            style={{ maxWidth: 150, display: 'block' }}
          >
            <FaceLines />
            <BeforeLayer type={config.type} />
          </svg>
        </div>

        {/* Timeline */}
        <div className="flex flex-col items-center justify-center shrink-0 pt-20 gap-1">
          <span className="text-white/20 text-base">→</span>
          <span className="text-[9px] text-white/25 text-center whitespace-nowrap leading-tight">
            {config.timeline}
          </span>
        </div>

        {/* After */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <span className="text-[10px] text-white/30 uppercase tracking-wider">After</span>
          <svg
            viewBox="0 0 200 270"
            className="w-full"
            style={{ maxWidth: 150, display: 'block' }}
          >
            <FaceLines />
            <AfterLayer type={config.type} />
          </svg>
        </div>
      </div>
    </div>
  );
}
