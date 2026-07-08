import { useState } from 'react';
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
    shapes: [{ type: 'ellipse', cx: 100, cy: 46, rx: 48, ry: 24 }],
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
    shapes: [{ type: 'ellipse', cx: 100, cy: 227, rx: 24, ry: 13 }],
  },
];

// One head outline, shared by the fill and the line art.
// Cranium dome → temple taper → cheekbones (widest) → jaw taper → chin.
const HEAD_PATH =
  'M 100 18 ' +
  'C 128 18 152 34 158 66 ' +
  'C 162 84 163 106 161 124 ' +
  'C 158 150 150 172 138 196 ' +
  'C 130 214 122 234 110 241 ' +
  'C 104 244 96 244 90 241 ' +
  'C 78 234 70 214 62 196 ' +
  'C 50 172 42 150 39 124 ' +
  'C 37 106 38 84 42 66 ' +
  'C 48 34 72 18 100 18 Z';

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function FaceZoneMap({ maxWidth = 220 }: { maxWidth?: number }) {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const navigate = useNavigate();

  const zone = ZONES.find(z => z.id === activeZoneId) ?? null;
  const relatedIssues = zone
    ? zone.issueSlugs.map(s => allIssues.find(i => i.slug === s)).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col items-center gap-5 select-none w-full">
      <div className="relative mx-auto" style={{ width: '100%', maxWidth }}>
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
            {/* Hairline — inside the skull */}
            <path
              d="M 52 80 C 62 60 80 51 100 51 C 120 51 138 60 148 80"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Left ear */}
            <path
              d="M 40 122 C 32 116 28 127 33 139 C 36 147 41 149 42 143"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.7"
            />
            {/* Right ear */}
            <path
              d="M 160 122 C 168 116 172 127 167 139 C 164 147 159 149 158 143"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.7"
            />
            {/* Left eye — almond, positive canthal tilt */}
            <path
              d="M 58 125 Q 70 116 87 128 Q 71 135 58 125 Z"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="0.9"
              fill="rgba(255,255,255,0.03)"
            />
            {/* Right eye */}
            <path
              d="M 142 125 Q 130 116 113 128 Q 129 135 142 125 Z"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth="0.9"
              fill="rgba(255,255,255,0.03)"
            />
            {/* Irises + pupils */}
            <circle cx="72" cy="126" r="4.5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" fill="none" />
            <circle cx="128" cy="126" r="4.5" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" fill="none" />
            <circle cx="72" cy="126" r="2.2" fill="rgba(255,255,255,0.28)" />
            <circle cx="128" cy="126" r="2.2" fill="rgba(255,255,255,0.28)" />
            {/* Brows — thick, tail slightly higher than head */}
            <path d="M 89 114 C 78 109 66 108 56 111" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
            <path d="M 111 114 C 122 109 134 108 144 111" stroke="rgba(255,255,255,0.38)" strokeWidth="2" />
            {/* Nose — bridge, tip, nostril hints */}
            <path
              d="M 97 132 C 96 146 92 158 90 166 C 89 171 93 174 100 174 C 107 174 111 171 110 166 C 108 158 104 146 103 132"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            <path d="M 90 166 Q 85 168 87 171" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
            <path d="M 110 166 Q 115 168 113 171" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
            {/* Lips — Cupid's bow + fuller lower lip */}
            <path d="M 83 196 C 90 190 96 189 100 191 C 104 189 110 190 117 196" stroke="rgba(255,255,255,0.26)" strokeWidth="0.9" />
            <path d="M 83 196 Q 100 208 117 196" stroke="rgba(255,255,255,0.26)" strokeWidth="0.9" />
            {/* Cheekbone hints */}
            <path d="M 45 140 C 50 152 56 159 62 162" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
            <path d="M 155 140 C 150 152 144 159 138 162" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
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
