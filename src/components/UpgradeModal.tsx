import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import AuthModal from "./AuthModal";

type Props = {
  onClose: () => void;
};

const FEATURES = [
  "Full protocols — dosing references, timing, cycling",
  "Community-vetted vendor directory — prices, trust notes, direct links",
  "Face scan history — save scans, track progress over time",
  "Interaction warnings before you combine compounds",
  "Monthly cost breakdown for your full stack",
  "New compounds added as the community validates them",
];

export default function UpgradeModal({ onClose }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  async function handleSubscribe() {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    setError("");
    try {
      // identity is derived server-side from the auth token
      const { data, error: fnError } = await supabase.functions.invoke(
        "create-checkout-session",
        { body: {} }
      );
      if (fnError) throw new Error(fnError.message);
      if (!data?.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-md p-8">
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
            {loading ? "Redirecting to Stripe..." : user ? "Get full access" : "Create account to subscribe"}
          </button>
          {error && <p className="text-red-400 text-xs text-center">{error}</p>}
          {user && !error && (
            <p className="text-white/25 text-xs text-center">
              Renews monthly until canceled — cancel anytime from your account.{" "}
              <a href="/terms" className="text-white/40 hover:text-white/70 underline">Terms</a>
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
