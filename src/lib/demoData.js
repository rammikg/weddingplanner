// Seed data for demo mode (no Supabase configured). Grounded in a real
// Kragujevac / Šumadija wedding so every module has something to show.

const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`;

const groomId = uid("m");
const brideId = uid("m");

export const demoMembers = [
  { id: groomId, name: "Groom", role_label: "Admin" },
  { id: brideId, name: "Bride", role_label: "Editor" },
  { id: uid("m"), name: "Mom", role_label: "Family" },
];

export const demoSettings = { id: 1, total_budget: 15000, currency: "EUR", eur_czk_rate: 25, wedding_date: null };

let p = 0;
const task = (title, status, priority, category, due, assignee, description = "") => ({
  id: uid("t"), title, status, priority, category,
  due_date: due, assignee_id: assignee, description, position: ++p,
});

const soon = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
};

export const demoTasks = [
  task("Lock venue — Exclusive Event Center", "doing", "high", "Venue", soon(10), groomId, "Compare vs Woodland Resort + Hotel Šumarice"),
  task("Confirm September date", "doing", "high", "Admin", soon(7), groomId),
  task("Send catering tasting request", "todo", "high", "Vendor", soon(-2), brideId, "Overdue — chase this"),
  task("Book photographer", "todo", "high", "Vendor", soon(21), brideId),
  task("Live band shortlist", "todo", "medium", "Vendor", soon(30), groomId),
  task("Save-the-dates (CZ/RU/SR)", "backlog", "medium", "Guest", soon(45), brideId),
  task("Hotel blocks for Kazakh guests", "waiting", "medium", "Travel", soon(40), groomId, "Waiting on flight numbers"),
  task("Order rings", "backlog", "low", "Admin", null, brideId),
  task("Shortlist 10 venues", "done", "high", "Venue", soon(-14), groomId),
];

export const demoVendors = [
  { id: uid("v"), name: "Studio Kragujevac", category: "photographer", contact_name: "Marko", phone: "+381 ...", email: "", quote: 1200, deposit_required: 300, deposit_paid: true, contract_url: "", notes: "Great portfolio", status: "booked" },
  { id: uid("v"), name: "Bella Catering", category: "catering", contact_name: "Ana", phone: "", email: "", quote: 6000, deposit_required: 1500, deposit_paid: false, contract_url: "", notes: "Tasting pending", status: "negotiating" },
  { id: uid("v"), name: "Orkestar Šumadija", category: "band", contact_name: "", phone: "", email: "", quote: 1500, deposit_required: 0, deposit_paid: false, contract_url: "", notes: "", status: "contacted" },
];

export const demoBudget = [
  { id: uid("b"), category: "venue", label: "Venue hire", planned: 3000, actual: 0, paid: false, vendor_id: null },
  { id: uid("b"), category: "food/drinks", label: "Catering (150 pax)", planned: 6000, actual: 0, paid: false, vendor_id: null },
  { id: uid("b"), category: "photo/video", label: "Photographer", planned: 1200, actual: 300, paid: false, vendor_id: null },
  { id: uid("b"), category: "music", label: "Live band", planned: 1500, actual: 0, paid: false, vendor_id: null },
];

const guest = (name, side, rsvp, plus_one = 0, kids_chair = 0, kids_lap = 0, extra = {}) => ({
  id: uid("g"), name, side, rsvp, plus_one, kids_chair, kids_lap,
  country: extra.country || "", dietary: extra.dietary || "",
  accommodation_needed: extra.acc || false, transport_needed: extra.trans || false,
  notes: extra.notes || "",
});

export const demoGuests = [
  guest("Nikola Jovanović", "Serbian", "confirmed", 1, 1, 0, { country: "RS" }),
  guest("Milica Petrović", "Serbian", "confirmed", 0, 0, 1, { country: "RS" }),
  guest("Stefan Ilić", "Serbian", "tentative", 1),
  guest("Aigerim Nurlanovna", "Kazakh", "confirmed", 1, 0, 0, { country: "KZ", acc: true, trans: true }),
  guest("Daniyar Serik", "Kazakh", "none", 1, 0, 0, { country: "KZ", acc: true }),
  guest("Aliya Bekova", "Kazakh", "declined", 0),
  guest("Tomáš Novák", "Czech", "confirmed", 1, 2, 0, { country: "CZ", acc: true }),
  guest("Petra Svobodová", "Czech", "confirmed", 0, 0, 1, { country: "CZ", dietary: "Vegetarian" }),
  guest("Jakub Černý", "Czech", "none", 1, 0, 0, { country: "CZ" }),
];
