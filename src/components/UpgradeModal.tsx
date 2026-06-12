import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";

type Props = {
  onClose: () => void;
};

const FEATURES = [
  "Full protocols — exact dosages, timing, cycling",
  "Vetted vendor directory — prices, trust scores, direct links",
  "9 vetted vendors across 55+ treatments",
  "Stack tracker — log what you're running",
  "Cheapest source finder for your stack",
  "New compounds added as the community validates them",
];

export default function UpgradeModal({ onClose }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  async function handleSubscribe() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        { body: { userId: user.id, email: user.email } }
      );
      if (error) throw error;
      window.location.href = data.url;
    } catch {
      setLoading(false);
    }
  }

  if (showAuth) {
    return (
      <AuthModal
        onClose={() => setShowAuth(false)}
        initialTab="signup"
      />
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-md p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors text-sm"
        >
          ✕
        </button>

        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-white/30 mb-2">
            SourceStack Pro
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">
            Stop guessing. Start sourcing.
          </h2>
          <p className="text-white/40 text-sm">
            You're already spending $100-200/month on compounds. One bad vendor
            or wrong protocol wastes all of it.
          </p>
        </div>

        <ul className="flex flex-col gap-3 mb-8">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-white/70">
              <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
              {f}
            </li>
          ))}
        </ul>

        <div className="border-t border-white/10 pt-6">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-white">$19</span>
            <span className="text-white/30 text-sm">/ month</span>
          </div>
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3.5 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50 mb-3"
          >
            {loading ? "Redirecting..." : user ? "Get full access" : "Create account to subscribe"}
          </button>
          {user && (
            <p className="text-white/25 text-xs text-center">
              Cancel anytime. No hidden fees.
            </p>
          )}
          {!user && (
            <p className="text-white/25 text-xs text-center">
              Already have an account?{" "}
              <button
                onClick={() => setShowAuth(true)}
                className="text-white/50 hover:text-white transition-colors"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
