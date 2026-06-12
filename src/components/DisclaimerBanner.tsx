import { Link } from "react-router-dom";

export default function DisclaimerBanner() {
  return (
    <div className="mx-6 mb-8 px-4 py-3 bg-amber-500/5 border border-amber-500/15 rounded-xl flex items-start gap-3">
      <span className="text-amber-500/50 text-sm shrink-0 mt-0.5">!</span>
      <p className="text-amber-400/60 text-xs leading-relaxed">
        For informational purposes only. Nothing on this site is medical advice.
        Research compounds are not approved for human use. Always consult a
        healthcare professional before starting any protocol.{" "}
        <Link
          to="/disclaimer"
          className="text-amber-400/80 hover:text-amber-400 underline transition-colors"
        >
          Full disclaimer →
        </Link>
      </p>
    </div>
  );
}
