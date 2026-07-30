import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { issues as allIssues } from '../data/issues';

interface ShapeEllipse { type: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
interface ShapePath    { type: 'path'; d: string }
type Shape = ShapeEllipse | ShapePath;

interface ZoneDef {
  id: string;
  label: string;
  sublabel: string;
  issueSlugs: string[];
  color: string;
  shapes: Shape[];
}

const ZONES: ZoneDef[] = [
  {
    id: 'scalp',
    label: 'Scalp & Hair',
    sublabel: 'hair loss · dandruff · density',
    issueSlugs: ['hair-loss', 'dandruff'],
    color: '#10b981',
    shapes: [{ type: 'ellipse', cx: 100, cy: 46, rx: 44, ry: 24 }],
  },
  {
    id: 'forehead',
    label: 'Forehead',
    sublabel: 'clarity · texture · melasma',
    issueSlugs: ['skin-clarity', 'skin-texture', 'melasma'],
    color: '#60a5fa',
    shapes: [{ type: 'ellipse', cx: 100, cy: 88, rx: 42, ry: 19 }],
  },
  {
    id: 'brows',
    label: 'Eyebrows',
    sublabel: 'density · fullness · shape',
    issueSlugs: ['thin-brows'],
    color: '#c084fc',
    shapes: [
      { type: 'ellipse', cx: 73, cy: 112, rx: 17, ry: 6 },
      { type: 'ellipse', cx: 127, cy: 112, rx: 17, ry: 6 },
    ],
  },
  {
    id: 'under-eye',
    label: 'Under Eyes',
    sublabel: 'hollows · dark circles · lashes',
    issueSlugs: ['under-eye-hollows', 'dark-circles', 'eyelash-growth'],
    color: '#818cf8',
    shapes: [
      { type: 'ellipse', cx: 73, cy: 139, rx: 15, ry: 9 },
      { type: 'ellipse', cx: 127, cy: 139, rx: 15, ry: 9 },
    ],
  },
  {
    id: 'cheeks',
    label: 'Cheeks',
    sublabel: 'acne · pores · texture · puffiness · scarring',
    issueSlugs: ['skin-clarity', 'oily-skin', 'enlarged-pores', 'facial-puffiness', 'acne-scarring'],
    color: '#fb923c',
    shapes: [
      { type: 'ellipse', cx: 59, cy: 158, rx: 15, ry: 22 },
      { type: 'ellipse', cx: 141, cy: 158, rx: 15, ry: 22 },
    ],
  },
  {
    id: 'nose',
    label: 'Nose',
    sublabel: 'enlarged pores · excess oil',
    issueSlugs: ['enlarged-pores', 'oily-skin'],
    color: '#94a3b8',
    shapes: [{ type: 'ellipse', cx: 100, cy: 155, rx: 12, ry: 19 }],
  },
  {
    id: 'beard',
    label: 'Beard Area',
    sublabel: 'growth · density · ingrown hairs',
    issueSlugs: ['beard-growth', 'razor-bumps'],
    color: '#a3e635',
    shapes: [
      { type: 'ellipse', cx: 79, cy: 209, rx: 15, ry: 12 },
      { type: 'ellipse', cx: 121, cy: 209, rx: 15, ry: 12 },
    ],
  },
  {
    id: 'jaw',
    label: 'Jaw & Chin',
    sublabel: 'definition · hormonal acne',
    issueSlugs: ['jawline-definition', 'androgenic-acne'],
    color: '#fbbf24',
    shapes: [{ type: 'ellipse', cx: 100, cy: 227, rx: 20, ry: 13 }],
  },
];

// Tapered to canonical "ideal" male proportions rather than a plain ellipse:
// wide zygomatic (cheekbone) peak around eye level, then a defined gonial
// angle tapering into a forward chin — bigonial:bizygomatic ~0.7, roughly
// matching the fWHR / V-taper ratios cited in looksmaxxing canon.
const HEAD_PATH =
  'M 100 16 ' +
  'C 140 18 172 40 176 58 ' +
  'C 180 80 184 105 184 130 ' +
  'C 182 150 178 162 174 168 ' +
  'C 168 182 162 190 158 196 ' +
  'L 132 222 ' +
  'Q 112 244 100 248 ' +
  'Q 88 244 68 222 ' +
  'L 42 196 ' +
  'C 38 190 32 182 26 168 ' +
  'C 22 162 18 150 16 130 ' +
  'C 16 105 20 80 24 58 ' +
  'C 28 40 60 18 100 16 Z';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function FaceZoneMap({ maxWidth = 220 }: { maxWidth?: number }) {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [sweepPlayed, setSweepPlayed] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const pupilLRef = useRef<SVGCircleElement>(null);
  const pupilRRef = useRef<SVGCircleElement>(null);

  const zone = ZONES.find(z => z.id === activeZoneId) ?? null;
  const relatedIssues = zone
    ? zone.issueSlugs.map(s => allIssues.find(i => i.slug === s)).filter(Boolean)
    : [];

  // Plays a one-time scan sweep the first time the face scrolls into view.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const el = wrapperRef.current;
    if (!el || reduceMotion) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSweepPlayed(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // While in view, the face tilts in 3D and the eyes glance based on how far
  // it sits from the vertical center of the viewport — it "watches" you scroll
  // past rather than just sliding with the page.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = wrapperRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const centerOffset = (rect.top + rect.height / 2 - vh / 2) / (vh / 2); // ~ -1..1
        const clamped = Math.max(-1, Math.min(1, centerOffset));
        if (tiltRef.current) {
          tiltRef.current.style.transform =
            `perspective(700px) rotateX(${(-clamped * 7).toFixed(2)}deg) rotateY(${(clamped * 4).toFixed(2)}deg)`;
        }
        const pupilShift = (clamped * 2.4).toFixed(2);
        if (pupilLRef.current) pupilLRef.current.style.transform = `translateY(${pupilShift}px)`;
        if (pupilRRef.current) pupilRRef.current.style.transform = `translateY(${pupilShift}px)`;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5 select-none w-full">
      <div ref={wrapperRef} className="relative mx-auto overflow-hidden" style={{ width: '100%', maxWidth, perspective: 700 }}>
        {sweepPlayed && (
          <div
            className="face-sweep-play absolute inset-x-0 top-0 h-1/4 pointer-events-none z-10"
            style={{
              background: 'linear-gradient(rgba(62,216,195,0) 0%, rgba(62,216,195,0.35) 50%, rgba(62,216,195,0) 100%)',
            }}
          />
        )}
        <div ref={tiltRef} style={{ transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)', transformStyle: 'preserve-3d' }}>
        <svg viewBox="0 0 200 270" width="100%" style={{ overflow: 'visible', display: 'block' }}>
          <defs>
            <filter id="face-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="face-grad" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* ── Face fill ─────────────────────────────── */}
          <path d={HEAD_PATH} fill="url(#face-grad)" />

          {/* ── Face line art (non-interactive) ───────── */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            {/* Outline */}
            <path d={HEAD_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            {/* Hairline — widened to match the head */}
            <path
              d="M 34 84 C 48 56 74 47 100 47 C 126 47 152 56 166 84"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Hair texture — small dots scattered across the crown */}
            <g fill="rgba(255,255,255,0.22)" stroke="none">
              <circle cx="76" cy="27" r="1.4" /><circle cx="88" cy="24" r="1.4" /><circle cx="100" cy="23" r="1.4" /><circle cx="112" cy="24" r="1.4" /><circle cx="124" cy="27" r="1.4" />
              <circle cx="66" cy="35" r="1.4" /><circle cx="79" cy="31" r="1.4" /><circle cx="93" cy="29" r="1.4" /><circle cx="107" cy="29" r="1.4" /><circle cx="121" cy="31" r="1.4" /><circle cx="134" cy="35" r="1.4" />
              <circle cx="58" cy="47" r="1.4" /><circle cx="70" cy="41" r="1.4" /><circle cx="86" cy="38" r="1.4" /><circle cx="100" cy="37" r="1.4" /><circle cx="114" cy="38" r="1.4" /><circle cx="130" cy="41" r="1.4" /><circle cx="142" cy="47" r="1.4" />
              <circle cx="52" cy="60" r="1.3" /><circle cx="62" cy="55" r="1.3" /><circle cx="138" cy="55" r="1.3" /><circle cx="148" cy="60" r="1.3" />
            </g>
            {/* Left ear — simple bump attached to the outline */}
            <path d="M 16 118 Q 4 133 17 148" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            {/* Right ear */}
            <path d="M 184 118 Q 196 133 183 148" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            {/* Left eye — clean almond, single pupil */}
            <path
              d="M 62 124 Q 76 114 90 128 Q 76 137 62 124 Z"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="1"
              fill="rgba(255,255,255,0.03)"
            />
            {/* Right eye */}
            <path
              d="M 138 124 Q 124 114 110 128 Q 124 137 138 124 Z"
              stroke="rgba(255,255,255,0.34)"
              strokeWidth="1"
              fill="rgba(255,255,255,0.03)"
            />
            <circle ref={pupilLRef} cx="76" cy="128" r="2.6" fill="rgba(255,255,255,0.4)" />
            <circle ref={pupilRRef} cx="124" cy="128" r="2.6" fill="rgba(255,255,255,0.4)" />
            {/* Brows */}
            <path d="M 91 111 C 80 106 68 105 58 108" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
            <path d="M 109 111 C 120 106 132 105 142 108" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
            {/* Nose — bridge, tip, nostril hints */}
            <path
              d="M 97 133 C 96 147 92 159 90 167 C 89 172 93 175 100 175 C 107 175 111 172 110 167 C 108 159 104 147 103 133"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.8"
            />
            <path d="M 90 167 Q 85 169 87 172" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
            <path d="M 110 167 Q 115 169 113 172" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
            {/* Lips — Cupid's bow + fuller lower lip */}
            <path d="M 82 197 C 89 191 96 190 100 192 C 104 190 111 191 118 197" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            <path d="M 82 197 Q 100 210 118 197" stroke="rgba(255,255,255,0.28)" strokeWidth="1" />
            {/* Cheekbone hints */}
            <path d="M 42 142 C 47 154 54 161 61 165" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
            <path d="M 158 142 C 153 154 146 161 139 165" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
          </g>

          {/* ── Interactive zones ─────────────────────── */}
          {ZONES.map(z => {
            const active = activeZoneId === z.id;
            return (
              <g
                key={z.id}
                style={{
                  cursor: 'pointer',
                  filter: active ? 'url(#face-glow)' : 'none',
                  transition: 'filter 0.25s ease',
                }}
                onMouseEnter={() => setActiveZoneId(z.id)}
                onMouseLeave={() => setActiveZoneId(null)}
                onTouchStart={(e) => { e.preventDefault(); setActiveZoneId(prev => prev === z.id ? null : z.id); }}
                onClick={() => {
                  // On mobile touch already handled by onTouchStart; on desktop navigate for single-issue zones
                  if (z.issueSlugs.length === 1) navigate(`/issues/${z.issueSlugs[0]}`);
                  else setActiveZoneId(z.id);
                }}
              >
                {z.shapes.map((shape, i) => {
                  const fill = active ? hexToRgba(z.color, 0.22) : hexToRgba(z.color, 0.06);
                  const stroke = active ? hexToRgba(z.color, 0.7) : hexToRgba(z.color, 0.18);
                  const sharedStyle: React.CSSProperties = {
                    fill,
                    stroke,
                    strokeWidth: active ? 0.9 : 0.5,
                    transition: 'fill 0.25s ease, stroke 0.25s ease, stroke-width 0.25s ease',
                  };
                  if (shape.type === 'ellipse') {
                    return (
                      <ellipse key={i} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} style={sharedStyle} />
                    );
                  }
                  return <path key={i} d={shape.d} style={sharedStyle} />;
                })}
              </g>
            );
          })}
        </svg>
        </div>
      </div>

      {/* Info panel */}
      <div
        className="w-full min-h-[88px] rounded-xl px-5 py-4 transition-all duration-300"
        style={{
          background: zone ? hexToRgba(zone.color, 0.06) : 'rgba(255,255,255,0.02)',
          border: `1px solid ${zone ? hexToRgba(zone.color, 0.25) : 'rgba(255,255,255,0.07)'}`,
        }}
      >
        {zone ? (
          <>
            <p className="text-sm font-semibold mb-0.5" style={{ color: zone.color }}>
              {zone.label}
            </p>
            <p className="text-white/35 text-xs mb-3">{zone.sublabel}</p>
            <div className="flex flex-wrap gap-1.5">
              {relatedIssues.map(issue => issue && (
                <button
                  key={issue.slug}
                  onClick={() => navigate(`/issues/${issue.slug}`)}
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:opacity-90"
                  style={{
                    background: hexToRgba(zone.color, 0.12),
                    border: `1px solid ${hexToRgba(zone.color, 0.35)}`,
                    color: zone.color,
                  }}
                >
                  {issue.name} →
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-white/25 text-xs mb-2.5">Popular right now</p>
            <div className="flex flex-wrap gap-1.5">
              {[
                { slug: 'hair-loss', name: 'Hair Loss' },
                { slug: 'skin-clarity', name: 'Acne & Clarity' },
                { slug: 'jawline-definition', name: 'Jawline' },
                { slug: 'dark-circles', name: 'Dark Circles' },
              ].map((i) => (
                <button
                  key={i.slug}
                  onClick={() => navigate(`/issues/${i.slug}`)}
                  className="px-2.5 py-1 rounded-full text-xs text-white/40 border border-white/10 hover:text-white/70 hover:border-white/25 transition-colors"
                >
                  {i.name} →
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
