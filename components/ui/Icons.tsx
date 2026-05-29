const SVG_PROPS = {
  xmlns: 'http://www.w3.org/2000/svg',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24">
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export function IconCheck({ size = 16 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24" strokeWidth="2.5">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function IconAlertTriangle({ size = 16 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 9v4M12 17h.01" />
      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 001.636 2.871h16.214a1.914 1.914 0 001.636-2.87l-8.106-13.536a1.914 1.914 0 00-3.274 0z" />
    </svg>
  );
}

export function IconChevronDown({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconInfoCircle({ size = 14 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8h.01M11 12h1v4h1" />
    </svg>
  );
}

export function IconLock({ size = 12 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24" strokeWidth="1.5">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

export function IconExternalLink({ size = 10 }: { size?: number }) {
  return (
    <svg {...SVG_PROPS} width={size} height={size} viewBox="0 0 24 24">
      <path d="M12 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-6" />
      <path d="M11 13l9-9M15 4h5v5" />
    </svg>
  );
}
