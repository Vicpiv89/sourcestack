import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import AuthModal from "../components/AuthModal";
import UpgradeModal from "../components/UpgradeModal";
import ScoreTrend from "../components/ScoreTrend";
import SEO from "../components/SEO";

type SavedScan = {
  id: string;
  overall: number;
  tier: string;
  metrics: { id: string; name: string; display: string; ideal: string; score: number }[];
  goals: string[];
  created_at: string;
};

function scoreColor(s: number): string {
  if (s >= 8) return "#34d399";
  if (s >= 6.5) return "#a3e635";
  if (s >= 5) return "#fbbf24";
  return "#f87171";
}

export default function Account() {
  const { user, isPro, loading, signOut } = useAuth();
  const [scans, setScans] = useState<SavedScan[]>([]);
  const [scansLoading, setScansLoading] = useState(true);
  const [openScan, setOpenScan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("scans")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setScans((data as SavedScan[]) ?? []);
        setScansLoading(false);
      });
  }, [user]);

  async function openPortal() {
    setPortalLoading(true);
    setPortalError("");
    const { data, error } = await supabase.functions.invoke("create-portal-session", { body: {} });
    if (error || !data?.url) {
      setPortalError("Couldn't open the billing portal — try again in a minute.");
      setPortalLoading(false);
      return;
    }
    window.location.href = data.url;
  }

  async function deleteScan(id: string) {
    await supabase.from("scans").delete().eq("id", id);
    setScans((prev) => prev.filter((s) => s.id !== id));
  }

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-[#111] text-[#e5e5e5] flex items-center justify-center px-6">
        <SEO title="Account" path="/account" />
        <div className="text-center">
          <p className="text-white font-semibold mb-2">You're not signed in.</p>
          <button
            onClick={() => setShowAuth(true)}
            className="mt-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            Sign in
          </button>
        </div>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-[#e5e5e5]">
      <SEO title="Account" path="/account" />
      <div className="px-6 pt-12 pb-24 max-w-2xl mx-auto">
        <p className="text-white/30 text-xs uppercase tracking-widest mb-2">Account</p>
        <h1 className="text-2xl font-bold text-white mb-8 truncate">{user?.email}</h1>

        {/* Subscription */}
        <div className="px-5 py-5 rounded-2xl border border-white/10 bg-white/[0.03] mb-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-white text-sm font-semibold mb-1">Subscription</p>
              {isPro ? (
                <p className="text-emerald-400 text-xs">Pro — active · $19/month</p>
              ) : (
                <p className="text-white/35 text-xs">No active subscription</p>
              )}
            </div>
            {isPro ? (
              <button
                onClick={openPortal}
                disabled={portalLoading}
                className="px-4 py-2.5 border border-white/15 text-white/70 text-xs rounded-xl hover:border-white/35 hover:text-white transition-colors disabled:opacity-50"
              >
                {portalLoading ? "Opening…" : "Manage / cancel subscription"}
              </button>
            ) : (
              <button
                onClick={() => setShowUpgrade(true)}
                className="px-4 py-2.5 bg-white text-black text-xs font-semibold rounded-xl hover:bg-white/90 transition-colors"
              >
                Upgrade to Pro
              </button>
            )}
          </div>
          {portalError && <p className="text-red-400/80 text-xs mt-3">{portalError}</p>}
          {isPro && (
            <p className="text-white/25 text-[11px] mt-3 leading-relaxed">
              Billing, invoices, payment method, and cancellation are handled securely by Stripe.
            </p>
          )}
        </div>

        {/* Saved scans */}
        <div className="mb-8">
          {!scansLoading && <ScoreTrend scans={[...scans].reverse()} />}

          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-white font-semibold text-sm">Saved scans</h2>
            <Link to="/scan" className="text-white/35 hover:text-white/70 text-xs transition-colors">
              New scan →
            </Link>
          </div>

          {scansLoading ? (
            <p className="text-white/25 text-xs">Loading…</p>
          ) : scans.length === 0 ? (
            <div className="px-5 py-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center">
              <p className="text-white/40 text-sm mb-1">No saved scans yet.</p>
              <p className="text-white/25 text-xs">
                Run a scan and hit “Save scan” to track your progress over time.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {scans.map((s) => (
                <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                  <button
                    onClick={() => setOpenScan(openScan === s.id ? null : s.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold" style={{ color: scoreColor(s.overall) }}>
                        {Number(s.overall).toFixed(1)}
                      </span>
                      <div>
                        <p className="text-white text-sm">{s.tier}</p>
                        <p className="text-white/30 text-xs mt-0.5">
                          {new Date(s.created_at).toLocaleDateString(undefined, {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                          {s.goals?.length ? ` · ${s.goals.length} goal${s.goals.length > 1 ? "s" : ""}` : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-white/25 text-xs">{openScan === s.id ? "▲" : "▼"}</span>
                  </button>
                  {openScan === s.id && (
                    <div className="px-4 pb-4 border-t border-white/[0.06]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 mb-3">
                        {s.metrics.map((m) => (
                          <div key={m.id} className="px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07]">
                            <p className="text-[9px] text-white/30 uppercase tracking-wider mb-1">{m.name}</p>
                            <div className="flex items-baseline justify-between">
                              <span className="text-white text-sm font-semibold">{m.display}</span>
                              <span className="text-[11px] font-medium" style={{ color: scoreColor(m.score) }}>
                                {Number(m.score).toFixed(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => deleteScan(s.id)}
                        className="text-white/25 hover:text-red-400/80 text-xs transition-colors"
                      >
                        Delete this scan
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-white/20 text-[11px] mt-3 leading-relaxed">
            Scans store your measurements only — your photos are never uploaded or saved.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="px-4 py-2.5 border border-white/10 text-white/40 text-xs rounded-xl hover:border-white/25 hover:text-white/70 transition-colors"
        >
          Sign out
        </button>
      </div>
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
