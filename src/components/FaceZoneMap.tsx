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
    shapes: [{ type: 'ellipse', cx: 100, cy: 50, rx: 50, ry: 22 }],
  },
  {
    id: 'forehead',
    label: 'Forehead',
    sublabel: 'clarity · texture · melasma',
    issueSlugs: ['skin-clarity', 'skin-texture', 'melasma'],
    color: '#60a5fa',
    shapes: [{ type: 'ellipse', cx: 100, cy: 88, rx: 40, ry: 20 }],
  },
  {
    id: 'brows',
    label: 'Eyebrows',
    sublabel: 'density · fullness · shape',
    issueSlugs: ['thin-brows'],
    color: '#c084fc',
    shapes: [
      { type: 'ellipse', cx: 76, cy: 113, rx: 16, ry: 7 },
      { type: 'ellipse', cx: 124, cy: 113, rx: 16, ry: 7 },
    ],
  },
  {
    id: 'under-eye',
    label: 'Under Eyes',
    sublabel: 'hollows · dark circles · lashes',
    issueSlugs: ['under-eye-hollows', 'dark-circles', 'eyelash-growth'],
    color: '#818cf8',
    shapes: [
      { type: 'ellipse', cx: 76, cy: 132, rx: 15, ry: 10 },
      { type: 'ellipse', cx: 124, cy: 132, rx: 15, ry: 10 },
    ],
  },
  {
    id: 'cheeks',
    label: 'Cheeks',
    sublabel: 'acne · pores · texture · puffiness · scarring',
    issueSlugs: ['skin-clarity', 'oily-skin', 'enlarged-pores', 'facial-puffiness', 'acne-scarring'],
    color: '#fb923c',
    shapes: [
      { type: 'ellipse', cx: 51, cy: 162, rx: 20, ry: 24 },
      { type: 'ellipse', cx: 149, cy: 162, rx: 20, ry: 24 },
    ],
  },
  {
    id: 'nose',
    label: 'Nose',
    sublabel: 'enlarged pores · excess oil',
    issueSlugs: ['enlarged-pores', 'oily-skin'],
    color: '#94a3b8',
    shapes: [{ type: 'ellipse', cx: 100, cy: 157, rx: 13, ry: 17 }],
  },
  {
    id: 'beard',
    label: 'Beard Area',
    sublabel: 'growth · density · ingrown hairs',
    issueSlugs: ['beard-growth', 'razor-bumps'],
    color: '#a3e635',
    shapes: [
      { type: 'ellipse', cx: 73, cy: 216, rx: 18, ry: 13 },
      { type: 'ellipse', cx: 127, cy: 216, rx: 18, ry: 13 },
    ],
  },
  {
    id: 'jaw',
    label: 'Jaw & Chin',
    sublabel: 'definition · hormonal acne',
    issueSlugs: ['jawline-definition', 'androgenic-acne'],
    color: '#fbbf24',
    shapes: [{ type: 'ellipse', cx: 100, cy: 234, rx: 28, ry: 15 }],
  },
];

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function FaceZoneMap() {
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const navigate = useNavigate();

  const zone = ZONES.find(z => z.id === activeZoneId) ?? null;
  const relatedIssues = zone
    ? zone.issueSlugs.map(s => allIssues.find(i => i.slug === s)).filter(Boolean)
    : [];

  return (
    <div className="flex flex-col items-center gap-5 select-none w-full">
      <div className="relative mx-auto" style={{ width: '100%', maxWidth: 220 }}>
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
          <path
            d="M 100 42 C 118 44 132 52 143 68 C 157 82 165 110 165 136 C 165 160 160 185 143 208 L 100 254 L 57 208 C 40 185 35 160 35 136 C 35 110 43 82 57 68 C 68 52 82 44 100 42 Z"
            fill="url(#face-grad)"
          />

          {/* ── Face line art (non-interactive) ───────── */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            {/* Outline — wide cheekbones, angular jaw, pointed chin */}
            <path
              d="M 100 42 C 118 44 132 52 143 68 C 157 82 165 110 165 136 C 165 160 160 185 143 208 L 100 254 L 57 208 C 40 185 35 160 35 136 C 35 110 43 82 57 68 C 68 52 82 44 100 42 Z"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.8"
            />
            {/* Hairline */}
            <path
              d="M 57 68 C 70 52 84 44 100 42 C 116 44 130 52 143 68"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Left ear */}
            <path
              d="M 35 136 C 31 126 27 134 31 144 C 33 150 35 147"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Right ear */}
            <path
              d="M 165 136 C 169 126 173 134 169 144 C 167 150 165 147"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Left eye — positive canthal tilt (outer corner higher) */}
            <path
              d="M 63 126 Q 76 120 89 130 Q 76 134 63 126 Z"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="0.8"
              fill="rgba(255,255,255,0.04)"
            />
            {/* Right eye */}
            <path
              d="M 137 126 Q 124 120 111 130 Q 124 134 137 126 Z"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="0.8"
              fill="rgba(255,255,255,0.04)"
            />
            {/* Pupils */}
            <circle cx="76" cy="127" r="2" fill="rgba(255,255,255,0.22)" />
            <circle cx="124" cy="127" r="2" fill="rgba(255,255,255,0.22)" />
            {/* Left brow — strong horizontal */}
            <path d="M 60 113 C 70 107 80 106 91 110" stroke="rgba(255,255,255,0.28)" strokeWidth="1.3" />
            {/* Right brow */}
            <path d="M 109 110 C 120 106 130 107 140 113" stroke="rgba(255,255,255,0.28)" strokeWidth="1.3" />
            {/* Nose bridge + nostrils */}
            <path
              d="M 97 136 C 95 149 91 163 91 168 C 91 172 95 174 100 174 C 105 174 109 172 109 168 C 109 163 105 149 103 136"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.7"
            />
            {/* Upper lip (Cupid's bow) */}
            <path d="M 85 191 C 91 186 96 184 100 186 C 104 184 109 186 115 191" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
            {/* Lower lip */}
            <path d="M 85 191 C 93 199 107 199 115 191" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
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
          <p className="text-white/20 text-xs text-center pt-3">
            Hover a zone to explore treatments
          </p>
        )}
      </div>
    </div>
  );
}
