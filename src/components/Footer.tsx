import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 px-6 py-8 mt-auto">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} SourceStack. For informational purposes
            only.
          </p>
          <p className="text-white/15 text-xs mt-1">
            Not medical advice. Research compounds are not approved for human
            use.
          </p>
        </div>
        <div className="flex gap-4 text-xs text-white/25">
          <Link to="/terms" className="hover:text-white/50 transition-colors">
            Terms
          </Link>
          <Link to="/privacy" className="hover:text-white/50 transition-colors">
            Privacy
          </Link>
          <Link to="/disclaimer" className="hover:text-white/50 transition-colors">
            Disclaimer
          </Link>
          <a
            href="mailto:hello@sourcestack.app"
            className="hover:text-white/50 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
