// Minimal stroke icons so the nav doesn't rely on an icon dependency.
const base = {
  width: 22, height: 22, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconBoard = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="6" height="18" rx="1.5" />
    <rect x="10.5" y="3" width="6" height="12" rx="1.5" />
    <rect x="18" y="3" width="3" height="8" rx="1.5" />
  </svg>
);
export const IconBudget = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6 9v6M18 9v6" />
  </svg>
);
export const IconVendors = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
export const IconGuests = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
    <path d="M16 6.5a3 3 0 0 1 0 5.8M17 20a5.5 5.5 0 0 0-3-4.9" />
  </svg>
);
export const IconSettings = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1" />
  </svg>
);
