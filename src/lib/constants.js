// Shared vocabulary for the whole app. Change labels here, not in each module.

export const KANBAN_COLUMNS = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To do" },
  { key: "doing", label: "In progress" },
  { key: "waiting", label: "Waiting" },
  { key: "done", label: "Done" },
];

export const TASK_CATEGORIES = [
  "Venue", "Vendor", "Budget", "Guest", "Travel", "Admin", "Other",
];

export const PRIORITIES = ["low", "medium", "high"];

export const VENDOR_CATEGORIES = [
  { key: "photographer", label: "Photographer" },
  { key: "videographer", label: "Videographer" },
  { key: "band", label: "Band" },
  { key: "dj", label: "DJ" },
  { key: "decoration", label: "Decoration" },
  { key: "catering", label: "Catering" },
  { key: "dress", label: "Dress / Suit" },
  { key: "makeup", label: "Makeup / Hair" },
  { key: "cake", label: "Cake" },
  { key: "transport", label: "Transport" },
  { key: "other", label: "Other" },
];

export const VENDOR_PIPELINE = [
  "lead", "contacted", "negotiating", "booked", "paid", "done",
];

export const BUDGET_CATEGORIES = [
  "venue", "food/drinks", "music", "photo/video",
  "decorations", "clothing", "rings", "misc buffer",
];

export const SIDES = ["Serbian", "Kazakh", "Czech"];

export const RSVP_STATES = [
  { key: "confirmed", label: "Confirmed" },
  { key: "tentative", label: "Tentative" },
  { key: "declined", label: "Declined" },
  { key: "none", label: "No response" },
];

// Cycle order used by tap-to-change pills.
export const RSVP_CYCLE = ["none", "confirmed", "tentative", "declined"];

// Amounts are stored in EUR (base). money() converts to the display currency.
export function money(eur, currency = "EUR", rate = 25) {
  const v = Number(eur || 0);
  if (currency === "CZK") {
    const czk = v * (Number(rate) || 25);
    try {
      return new Intl.NumberFormat("cs-CZ", {
        style: "currency", currency: "CZK", maximumFractionDigits: 0,
      }).format(czk);
    } catch { return `${Math.round(czk)} Kč`; }
  }
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency", currency: "EUR", maximumFractionDigits: 0,
    }).format(v);
  } catch { return `€${v.toFixed(0)}`; }
}

export const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

export function isOverdue(due_date, status) {
  if (!due_date || status === "done") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(due_date) < today;
}
