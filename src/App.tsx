import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
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
              </Routes>
            </div>
            <Footer />
            <AuthCallbackHandler />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
