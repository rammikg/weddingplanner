// The ring + gem mark, matching the app icon. Used on the sign-in screen.
export default function Logo({ size = 56 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b2136" />
          <stop offset="1" stopColor="#4f1927" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx="14" fill="url(#logo-bg)" />
      <rect x="6" y="6" width="52" height="52" rx="11" fill="none"
        stroke="#c8a24e" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="32" cy="39" r="12.5" fill="none" stroke="#c8a24e" strokeWidth="3.6" />
      <path d="M32 14 L39 21.5 L32 29.5 L25 21.5 Z" fill="#e0c478" />
      <path d="M25 21.5 L39 21.5 M32 14 L32 29.5" stroke="#a5781f" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
