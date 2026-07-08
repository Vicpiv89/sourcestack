import { useNavigate } from "react-router-dom";

/**
 * Goes back to wherever the user actually came from (quiz results, scan,
 * stack builder…) instead of always jumping to the index page. Falls back
 * to the index when the page was opened directly (new tab, shared link).
 */
export default function BackLink({ fallback, fallbackLabel, className }: {
  fallback: string;
  fallbackLabel: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const hasHistory = (window.history.state?.idx ?? 0) > 0;
  return (
    <button
      onClick={() => (hasHistory ? navigate(-1) : navigate(fallback))}
      className={className ?? "text-white/30 text-sm hover:text-white/60 transition-colors mb-6 block"}
    >
      ← {hasHistory ? "Back" : fallbackLabel}
    </button>
  );
}
