import { useState } from "react";
import { useAuth } from "../context/AuthContext";

type Props = {
  onClose: () => void;
  initialTab?: "signin" | "signup";
};

export default function AuthModal({ onClose, initialTab = "signin" }: Props) {
  const [tab, setTab] = useState<"signin" | "signup">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (tab === "signin") {
      const { error } = await signIn(email, password);
      if (error) setError(error);
      else onClose();
    } else {
      const { error } = await signUp(email, password);
      if (error) setError(error);
      else setSuccess("Check your email to confirm your account.");
    }
    setLoading(false);
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-sm p-8">
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
              Sign up
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors text-sm"
          >
            ✕
          </button>
        </div>

        {success ? (
          <p className="text-emerald-400 text-sm text-center py-4">{success}</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              {loading ? "..." : tab === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
