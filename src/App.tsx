import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Issues from "./pages/Issues";
import IssueDetail from "./pages/IssueDetail";
import Treatments from "./pages/Treatments";
import TreatmentDetail from "./pages/TreatmentDetail";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
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
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
