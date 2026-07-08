import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import EmailConfirmedModal from "./components/EmailConfirmedModal";
import Home from "./pages/Home";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Treatments from "./pages/Treatments";
import TreatmentDetail from "./pages/TreatmentDetail";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import StackBuilder from "./pages/StackBuilder";
import Compare from "./pages/Compare";
import Quiz from "./pages/Quiz";
import ProtocolAI from "./pages/ProtocolAI";
import FaceScan from "./pages/FaceScan";

// Handles Supabase email confirmation redirect (hash contains type=signup)
function AuthCallbackHandler() {
  const [showConfirmed, setShowConfirmed] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get('type') === 'signup') {
      // Clear the token from the URL bar
      window.history.replaceState(null, '', window.location.pathname);
      setShowConfirmed(true);
    }
  }, []);

  if (!showConfirmed) return null;
  return <EmailConfirmedModal onClose={() => setShowConfirmed(false)} />;
}

// After Stripe redirects back with ?subscribed=true, the webhook may land a
// few seconds later — poll the profile until isPro flips, then celebrate.
function SubscribedHandler() {
  const { isPro, refreshProfile } = useAuth();
  const [pending, setPending] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const attempts = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("subscribed") === "true") {
      window.history.replaceState(null, "", window.location.pathname);
      setPending(true);
    }
  }, []);

  useEffect(() => {
    if (!pending) return;
    if (isPro) {
      setPending(false);
      setCelebrate(true);
      return;
    }
    if (attempts.current >= 10) {
      setPending(false);
      return;
    }
    const t = setTimeout(() => {
      attempts.current += 1;
      refreshProfile();
    }, 2000);
    return () => clearTimeout(t);
  }, [pending, isPro, refreshProfile]);

  if (pending) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 bg-[#1a1a1a] border border-white/10 rounded-xl flex items-center gap-3 shadow-2xl">
        <div className="w-4 h-4 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-white/70 text-sm">Confirming your subscription…</p>
      </div>
    );
  }
  if (celebrate) {
    return (
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        onClick={() => setCelebrate(false)}
      >
        <div className="bg-[#1a1a1a] border border-emerald-500/25 rounded-2xl w-full max-w-sm p-8 text-center">
          <p className="text-3xl mb-3">🎉</p>
          <h2 className="text-xl font-bold text-white mb-2">You're Pro.</h2>
          <p className="text-white/45 text-sm mb-6 leading-relaxed">
            Full protocols, vendor directory, and interaction warnings are unlocked.
            Your plan is waiting.
          </p>
          <button
            onClick={() => setCelebrate(false)}
            className="w-full py-3 bg-white text-black text-sm font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            Let's go →
          </button>
        </div>
      </div>
    );
  }
  return null;
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-[#111] flex flex-col">
            <Nav />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/issues" element={<Issues />} />
                <Route path="/issues/:slug" element={<IssueDetail />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/treatments/:slug" element={<TreatmentDetail />} />
                <Route path="/disclaimer" element={<Disclaimer />} />
                <Route path="/about" element={<About />} />
                <Route path="/stack" element={<StackBuilder />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/ai" element={<ProtocolAI />} />
                <Route path="/scan" element={<FaceScan />} />
              </Routes>
            </div>
            <Footer />
            <AuthCallbackHandler />
            <SubscribedHandler />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
