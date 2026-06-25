interface Props { onClose: () => void }

export default function EmailConfirmedModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full max-w-sm bg-[#181818] border border-white/10 rounded-2xl px-8 py-10 text-center shadow-2xl"
        style={{ animation: 'fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both' }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M6 14l6 6L22 8" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <p className="text-[10px] text-emerald-400/60 uppercase tracking-widest mb-3">Email confirmed</p>
        <h2 className="text-white text-xl font-bold mb-3 leading-tight">You're in.</h2>
        <p className="text-white/40 text-sm leading-relaxed mb-8">
          Your account is active. Build your protocol, stack your compounds, and get vetted sources — all in one place.
        </p>

        <button
          onClick={onClose}
          className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
        >
          Let's go →
        </button>
      </div>
    </div>
  );
}
