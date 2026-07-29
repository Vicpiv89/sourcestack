// Small monoline icon set — matches the line-art visual language used in the
// face diagrams elsewhere in the app. Replaces emoji used as UI icons.

interface IconProps {
  size?: number;
  className?: string;
}

const base = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function CameraIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.4" />
    </svg>
  );
}

export function HairIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M6 20c-.6-4 .4-7 2-9" />
      <path d="M12 20.5c-.9-5 .2-9 1-11" />
      <path d="M18 20c.6-4-.2-7-1.6-9.5" />
      <path d="M4.5 8.5C6 5 8.8 3.2 12 3.2S18 5 19.5 8.5" />
    </svg>
  );
}

export function SparkleIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 3.5c.5 3.4 1.4 5.2 3.2 6.8 1.8 1.8 3.6 2.7 6.8 3.2-3.2.5-5 1.4-6.8 3.2-1.8 1.6-2.7 3.4-3.2 6.8-.5-3.4-1.4-5.2-3.2-6.8-1.8-1.8-3.6-2.7-6.8-3.2 3.2-.5 5-1.4 6.8-3.2 1.8-1.6 2.7-3.4 3.2-6.8Z" strokeLinejoin="round" />
    </svg>
  );
}

export function DnaIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M7 3c0 5 10 5 10 9s-10 4-10 9" />
      <path d="M17 3c0 5-10 5-10 9s10 4 10 9" />
      <path d="M8 7.5h8M7.3 12h9.4M8 16.5h8" />
    </svg>
  );
}

export function PillIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <rect x="3.5" y="9.5" width="17" height="7" rx="3.5" transform="rotate(-32 12 13)" />
      <path d="M10.6 10.2 13.8 15" />
    </svg>
  );
}

export function MicroscopeIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M9.5 3.5 14 8" />
      <path d="M11.7 5.3 8 9c-1 1 -1 2.6 0 3.6s2.6 1 3.6 0l1-1" />
      <path d="M8.5 12.5 5 16" />
      <path d="M4 20h13" />
      <path d="M13 20c2-1.4 3.3-3.2 3.3-5.4 0-1-.3-1.9-.8-2.6" />
    </svg>
  );
}

export function GearIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2.4M12 18.1v2.4M20.5 12h-2.4M5.9 12H3.5M17.7 6.3l-1.7 1.7M8 16l-1.7 1.7M17.7 17.7 16 16M8 8 6.3 6.3" />
    </svg>
  );
}

export function TrendUpIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M4 16.5 9.5 11l4 4L20 6.5" />
      <path d="M14.5 6.5H20v5.5" />
    </svg>
  );
}

export function LockIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <rect x="5" y="11" width="14" height="9" rx="2.2" />
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" />
    </svg>
  );
}

export function AiSparkIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...base}>
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
      <path d="M6.5 6.5l2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
    </svg>
  );
}
