type Props = {
  steps: string[];
  /** 1-based display number for the first locked step. */
  startIndex: number;
  onUnlock: () => void;
};

export default function LockedProtocol({ steps, startIndex, onUnlock }: Props) {
  if (steps.length === 0) return null;

  return (
    <div className="mt-4 relative">
      <div className="blur-sm pointer-events-none select-none">
        <ol className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="text-white/20 font-mono text-sm shrink-0 w-5 text-right mt-0.5">
                {startIndex + i}
              </span>
              <span className="text-white/70 text-sm leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-[#111]/88 to-transparent flex flex-col items-center justify-end pb-2">
        <button
          onClick={onUnlock}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-semibold rounded-lg hover:bg-white/90 transition-colors"
        >
          🔒 Unlock full protocol — $19/mo
        </button>
      </div>
    </div>
  );
}
