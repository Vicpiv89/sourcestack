import { useEffect, useRef } from "react";

// Repeating "compound network" tile — small nodes + bonds, evoking the
// molecules/peptides/compounds this whole product is about. Tiles seamlessly
// enough at low opacity that the seams don't read.
const NETWORK_TILE = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='420' height='420' viewBox='0 0 420 420'>` +
    `<g fill='none' stroke='rgba(62,216,195,0.05)' stroke-width='1'>` +
      `<line x1='50' y1='70' x2='150' y2='35'/>` +
      `<line x1='150' y1='35' x2='260' y2='120'/>` +
      `<line x1='260' y1='120' x2='370' y2='55'/>` +
      `<line x1='100' y1='190' x2='220' y2='240'/>` +
      `<line x1='220' y1='240' x2='330' y2='210'/>` +
      `<line x1='35' y1='310' x2='170' y2='345'/>` +
      `<line x1='170' y1='345' x2='290' y2='345'/>` +
      `<line x1='290' y1='345' x2='385' y2='280'/>` +
      `<line x1='100' y1='190' x2='50' y2='70'/>` +
      `<line x1='260' y1='120' x2='330' y2='210'/>` +
    `</g>` +
    `<g fill='rgba(255,255,255,0.07)'>` +
      `<circle cx='50' cy='70' r='2'/><circle cx='150' cy='35' r='2'/>` +
      `<circle cx='370' cy='55' r='2'/><circle cx='100' cy='190' r='2'/>` +
      `<circle cx='330' cy='210' r='2'/><circle cx='35' cy='310' r='2'/>` +
      `<circle cx='170' cy='345' r='2'/><circle cx='385' cy='280' r='2'/>` +
    `</g>` +
    `<g fill='rgba(62,216,195,0.14)'>` +
      `<circle cx='260' cy='120' r='2.4'/><circle cx='220' cy='240' r='2.4'/>` +
      `<circle cx='290' cy='345' r='2.4'/>` +
    `</g>` +
  `</svg>`
)}")`;

/**
 * Fixed, viewport-pinned decorative layer behind all page content: a drifting
 * compound-network tile, a faint blueprint grid, and a soft ambient glow —
 * each shifting at a different fraction of scroll speed for a parallax depth
 * effect. Purely decorative (aria-hidden, pointer-events none); skips the
 * scroll listener entirely under prefers-reduced-motion.
 */
export default function ScrollBackground() {
  const networkRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (networkRef.current) {
          networkRef.current.style.backgroundPosition = `${y * -0.06}px ${y * -0.14}px`;
        }
        if (gridRef.current) {
          gridRef.current.style.backgroundPosition = `0px ${y * -0.05}px`;
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${y * 0.03}px, ${y * 0.22}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Ambient glow — the slowest-shifting, largest-displacement layer */}
      <div
        ref={glowRef}
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(62,216,195,0.06) 0%, rgba(62,216,195,0) 65%)",
          willChange: "transform",
        }}
      />
      {/* Blueprint grid */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      {/* Drifting compound network */}
      <div
        ref={networkRef}
        className="absolute inset-0"
        style={{ backgroundImage: NETWORK_TILE, backgroundSize: "420px 420px" }}
      />
    </div>
  );
}
