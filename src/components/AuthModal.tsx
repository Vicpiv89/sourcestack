import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

type Props = {
  onClose: () => void;
  initialTab?: "signin" | "signup";
};

export default function AuthModal({ onClose, initialTab = "signin" }: Props) {
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const { signIn, signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (tab === "signin") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else onClose();
      setLoading(false);
      return;
    }

    // Paid-only signup: account creation flows straight into Stripe checkout.
    const { error } = await signUp(email, password);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }
    setRedirecting(true);
    // the session was created milliseconds ago — attach the token explicitly
    // rather than racing the auth client's internal header propagation
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const { data, error: fnError } = await supabase.functions.invoke(
      "create-checkout-session",
      { body: {}, headers: token ? { Authorization: `Bearer ${token}` } : undefined }
    );
    if (fnError || !data?.url) {
      setRedirecting(false);
      setLoading(false);
      setError("Account created, but checkout didn't open. Hit Upgrade to finish subscribing.");
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl w-full max-w-sm p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            <button
              onClick={() => setTab("signin")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "signin" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setTab("signup")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                tab === "signup" ? "bg-white text-black" : "text-white/40 hover:text-white/70"
              }`}
            >
              Join Pro
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {redirecting ? (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <p className="text-white/60 text-sm">Opening secure checkout…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === "signup" && (
              <p className="text-white/40 text-xs leading-relaxed -mt-1">
                SourceStack is a paid membership — <span className="text-white/70 font-medium">$19/month</span>.
                Create your account and you'll go straight to secure checkout.
              </p>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/30 transition-colors"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-semibold py-3 rounded-xl text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {loading ? "..." : tab === "signin" ? "Sign in" : "Continue to checkout →"}
            </button>
            {tab === "signup" && (
              <p className="text-white/25 text-[11px] leading-relaxed text-center">
                Renews monthly until canceled — cancel anytime from your account.
                By subscribing you agree to the{" "}
                <a href="/terms" className="text-white/40 hover:text-white/70 underline">Terms</a>.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
