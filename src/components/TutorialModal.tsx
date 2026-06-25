import { useState } from 'react';
import { Link } from 'react-router-dom';

export const STORAGE_KEY = 'ss_tutorial_seen';

// ── Step visuals ──────────────────────────────────────────────────────────────

function WelcomeVisual() {
  const dots = [
    { x: 100, y: 60, r: 5, c: '#10b981' },
    { x: 145, y: 80, r: 4, c: '#60a5fa' },
    { x: 130, y: 120, r: 4, c: '#c084fc' },
    { x: 70,  y: 125, r: 3.5, c: '#f87171' },
    { x: 55,  y: 80,  r: 4, c: '#f59e0b' },
    { x: 75,  y: 45,  r: 3, c: '#94a3b8' },
    { x: 125, y: 42,  r: 3, c: '#34d399' },
  ];
  const lines = [
    [0,1],[0,2],[0,3],[0,4],[1,2],[2,3],[3,4],[4,5],[5,6],[6,1],
  ];
  return (
    <svg viewBox="0 0 200 165" className="w-full" style={{ maxWidth: 200 }}>
      <defs>
        <filter id="tut-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="tut-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.05)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <circle cx={100} cy={83} r={72} fill="url(#tut-center)" />
      {[55,72].map((r,i) => (
        <circle key={i} cx={100} cy={83} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
      ))}
      {lines.map(([a,b],i) => (
        <line key={i}
          x1={dots[a].x} y1={dots[a].y} x2={dots[b].x} y2={dots[b].y}
          stroke="rgba(255,255,255,0.07)" strokeWidth="0.7"
        />
      ))}
      {dots.map((d,i) => (
        <g key={i}>
          <circle cx={d.x} cy={d.y} r={d.r+5} fill={`${d.c}18`} />
          <circle cx={d.x} cy={d.y} r={d.r} fill={d.c} filter="url(#tut-glow)" opacity={0.85} />
        </g>
      ))}
      <text x={100} y={87} textAnchor="middle" style={{ fontSize: 10, fill: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.14em' }}>SOURCESTACK</text>
    </svg>
  );
}

function FindVisual() {
  return (
    <svg viewBox="0 0 200 165" className="w-full" style={{ maxWidth: 200 }}>
      <defs>
        <filter id="find-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Face outline */}
      <path
        d="M 100 22 C 114 24 124 31 131 43 C 140 55 144 72 144 88 C 144 104 140 120 131 133 L 100 152 L 69 133 C 60 120 56 104 56 88 C 56 72 60 55 69 43 C 76 31 86 24 100 22 Z"
        fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"
      />
      {/* Zone highlights */}
      <ellipse cx={100} cy={38} rx={28} ry={14} fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="0.6" />
      <ellipse cx={100} cy={62} rx={23} ry={13} fill="rgba(96,165,250,0.22)" stroke="rgba(96,165,250,0.6)" strokeWidth="0.9" filter="url(#find-glow)" />
      <ellipse cx={78}  cy={110} rx={14} ry={10} fill="rgba(251,146,60,0.08)" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6" />
      <ellipse cx={122} cy={110} rx={14} ry={10} fill="rgba(251,146,60,0.08)" stroke="rgba(251,146,60,0.18)" strokeWidth="0.6" />
      <ellipse cx={100} cy={138} rx={20} ry={10} fill="rgba(251,191,36,0.08)" stroke="rgba(251,191,36,0.18)" strokeWidth="0.6" />
      {/* Tooltip */}
      <line x1={122} y1={57} x2={148} y2={44} stroke="rgba(96,165,250,0.35)" strokeWidth="0.8" />
      <rect x={148} y={33} width={46} height={22} rx={5} fill="rgba(96,165,250,0.1)" stroke="rgba(96,165,250,0.35)" strokeWidth="0.7" />
      <text x={171} y={42} textAnchor="middle" style={{ fontSize: 7, fill: '#60a5fa', fontWeight: 700 }}>Forehead</text>
      <text x={171} y={51} textAnchor="middle" style={{ fontSize: 6, fill: 'rgba(96,165,250,0.6)' }}>3 treatments</text>
      {/* Tap icon */}
      <circle cx={100} cy={62} r={3} fill="#60a5fa" opacity={0.9} filter="url(#find-glow)" />
    </svg>
  );
}

function ProtocolVisual() {
  const steps = [
    { text: 'Apply 0.5ml to dry scalp', done: true },
    { text: 'Massage for 3–5 minutes', done: true },
    { text: 'Do not rinse — leave on', done: false },
  ];
  return (
    <svg viewBox="0 0 200 145" className="w-full" style={{ maxWidth: 220 }}>
      <rect x={15} y={8} width={170} height={130} rx={10} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      {/* Header */}
      <rect x={15} y={8} width={170} height={28} rx={10} fill="rgba(255,255,255,0.03)" />
      <rect x={15} y={28} width={170} height={8} fill="rgba(255,255,255,0.03)" />
      <text x={28} y={27} style={{ fontSize: 8.5, fill: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.06em' }}>PROTOCOL</text>
      <rect x={140} y={16} width={30} height={11} rx={4} fill="rgba(245,158,11,0.12)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.6" />
      <text x={155} y={23.5} textAnchor="middle" style={{ fontSize: 6.5, fill: '#f59e0b', fontWeight: 600 }}>6–12 wks</text>
      {steps.map((s, i) => (
        <g key={i}>
          <circle cx={31} cy={52 + i * 30} r={8}
            fill={s.done ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.04)'}
            stroke={s.done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}
            strokeWidth="0.7"
          />
          {s.done ? (
            <path d={`M ${27} ${52 + i*30} l 2.5 2.5 l 5 -5`} stroke="#10b981" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <text x={31} y={55.5 + i*30} textAnchor="middle" style={{ fontSize: 8, fill: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>{i + 1}</text>
          )}
          <text x={46} y={56 + i * 30} style={{ fontSize: 8.5, fill: s.done ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)' }}>{s.text}</text>
        </g>
      ))}
    </svg>
  );
}

function StackVisual() {
  const CX = 100, CY = 78, R = 52;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const hourToAngle = (h: number) => (h / 24) * 360 - 90;
  const amAngle = toRad(hourToAngle(7));
  const pmAngle = toRad(hourToAngle(21));
  const wkAngle = toRad(hourToAngle(10));
  const hourLabels = [{h:0,l:'12a'},{h:6,l:'6a'},{h:12,l:'12p'},{h:18,l:'6p'}];
  return (
    <svg viewBox="0 0 200 155" className="w-full" style={{ maxWidth: 200 }}>
      <defs>
        <filter id="stk-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
      <circle cx={CX} cy={CY} r={R * 0.68} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
      {/* Hour ticks */}
      {Array.from({length: 24}, (_, h) => {
        const a = toRad(hourToAngle(h));
        const major = h % 6 === 0;
        return (
          <line key={h}
            x1={CX + (R-1)*Math.cos(a)} y1={CY + (R-1)*Math.sin(a)}
            x2={CX + (R - (major ? 7 : 4))*Math.cos(a)} y2={CY + (R - (major ? 7 : 4))*Math.sin(a)}
            stroke={major ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'} strokeWidth={major ? 1 : 0.5}
          />
        );
      })}
      {/* Hour labels */}
      {hourLabels.map(({h,l}) => {
        const a = toRad(hourToAngle(h));
        return (
          <text key={h} x={CX+(R+12)*Math.cos(a)} y={CY+(R+12)*Math.sin(a)} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 7.5, fill: 'rgba(255,255,255,0.2)' }}>{l}</text>
        );
      })}
      {/* AM dot */}
      <line x1={CX+R*Math.cos(amAngle)} y1={CY+R*Math.sin(amAngle)} x2={CX+R*0.82*Math.cos(amAngle)} y2={CY+R*0.82*Math.sin(amAngle)} stroke="rgba(245,158,11,0.3)" strokeWidth="0.6" />
      <circle cx={CX+R*0.82*Math.cos(amAngle)} cy={CY+R*0.82*Math.sin(amAngle)} r={8} fill="rgba(245,158,11,0.14)" />
      <circle cx={CX+R*0.82*Math.cos(amAngle)} cy={CY+R*0.82*Math.sin(amAngle)} r={4.5} fill="#f59e0b" filter="url(#stk-glow)" />
      <text x={CX+R*0.82*Math.cos(amAngle)+13} y={CY+R*0.82*Math.sin(amAngle)+4} style={{ fontSize: 7.5, fill: '#f59e0b', fontWeight: 700 }}>AM</text>
      {/* PM dot */}
      <line x1={CX+R*Math.cos(pmAngle)} y1={CY+R*Math.sin(pmAngle)} x2={CX+R*0.82*Math.cos(pmAngle)} y2={CY+R*0.82*Math.sin(pmAngle)} stroke="rgba(96,165,250,0.3)" strokeWidth="0.6" />
      <circle cx={CX+R*0.82*Math.cos(pmAngle)} cy={CY+R*0.82*Math.sin(pmAngle)} r={8} fill="rgba(96,165,250,0.14)" />
      <circle cx={CX+R*0.82*Math.cos(pmAngle)} cy={CY+R*0.82*Math.sin(pmAngle)} r={4.5} fill="#60a5fa" filter="url(#stk-glow)" />
      <text x={CX+R*0.82*Math.cos(pmAngle)-20} y={CY+R*0.82*Math.sin(pmAngle)+4} style={{ fontSize: 7.5, fill: '#60a5fa', fontWeight: 700 }}>PM</text>
      {/* Weekly dot */}
      <circle cx={CX+R*0.82*Math.cos(wkAngle)} cy={CY+R*0.82*Math.sin(wkAngle)} r={4} fill="#10b981" filter="url(#stk-glow)" opacity={0.8} />
      {/* Center */}
      <text x={CX} y={CY-7} textAnchor="middle" style={{ fontSize: 18, fontWeight: 800, fill: 'rgba(255,255,255,0.75)' }}>4</text>
      <text x={CX} y={CY+9} textAnchor="middle" style={{ fontSize: 6.5, fill: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>COMPOUNDS</text>
      {/* Warning badge */}
      <rect x={142} y={108} width={44} height={17} rx={5} fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.3)" strokeWidth="0.7" />
      <text x={164} y={119} textAnchor="middle" style={{ fontSize: 7, fill: '#f59e0b', fontWeight: 600 }}>! Interaction</text>
    </svg>
  );
}

function VendorVisual() {
  return (
    <svg viewBox="0 0 200 145" className="w-full" style={{ maxWidth: 220 }}>
      <defs>
        <filter id="ven-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Card */}
      <rect x={15} y={10} width={170} height={125} rx={10} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <rect x={15} y={10} width={170} height={28} rx={10} fill="rgba(255,255,255,0.03)" />
      <rect x={15} y={28} width={170} height={10} fill="rgba(255,255,255,0.03)" />
      <text x={28} y={28} style={{ fontSize: 10, fill: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>Peptide Sciences</text>
      {/* Trust score */}
      <rect x={138} y={16} width={34} height={13} rx={5} fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.35)" strokeWidth="0.7" />
      <text x={155} y={24.5} textAnchor="middle" style={{ fontSize: 7, fill: '#10b981', fontWeight: 700 }}>9.4 / 10</text>
      {/* Badges */}
      {['COA ✓','3rd Party','GMP'].map((badge, i) => (
        <g key={i}>
          <rect x={28 + i*48} y={46} width={40} height={13} rx={4} fill="rgba(96,165,250,0.08)" stroke="rgba(96,165,250,0.25)" strokeWidth="0.6" />
          <text x={48 + i*48} y={54.5} textAnchor="middle" style={{ fontSize: 6.5, fill: '#60a5fa', fontWeight: 600 }}>{badge}</text>
        </g>
      ))}
      {/* Price */}
      <text x={28} y={78} style={{ fontSize: 8.5, fill: 'rgba(255,255,255,0.35)' }}>Monthly estimate</text>
      <text x={28} y={94} style={{ fontSize: 14, fill: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>~$34</text>
      <text x={60} y={94} style={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)', fontWeight: 400 }}>/mo</text>
      {/* CTA */}
      <rect x={28} y={108} width={76} height={17} rx={5} fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.7" />
      <text x={66} y={118.5} textAnchor="middle" style={{ fontSize: 7.5, fill: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>View source →</text>
      {/* Lock overlay for non-pro hint */}
      <rect x={110} y={108} width={62} height={17} rx={5} fill="rgba(245,158,11,0.08)" stroke="rgba(245,158,11,0.25)" strokeWidth="0.7" />
      <text x={141} y={118.5} textAnchor="middle" style={{ fontSize: 7, fill: '#f59e0b', fontWeight: 600 }}>🔒 Pro only</text>
    </svg>
  );
}

// ── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    label: 'Welcome',
    title: 'Your looksmaxxing OS.',
    body: 'SourceStack is a research-backed protocol hub. No courses, no influencers — just vetted compounds, exact step-by-step protocols, and clean sources.',
    visual: <WelcomeVisual />,
    cta: null as { label: string; to: string } | null,
  },
  {
    label: 'Find it',
    title: 'Start with your concern.',
    body: 'Search by symptom, or tap any zone on the face map — scalp, brows, skin, jaw — and instantly surface every treatment that addresses it.',
    visual: <FindVisual />,
    cta: { label: 'Browse Issues', to: '/issues' },
  },
  {
    label: 'Protocol',
    title: 'Get the exact protocol.',
    body: "Each treatment page gives you the full step-by-step protocol, safety notes, a realistic timeline, and an animation showing what to expect.",
    visual: <ProtocolVisual />,
    cta: { label: 'Browse Treatments', to: '/treatments' },
  },
  {
    label: 'Stack',
    title: 'Build your daily routine.',
    body: 'Add multiple compounds to the Stack Builder. It generates a visual AM/PM schedule and flags any interactions between them.',
    visual: <StackVisual />,
    cta: { label: 'Stack Builder', to: '/stack' },
  },
  {
    label: 'Source',
    title: 'Source it clean.',
    body: 'Go Pro to unlock vetted vendor links — trust scores, COA requirements, and the lowest legit prices. No more sketchy Reddit sourcing.',
    visual: <VendorVisual />,
    cta: null,
  },
];

// ── Modal ─────────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
  onComplete?: () => void; // called when the last step is finished (not skipped)
  // When false: backdrop doesn't close it, Skip is labelled "Skip for now"
  // This is the default for guest users so the modal keeps reappearing until they sign up
  dismissible?: boolean;
}

export default function TutorialModal({ onClose, onComplete, dismissible = false }: Props) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const dismiss = () => {
    // Don't write localStorage — non-logged-in users see this every visit
    onClose();
  };

  const advance = () => {
    if (isLast) {
      onClose();
      onComplete?.();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 pb-3 sm:px-4 sm:pb-0">
      {/* Backdrop — only clickable when dismissible (logged-in users reopening manually) */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={dismissible ? dismiss : undefined}
      />

      <div className="relative w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="h-[2px] bg-white/[0.05]">
          <div
            className="h-full bg-white/25 transition-all duration-500 ease-out"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Close — only shown when dismissible */}
        {dismissible && (
          <button
            onClick={dismiss}
            className="absolute top-3.5 right-4 text-white/20 hover:text-white/50 transition-colors text-sm z-10"
          >
            ✕
          </button>
        )}

        {/* Content — keyed so it animates on step change */}
        <div key={step} className="px-6 pt-5 pb-6" style={{ animation: 'fadeUp 0.3s ease both' }}>
          {/* Visual */}
          <div className="flex justify-center mb-4">
            {current.visual}
          </div>

          {/* Step label */}
          <p className="text-[9px] text-white/25 uppercase tracking-widest mb-2">
            {step + 1} of {STEPS.length} · {current.label}
          </p>

          {/* Title */}
          <h2 className="text-white text-[1.15rem] font-bold mb-2.5 leading-tight">
            {current.title}
          </h2>

          {/* Body */}
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            {current.body}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={dismiss}
              className="text-xs text-white/20 hover:text-white/40 transition-colors"
            >
              {dismissible ? 'Skip' : 'Skip for now'}
            </button>
            <div className="flex items-center gap-2">
              {current.cta && (
                <Link
                  to={current.cta.to}
                  onClick={dismiss}
                  className="px-3 py-1.5 text-xs border border-white/[0.12] rounded-lg text-white/45 hover:text-white hover:border-white/25 transition-colors"
                >
                  {current.cta.label}
                </Link>
              )}
              <button
                onClick={advance}
                className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors"
              >
                {isLast ? 'Get started' : 'Next →'}
              </button>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-1.5 mt-5">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? 18 : 5,
                  height: 5,
                  background: i === step ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.12)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

