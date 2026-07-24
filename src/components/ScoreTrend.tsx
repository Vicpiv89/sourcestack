type Point = { overall: number; created_at: string };

type Props = {
  /** Ascending by date — oldest scan first, most recent last. */
  scans: Point[];
};

function scoreColor(s: number): string {
  if (s >= 8) return "#34d399";
  if (s >= 6.5) return "#a3e635";
  if (s >= 5) return "#fbbf24";
  return "#f87171";
}

const W = 400;
const H = 140;
const PAD_X = 10;
const PAD_TOP = 18;
const PAD_BOTTOM = 26;

export default function ScoreTrend({ scans }: Props) {
  if (scans.length < 2) return null;

  const scores = scans.map((s) => s.overall);
  const rawMin = Math.min(...scores);
  const rawMax = Math.max(...scores);
  const span = Math.max(rawMax - rawMin, 0.6); // avoid a flat line reading as "no chart"
  const min = Math.max(0, rawMin - span * 0.25);
  const max = Math.min(10, rawMax + span * 0.25);

  const points = scans.map((s, i) => {
    const x = PAD_X + (i / (scans.length - 1)) * (W - PAD_X * 2);
    const y = PAD_TOP + (1 - (s.overall - min) / (max - min)) * (H - PAD_TOP - PAD_BOTTOM);
    return { x, y, score: s.overall, date: s.created_at };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD_BOTTOM} L ${points[0].x.toFixed(1)} ${H - PAD_BOTTOM} Z`;

  const first = scans[0].overall;
  const last = scans[scans.length - 1].overall;
  const delta = last - first;
  const deltaColor = delta > 0.05 ? "#34d399" : delta < -0.05 ? "#f87171" : "#8a8f98";
  const deltaLabel = `${delta > 0 ? "+" : delta < 0 ? "−" : "±"}${Math.abs(delta).toFixed(1)}`;

  const fmt = (d: string) => new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric" });

  return (
    <div className="px-5 py-5 rounded-2xl border border-white/10 bg-white/[0.03] mb-4">
      <div className="flex items-baseline justify-between mb-1">
        <p className="text-white font-semibold text-sm">Your score over time</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold" style={{ color: scoreColor(last) }}>
            {last.toFixed(1)}
          </span>
          <span className="text-xs font-medium" style={{ color: deltaColor }}>
            {deltaLabel} since your first scan
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto mt-2" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#trendFill)" />
        <path d={linePath} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={i === points.length - 1 ? 4 : 2.5}
            fill={i === points.length - 1 ? scoreColor(p.score) : "#111"}
            stroke={i === points.length - 1 ? "#111" : "#34d399"}
            strokeWidth={i === points.length - 1 ? 2 : 1.5}
          />
        ))}
        <text x={points[0].x} y={H - 6} fontSize="10" fill="#8a8f98" textAnchor="start">
          {fmt(points[0].date)}
        </text>
        <text x={points[points.length - 1].x} y={H - 6} fontSize="10" fill="#8a8f98" textAnchor="end">
          {fmt(points[points.length - 1].date)}
        </text>
      </svg>

      <p className="text-white/25 text-[11px] mt-1 leading-relaxed">
        {scans.length} scans tracked. Small changes compound — that's the whole point of a plan you actually follow.
      </p>
    </div>
  );
}
