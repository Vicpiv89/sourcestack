import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import UpgradeModal from "./UpgradeModal";

const NAV_LINKS = [
  { to: "/",           label: "Home" },
  { to: "/issues",     label: "Issues" },
  { to: "/treatments", label: "Treatments" },
  { to: "/stack",      label: "Stack Builder" },
  { to: "/about",      label: "About" },
];

export default function Nav() {
  const { pathname } = useLocation();
  const { user, isPro, signOut } = useAuth();
  const [showAuth, setShowAuth]       = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-40 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5" onClick={closeMenu}>
          <span className="text-base font-semibold tracking-tight text-white">SourceStack</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest hidden sm:block">Protocol Hub</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1 mr-2">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                pathname === to ? "text-white bg-white/10" : "text-white/40 hover:text-white/70"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
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
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="px-3 py-1.5 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20"
            >
              Sign in
            </button>
          )}
        </div>

        {/* Mobile right: auth + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {user && !isPro && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white text-black"
            >
              Upgrade
            </button>
          )}
          {user && isPro && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Pro
            </span>
          )}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] text-white/50 hover:text-white/80 transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-px bg-current transition-all duration-200"
              style={menuOpen ? { transform: 'translateY(6px) rotate(45deg)' } : {}}
            />
            <span
              className="block w-5 h-px bg-current transition-all duration-200"
              style={menuOpen ? { opacity: 0 } : {}}
            />
            <span
              className="block w-5 h-px bg-current transition-all duration-200"
              style={menuOpen ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}}
            />
          </button>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/98 border-b border-white/10 px-5 py-4 flex flex-col gap-1 z-50 backdrop-blur-sm">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`px-3 py-3 rounded-xl text-sm transition-colors ${
                  pathname === to
                    ? "text-white bg-white/8 font-medium"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="mt-2 pt-3 border-t border-white/[0.06] flex flex-col gap-2">
              {user ? (
                <button
                  onClick={() => { signOut(); closeMenu(); }}
                  className="px-3 py-2 text-left text-sm text-white/40 hover:text-white/70 transition-colors"
                >
                  Sign out
                </button>
              ) : (
                <button
                  onClick={() => { setShowAuth(true); closeMenu(); }}
                  className="px-3 py-2.5 border border-white/10 rounded-xl text-sm text-white/50 hover:text-white hover:border-white/25 transition-colors text-center"
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {showAuth    && <AuthModal    onClose={() => setShowAuth(false)} />}
      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
