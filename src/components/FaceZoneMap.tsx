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
    <div className="flex flex-col items-center gap-5 select-none">
      <div className="relative" style={{ width: 220, height: 300 }}>
        <svg viewBox="0 0 200 270" width="220" height="297" style={{ overflow: 'visible' }}>
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
            d="M 100 252 C 80 252 62 234 54 210 C 44 184 38 158 38 132 C 37 104 44 78 58 64 C 68 52 82 42 100 40 C 118 42 132 52 142 64 C 156 78 163 104 162 132 C 162 158 156 184 146 210 C 138 234 120 252 100 252 Z"
            fill="url(#face-grad)"
          />

          {/* ── Face line art (non-interactive) ───────── */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ pointerEvents: 'none' }}>
            {/* Outline */}
            <path
              d="M 100 252 C 80 252 62 234 54 210 C 44 184 38 158 38 132 C 37 104 44 78 58 64 C 68 52 82 42 100 40 C 118 42 132 52 142 64 C 156 78 163 104 162 132 C 162 158 156 184 146 210 C 138 234 120 252 100 252 Z"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="0.8"
            />
            {/* Hairline */}
            <path
              d="M 58 64 C 70 50 84 44 100 42 C 116 44 130 50 142 64"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Left ear */}
            <path
              d="M 38 134 C 34 124 30 132 34 142 C 36 148 38 145"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Right ear */}
            <path
              d="M 162 134 C 166 124 170 132 166 142 C 164 148 162 145"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.7"
            />
            {/* Left eye */}
            <path
              d="M 62 126 Q 76 118 90 126 Q 76 132 62 126 Z"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="0.8"
              fill="rgba(255,255,255,0.04)"
            />
            {/* Right eye */}
            <path
              d="M 110 126 Q 124 118 138 126 Q 124 132 110 126 Z"
              stroke="rgba(255,255,255,0.28)"
              strokeWidth="0.8"
              fill="rgba(255,255,255,0.04)"
            />
            {/* Pupils */}
            <circle cx="76" cy="126" r="2.5" fill="rgba(255,255,255,0.22)" />
            <circle cx="124" cy="126" r="2.5" fill="rgba(255,255,255,0.22)" />
            {/* Left brow */}
            <path d="M 60 112 C 68 107 76 106 90 110" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
            {/* Right brow */}
            <path d="M 110 110 C 124 106 132 107 140 112" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
            {/* Nose bridge + nostrils */}
            <path
              d="M 96 135 C 94 148 90 162 90 167 C 90 171 94 173 100 173 C 106 173 110 171 110 167 C 110 162 106 148 104 135"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.7"
            />
            {/* Philtrum */}
            <path d="M 100 180 L 100 185" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
            {/* Upper lip */}
            <path d="M 84 190 C 90 185 96 183 100 185 C 104 183 110 185 116 190" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
            {/* Lower lip */}
            <path d="M 84 190 C 92 198 108 198 116 190" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
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
                onClick={() => {
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
        className="w-full max-w-xs min-h-[88px] rounded-xl px-5 py-4 transition-all duration-300"
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
