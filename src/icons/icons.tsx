import type { IconName } from "@/types";

export interface IconProps {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

/**
 * Single custom icon set for the whole application. Kept dependency-free
 * (no icon-library install) and drawn to fit the tactical / cyber-noir
 * line language: 1.6px strokes, sharp joins, no decorative fill.
 */
export function Icon({ name, size = 20, strokeWidth = 1.6, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true
  };

  switch (name) {
    case "bat":
      return (
        <svg {...common} viewBox="0 0 64 64" fill="currentColor" stroke="none">
          <path d="M32 14c-1.6 2.4-2.5 4-5.4 5.2-4-3.4-9-4.6-14.2-4.6 2.4 3 3.4 6 3.6 9.6-4.6 1.8-8.8 4.8-11.6 9.4 4.4-1.4 8-1.8 11.8-1.2-1.4 2.2-2 4-2 6.6 3.4-2.8 6.6-4.4 10.4-5 1.6 3.6 4 6.2 7.4 8-.4-3.6.2-6.4 1.4-9.4.4-1 .8-1 1.2 0 1.2 3 1.8 5.8 1.4 9.4 3.4-1.8 5.8-4.4 7.4-8 3.8.6 7 2.2 10.4 5 0-2.6-.6-4.4-2-6.6 3.8-.6 7.4-.2 11.8 1.2-2.8-4.6-7-7.6-11.6-9.4.2-3.6 1.2-6.6 3.6-9.6-5.2 0-10.2 1.2-14.2 4.6-2.9-1.2-3.8-2.8-5.4-5.2z" />
        </svg>
      );
    case "menu":
      return (
        <svg {...common}>
          <line x1="4" y1="7" x2="20" y2="7" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="17" x2="14" y2="17" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <line x1="4" y1="12" x2="19" y2="12" />
          <polyline points="13 6 19 12 13 18" />
        </svg>
      );
    case "arrowUp":
      return (
        <svg {...common}>
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="6 11 12 5 18 11" />
        </svg>
      );
    case "external":
      return (
        <svg {...common}>
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="8" y1="11" x2="8" y2="16" />
          <line x1="8" y1="8" x2="8" y2="8" />
          <path d="M12 16v-3.2a1.8 1.8 0 0 1 3.6 0V16" />
        </svg>
      );
    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M3.5 6.5L12 13l8.5-6.5" />
        </svg>
      );
    case "play":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M8 5.5v13l11-6.5-11-6.5z" />
        </svg>
      );
    case "pause":
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <rect x="7" y="5" width="4" height="14" />
          <rect x="14" y="5" width="4" height="14" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
          <path d="M9.2 12l2 2 3.6-4" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...common}>
          <rect x="7" y="7" width="10" height="10" rx="1" />
          <rect x="10" y="2.5" width="1.6" height="3" />
          <rect x="13.4" y="2.5" width="1.6" height="3" />
          <rect x="10" y="18.5" width="1.6" height="3" />
          <rect x="13.4" y="18.5" width="1.6" height="3" />
          <rect x="2.5" y="10" width="3" height="1.6" />
          <rect x="2.5" y="13.4" width="3" height="1.6" />
          <rect x="18.5" y="10" width="3" height="1.6" />
          <rect x="18.5" y="13.4" width="3" height="1.6" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <polyline points="7 9 10.5 12 7 15" />
          <line x1="12.5" y1="15" x2="17" y2="15" />
        </svg>
      );
    case "robot":
      return (
        <svg {...common}>
          <rect x="5" y="9" width="14" height="10" rx="2" />
          <circle cx="9.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
          <line x1="12" y1="9" x2="12" y2="5" />
          <circle cx="12" cy="3.5" r="1.5" />
          <line x1="2" y1="13" x2="5" y2="13" />
          <line x1="19" y1="13" x2="22" y2="13" />
        </svg>
      );
    case "chevronDown":
      return (
        <svg {...common}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg {...common}>
          <polyline points="9 6 15 12 9 18" />
        </svg>
      );
    case "signal":
      return (
        <svg {...common}>
          <line x1="4" y1="20" x2="4" y2="14" />
          <line x1="10" y1="20" x2="10" y2="9" />
          <line x1="16" y1="20" x2="16" y2="5" />
          <line x1="22" y1="20" x2="22" y2="12" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <polyline points="5 12.5 10 17 19 7" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
          <line x1="9.5" y1="12" x2="14.5" y2="12" />
          <line x1="9.5" y1="15.5" x2="14.5" y2="15.5" />
        </svg>
      );
    default:
      return null;
  }
}
