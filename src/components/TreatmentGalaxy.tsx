import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { treatments } from '../data/treatments';

const CATEGORY_COLORS: Record<string, string> = {
  'Hair Loss':           '#10b981',
  'Skincare':            '#60a5fa',
  'Supplements':         '#f59e0b',
  'Peptides':            '#c084fc',
  'Research Compounds':  '#f87171',
  'Mechanical':          '#94a3b8',
};

const CATEGORY_ORDER = ['Hair Loss', 'Skincare', 'Supplements', 'Peptides', 'Research Compounds', 'Mechanical'];

const W = 700;
const H = 600;
const CX = W / 2;
const CY = H / 2;
const RING_R = 230;
const LABEL_R = 262;

interface NodeData {
  slug: string;
  name: string;
  category: string;
  color: string;
  x: number;
  y: number;
  angleDeg: number;
}

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function buildNodes(): NodeData[] {
  const grouped: Record<string, typeof treatments> = {};
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  for (const t of treatments) {
    if (grouped[t.category]) grouped[t.category].push(t);
    else grouped[t.category] = [t];
  }

  const total = treatments.length;
  const GAP_DEG = 4;
  const nodes: NodeData[] = [];

  let cursor = -90; // start at top

  for (const cat of CATEGORY_ORDER) {
    const items = grouped[cat] ?? [];
    if (!items.length) continue;
    const arcDeg = Math.max((items.length / total) * 360 - GAP_DEG, 8);
    const startDeg = cursor;
    items.forEach((t, i) => {
      const pct = items.length === 1 ? 0.5 : i / (items.length - 1);
      const angleDeg = startDeg + pct * arcDeg;
      // Slightly stagger radius for a natural look
      const jitter = Math.sin(i * 2.618) * 14;
      const r = RING_R + jitter;
      nodes.push({
        slug: t.slug,
        name: t.name,
        category: t.category,
        color: CATEGORY_COLORS[t.category] ?? '#fff',
        x: CX + r * Math.cos(toRad(angleDeg)),
        y: CY + r * Math.sin(toRad(angleDeg)),
        angleDeg,
      });
    });
    cursor += arcDeg + GAP_DEG;
  }

  return nodes;
}

function buildCategoryMeta() {
  const grouped: Record<string, typeof treatments> = {};
  for (const cat of CATEGORY_ORDER) grouped[cat] = [];
  for (const t of treatments) {
    if (grouped[t.category]) grouped[t.category].push(t);
    else grouped[t.category] = [t];
  }
  const total = treatments.length;
  const GAP_DEG = 4;
  const meta: { cat: string; color: string; midAngle: number; count: number }[] = [];
  let cursor = -90;
  for (const cat of CATEGORY_ORDER) {
    const items = grouped[cat] ?? [];
    if (!items.length) continue;
    const arcDeg = Math.max((items.length / total) * 360 - GAP_DEG, 8);
    meta.push({
      cat,
      color: CATEGORY_COLORS[cat] ?? '#fff',
      midAngle: cursor + arcDeg / 2,
      count: items.length,
    });
    cursor += arcDeg + GAP_DEG;
  }
  return meta;
}

export default function TreatmentGalaxy() {
  const [hovered, setHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  const nodes = useMemo(() => buildNodes(), []);
  const catMeta = useMemo(() => buildCategoryMeta(), []);

  const hoveredNode = nodes.find(n => n.slug === hovered) ?? null;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="gal-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="gal-glow-sm" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        {/* Faint orbit rings */}
        {[RING_R - 25, RING_R, RING_R + 25].map((r, i) => (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.03)"
            strokeWidth="0.5"
          />
        ))}

        {/* Center glow */}
        <circle cx={CX} cy={CY} r={60} fill="url(#center-grad)" />

        {/* Category arc labels */}
        {catMeta.map(({ cat, color, midAngle, count }) => {
          const lx = CX + LABEL_R * Math.cos(toRad(midAngle));
          const ly = CY + LABEL_R * Math.sin(toRad(midAngle));
          const anchor =
            Math.abs(midAngle % 360) < 10 || Math.abs((midAngle % 360) - 360) < 10
              ? 'middle'
              : Math.cos(toRad(midAngle)) > 0.1
              ? 'start'
              : Math.cos(toRad(midAngle)) < -0.1
              ? 'end'
              : 'middle';
          return (
            <g key={cat}>
              <text
                x={lx}
                y={ly}
                textAnchor={anchor}
                dominantBaseline="middle"
                style={{ fontSize: 10, fill: color, fontWeight: 600, letterSpacing: '0.06em', opacity: 0.8 }}
              >
                {cat.toUpperCase()}
              </text>
              <text
                x={lx}
                y={ly + 14}
                textAnchor={anchor}
                dominantBaseline="middle"
                style={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', letterSpacing: '0.03em' }}
              >
                {count} compounds
              </text>
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map(node => {
          const isHov = hovered === node.slug;
          const r = isHov ? 9 : 5.5;
          return (
            <g
              key={node.slug}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(node.slug)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/treatments/${node.slug}`)}
            >
              {/* Outer glow ring when hovered */}
              {isHov && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill={`${node.color}15`}
                  stroke={`${node.color}40`}
                  strokeWidth="0.8"
                  filter="url(#gal-glow)"
                />
              )}
              {/* Node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={r}
                fill={isHov ? node.color : `${node.color}aa`}
                filter={isHov ? 'url(#gal-glow)' : 'url(#gal-glow-sm)'}
                style={{ transition: 'r 0.2s ease, fill 0.2s ease' }}
              />
              {/* Name label when hovered */}
              {isHov && (
                <text
                  x={node.x}
                  y={node.y - 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontSize: 11, fill: node.color, fontWeight: 700, letterSpacing: '0.02em' }}
                  filter="url(#gal-glow-sm)"
                >
                  {node.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Center label */}
        <text
          x={CX}
          y={CY - 10}
          textAnchor="middle"
          style={{ fontSize: 11, fill: 'rgba(255,255,255,0.2)', fontWeight: 600, letterSpacing: '0.1em' }}
        >
          SOURCESTACK
        </text>
        <text
          x={CX}
          y={CY + 8}
          textAnchor="middle"
          style={{ fontSize: 10, fill: 'rgba(255,255,255,0.12)', letterSpacing: '0.06em' }}
        >
          {treatments.length} compounds
        </text>

        {/* Hovered node detail card (foreignObject) */}
        {hoveredNode && (() => {
          // Position card to the opposite side of the node
          const inRight = Math.cos(toRad(hoveredNode.angleDeg)) > 0;
          const cardW = 180;
          const cardX = inRight ? hoveredNode.x + 16 : hoveredNode.x - 16 - cardW;
          const cardY = hoveredNode.y - 30;
          return (
            <foreignObject x={cardX} y={cardY} width={cardW} height={90} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  background: 'rgba(10,10,10,0.92)',
                  border: `1px solid ${hoveredNode.color}30`,
                  borderRadius: 10,
                  padding: '10px 12px',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <p style={{ fontSize: 11, fontWeight: 700, color: hoveredNode.color, marginBottom: 2 }}>
                  {hoveredNode.name}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>
                  {hoveredNode.category}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Click to view protocol →</p>
              </div>
            </foreignObject>
          );
        })()}
      </svg>
    </div>
  );
}
