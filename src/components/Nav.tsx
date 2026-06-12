import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import UpgradeModal from "./UpgradeModal";

export default function Nav() {
  const { pathname } = useLocation();
  const { user, isPro, signOut } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/issues", label: "Browse Issues" },
    { to: "/treatments", label: "Treatments" },
    { to: "/about", label: "About" },
  ];

  return (
    <>
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-lg font-semibold tracking-tight text-white">
            SourceStack
          </span>
          <span className="text-xs text-white/30 uppercase tracking-widest hidden sm:block">
            Protocol Hub
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1 mr-2">
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                  pathname === to
                    ? "text-white bg-white/10"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {user ? (
            <div className="flex items-center gap-2">
              {!isPro && (
                <button
                  onClick={() => setShowUpgrade(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-black hover:bg-white/90 transition-colors"
                >
                  Upgrade
                </button>
              )}
              {isPro && (
                <span className="px-2 py-1 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Pro
                </span>
              )}
              <button
                onClick={() => signOut()}
                className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20"
            >
              Sign in
            </button>
          )}
        </div>
      </header>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
