import Papa from "papaparse";
import { SIDES, RSVP_STATES } from "./constants.js";

const num = (v) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : 0;
};
const bool = (v) =>
  ["true", "yes", "1", "y"].includes(String(v || "").trim().toLowerCase());

const RSVP_KEYS = RSVP_STATES.map((r) => r.key);

export function guestsToCsv(guests) {
  const rows = guests.map((g) => ({
    name: g.name,
    side: g.side,
    country: g.country || "",
    rsvp: g.rsvp,
    plus_one: g.plus_one || 0,
    kids_chair: g.kids_chair || 0,
    kids_lap: g.kids_lap || 0,
    dietary: g.dietary || "",
    accommodation_needed: g.accommodation_needed ? "yes" : "no",
    transport_needed: g.transport_needed ? "yes" : "no",
    notes: g.notes || "",
  }));
  return Papa.unparse(rows);
}

export function csvToGuests(text) {
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
  return data
    .map((r) => ({
      name: String(r.name || "").trim(),
      side: SIDES.includes(r.side) ? r.side : "Serbian",
      country: r.country || "",
      rsvp: RSVP_KEYS.includes(r.rsvp) ? r.rsvp : "none",
      plus_one: num(r.plus_one),
      kids_chair: num(r.kids_chair),
      kids_lap: num(r.kids_lap),
      dietary: r.dietary || "",
      accommodation_needed: bool(r.accommodation_needed),
      transport_needed: bool(r.transport_needed),
      notes: r.notes || "",
    }))
    .filter((g) => g.name);
}

export function downloadCsv(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
