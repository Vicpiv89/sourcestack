import { useMemo } from 'react';
import { treatments } from '../data/treatments';
import { stackMeta } from '../data/stackMeta';

interface Props {
  selected: string[]; // treatment slugs
}

const W = 300;
const H = 300;
const CX = 150;
const CY = 150;
const OUTER_R = 112;
const INNER_R = 80;
const DOT_R = 90;

function toRad(deg: number) { return (deg * Math.PI) / 180; }

// 12am at top, clockwise. hour 0..23 → angle in degrees
function hourToAngle(hour: number) { return (hour / 24) * 360 - 90; }

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = toRad(startDeg);
  const e = toRad(endDeg);
  const x1 = cx + r * Math.cos(s);
  const y1 = cy + r * Math.sin(s);
  const x2 = cx + r * Math.cos(e);
  const y2 = cy + r * Math.sin(e);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
}

const TIMING_CONFIG = {
  AM:     { hour: 7,  color: '#f59e0b', label: 'AM' },
  PM:     { hour: 21, color: '#60a5fa', label: 'PM' },
  Daily:  { hour: 12, color: '#94a3b8', label: 'Daily' },
  Weekly: { hour: 10, color: '#10b981', label: 'Weekly' },
} as const;

const HOUR_LABELS = [
  { h: 0,  label: '12a' },
  { h: 6,  label: '6a' },
  { h: 12, label: '12p' },
  { h: 18, label: '6p' },
];

export default function ProtocolClock({ selected }: Props) {
  const items = useMemo(() =>
    selected
      .map(slug => {
        const t = treatments.find(tr => tr.slug === slug);
        const meta = stackMeta[slug];
        if (!t || !meta) return null;
        return { slug, name: t.name, timing: meta.timing };
      })
      .filter(Boolean) as { slug: string; name: string; timing: string }[],
    [selected]
  );

  // Group by timing, compute dot positions (stagger multiples)
  const dots = useMemo(() => {
    const byTiming: Record<string, typeof items> = { AM: [], PM: [], Daily: [], Weekly: [] };
    for (const item of items) {
      if (byTiming[item.timing]) byTiming[item.timing].push(item);
    }
    return Object.entries(byTiming).flatMap(([timing, group]) => {
      const cfg = TIMING_CONFIG[timing as keyof typeof TIMING_CONFIG];
      if (!cfg || !group.length) return [];
      const baseAngle = hourToAngle(cfg.hour);
      const spread = Math.min((group.length - 1) * 12, 50);
      return group.map((item, i) => {
        const offset = group.length === 1 ? 0 : -spread / 2 + i * (spread / Math.max(group.length - 1, 1));
        const angleDeg = baseAngle + offset;
        const rad = toRad(angleDeg);
        return {
          ...item,
          timing,
          color: cfg.color,
          x: CX + DOT_R * Math.cos(rad),
          y: CY + DOT_R * Math.sin(rad),
          angleDeg,
        };
      });
    });
  }, [items]);

  return (
    <div className="flex flex-col items-center gap-3">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ overflow: 'visible' }}>
        <defs>
          <filter id="clock-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="clock-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Background rings */}
        <circle cx={CX} cy={CY} r={OUTER_R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={INNER_R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
        <circle cx={CX} cy={CY} r={48} fill="url(#clock-center)" />

        {/* Sleep arc 11pm–6am */}
        <path
          d={arcPath(CX, CY, (OUTER_R + INNER_R) / 2, hourToAngle(23), hourToAngle(30))}
          fill="none"
          stroke="rgba(30,58,138,0.5)"
          strokeWidth={OUTER_R - INNER_R}
          strokeLinecap="butt"
        />

        {/* Morning arc 6am–12pm */}
        <path
          d={arcPath(CX, CY, (OUTER_R + INNER_R) / 2, hourToAngle(6), hourToAngle(12))}
          fill="none"
          stroke="rgba(245,158,11,0.12)"
          strokeWidth={OUTER_R - INNER_R}
          strokeLinecap="butt"
        />

        {/* Evening arc 6pm–11pm */}
        <path
          d={arcPath(CX, CY, (OUTER_R + INNER_R) / 2, hourToAngle(18), hourToAngle(23))}
          fill="none"
          stroke="rgba(79,70,229,0.12)"
          strokeWidth={OUTER_R - INNER_R}
          strokeLinecap="butt"
        />

        {/* Hour tick marks */}
        {Array.from({ length: 24 }, (_, h) => {
          const a = toRad(hourToAngle(h));
          const major = h % 6 === 0;
          const r1 = OUTER_R - 1;
          const r2 = major ? OUTER_R - 7 : OUTER_R - 4;
          return (
            <line
              key={h}
              x1={CX + r1 * Math.cos(a)}
              y1={CY + r1 * Math.sin(a)}
              x2={CX + r2 * Math.cos(a)}
              y2={CY + r2 * Math.sin(a)}
              stroke={major ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}
              strokeWidth={major ? 1.2 : 0.6}
            />
          );
        })}

        {/* Hour labels */}
        {HOUR_LABELS.map(({ h, label }) => {
          const a = toRad(hourToAngle(h));
          const r = OUTER_R + 16;
          return (
            <text
              key={h}
              x={CX + r * Math.cos(a)}
              y={CY + r * Math.sin(a)}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 9, fill: 'rgba(255,255,255,0.25)', fontWeight: 500 }}
            >
              {label}
            </text>
          );
        })}

        {/* Treatment dots */}
        {dots.map((dot, i) => {
          const inRight = Math.cos(toRad(dot.angleDeg)) > 0;
          const labelOffset = inRight ? 16 : -16;
          const labelAnchor = inRight ? 'start' : 'end';
          return (
            <g key={`${dot.slug}-${i}`} style={{ animation: `clockDotIn 0.4s ease ${i * 0.05}s both` }}>
              {/* Connector line from ring to dot */}
              <line
                x1={CX + OUTER_R * Math.cos(toRad(dot.angleDeg))}
                y1={CY + OUTER_R * Math.sin(toRad(dot.angleDeg))}
                x2={dot.x}
                y2={dot.y}
                stroke={`${dot.color}40`}
                strokeWidth="0.6"
              />
              {/* Glow halo */}
              <circle cx={dot.x} cy={dot.y} r={10} fill={`${dot.color}15`} />
              {/* Dot */}
              <circle
                cx={dot.x}
                cy={dot.y}
                r={5}
                fill={dot.color}
                filter="url(#clock-glow)"
              />
              {/* Name label */}
              <text
                x={dot.x + labelOffset}
                y={dot.y}
                textAnchor={labelAnchor}
                dominantBaseline="middle"
                style={{ fontSize: 9, fill: dot.color, fontWeight: 600 }}
              >
                {dot.name.length > 16 ? dot.name.slice(0, 15) + '…' : dot.name}
              </text>
            </g>
          );
        })}

        {/* Center */}
        <text x={CX} y={CY - 9} textAnchor="middle" style={{ fontSize: 22, fontWeight: 800, fill: 'rgba(255,255,255,0.85)' }}>
          {selected.length}
        </text>
        <text x={CX} y={CY + 10} textAnchor="middle" style={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
          {selected.length === 1 ? 'COMPOUND' : 'COMPOUNDS'}
        </text>
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 flex-wrap justify-center">
        {Object.entries(TIMING_CONFIG).map(([timing, cfg]) => (
          <div key={timing} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full block" style={{ background: cfg.color }} />
            <span className="text-xs text-white/35">{cfg.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
