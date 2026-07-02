import { useMemo, useRef, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { SIDES, RSVP_STATES, RSVP_CYCLE } from "../lib/constants.js";
import { guestsToCsv, csvToGuests, downloadCsv } from "../lib/csv.js";
import Modal from "../components/Modal.jsx";
import { Text, Area, Num, Select, Toggle } from "../components/Fields.jsx";

const emptyGuest = {
  name: "", side: "Serbian", country: "", rsvp: "none",
  plus_one: 0, kids_chair: 0, kids_lap: 0, dietary: "",
  accommodation_needed: false, transport_needed: false, notes: "",
};

const rsvpLabel = (k) => RSVP_STATES.find((r) => r.key === k)?.label || k;

export default function Guests() {
  const { guests, addRow, updateRow, deleteRow, addManyGuests } = useData();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyGuest);
  const [filters, setFilters] = useState({ side: "", rsvp: "", acc: false, trans: false, q: "" });
  const fileRef = useRef(null);

  const tally = useMemo(() => {
    const t = {
      confirmed: 0, tentative: 0, declined: 0, none: 0,
      paidHeadcount: 0, lapKids: 0, plusOnes: 0, kidsChair: 0,
      perSide: Object.fromEntries(SIDES.map((s) => [s, { invited: 0, confirmed: 0, paid: 0 }])),
    };
    for (const g of guests) {
      t[g.rsvp] = (t[g.rsvp] || 0) + 1;
      const side = t.perSide[g.side] || (t.perSide[g.side] = { invited: 0, confirmed: 0, paid: 0 });
      side.invited += 1;
      if (g.rsvp === "confirmed") {
        const seats = 1 + Number(g.plus_one || 0) + Number(g.kids_chair || 0);
        t.paidHeadcount += seats;
        t.lapKids += Number(g.kids_lap || 0);
        t.plusOnes += Number(g.plus_one || 0);
        t.kidsChair += Number(g.kids_chair || 0);
        side.confirmed += 1;
        side.paid += seats;
      }
    }
    t.totalBodies = t.paidHeadcount + t.lapKids;
    return t;
  }, [guests]);

  const filtered = useMemo(() => guests.filter((g) => {
    if (filters.side && g.side !== filters.side) return false;
    if (filters.rsvp && g.rsvp !== filters.rsvp) return false;
    if (filters.acc && !g.accommodation_needed) return false;
    if (filters.trans && !g.transport_needed) return false;
    if (filters.q && !g.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [guests, filters]);

  function cycleRsvp(g, e) {
    e.stopPropagation();
    const next = RSVP_CYCLE[(RSVP_CYCLE.indexOf(g.rsvp) + 1) % RSVP_CYCLE.length];
    updateRow("guests", g.id, { rsvp: next });
  }
  function openNew() { setDraft(emptyGuest); setEditing({}); }
  function openEdit(g) { setDraft({ ...g }); setEditing(g); }
  function save() {
    if (!draft.name.trim()) return;
    if (editing?.id) updateRow("guests", editing.id, draft);
    else addRow("guests", draft);
    setEditing(null);
  }
  function remove() { if (editing?.id) deleteRow("guests", editing.id); setEditing(null); }

  function exportCsv() {
    downloadCsv("wedding-guests.csv", guestsToCsv(guests));
  }
  function onImportFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = csvToGuests(String(reader.result || ""));
      if (rows.length) addManyGuests(rows);
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">People</p>
          <h1>Guests</h1>
        </div>
        <button className="btn" onClick={openNew}>+ Guest</button>
      </header>

      {/* Headcount tally */}
      <div className="tally">
        <div className="tally-main">
          <div className="tally-big">
            <span className="tally-num">{tally.paidHeadcount}</span>
            <span className="tally-cap">paid headcount</span>
          </div>
          <div className="tally-big sub">
            <span className="tally-num">{tally.totalBodies}</span>
            <span className="tally-cap">total bodies</span>
          </div>
        </div>
        <div className="tally-line">
          <span className="chip ok">Confirmed {tally.confirmed}</span>
          <span className="chip warn">Tentative {tally.tentative}</span>
          <span className="chip mute">Declined {tally.declined}</span>
          <span className="chip">No response {tally.none}</span>
        </div>
        <div className="tally-line small">
          <span>Plus-ones {tally.plusOnes}</span>
          <span>Kids w/ chair {tally.kidsChair}</span>
          <span>Kids on lap {tally.lapKids}</span>
        </div>
        <div className="tally-sides">
          {SIDES.map((s) => (
            <div className="side" key={s}>
              <span className="side-name">{s}</span>
              <span className="side-num">{tally.perSide[s].confirmed} confirmed / {tally.perSide[s].invited} invited</span>
              <span className="side-sub">{tally.perSide[s].paid} paid seats</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filters">
        <input className="input filter-search" placeholder="Search names…"
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.side}
          onChange={(e) => setFilters((f) => ({ ...f, side: e.target.value }))}>
          <option value="">All sides</option>
          {SIDES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="input" value={filters.rsvp}
          onChange={(e) => setFilters((f) => ({ ...f, rsvp: e.target.value }))}>
          <option value="">Any RSVP</option>
          {RSVP_STATES.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
        </select>
        <label className="chk"><input type="checkbox" checked={filters.acc}
          onChange={(e) => setFilters((f) => ({ ...f, acc: e.target.checked }))} /> Needs hotel</label>
        <label className="chk"><input type="checkbox" checked={filters.trans}
          onChange={(e) => setFilters((f) => ({ ...f, trans: e.target.checked }))} /> Needs transport</label>
      </div>

      <div className="io-row">
        <button className="btn btn-ghost" onClick={exportCsv}>Export CSV</button>
        <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>Import CSV</button>
        <input ref={fileRef} type="file" accept=".csv" hidden onChange={onImportFile} />
        <span className="io-hint">{filtered.length} shown · {guests.length} total</span>
      </div>

      <div className="guest-list">
        {filtered.map((g) => (
          <div className="guest-row" key={g.id} onClick={() => openEdit(g)}>
            <button className={`rsvp rsvp-${g.rsvp}`} onClick={(e) => cycleRsvp(g, e)} title="Tap to change RSVP">
              {rsvpLabel(g.rsvp)}
            </button>
            <div className="guest-main">
              <span className="guest-name">{g.name}</span>
              <span className="guest-sub">
                {g.side}
                {g.plus_one ? ` · +${g.plus_one}` : ""}
                {g.kids_chair ? ` · ${g.kids_chair} kid-seat` : ""}
                {g.kids_lap ? ` · ${g.kids_lap} lap` : ""}
                {g.accommodation_needed ? " · 🏨" : ""}
                {g.transport_needed ? " · 🚐" : ""}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty">No guests match.</p>}
      </div>

      {editing && (
        <Modal
          title={editing.id ? "Edit guest" : "New guest"}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={editing.id ? remove : null}
        >
          <Text label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <div className="grid-2">
            <Select label="Side" value={draft.side} onChange={(v) => setDraft({ ...draft, side: v })} options={SIDES} />
            <Select label="RSVP" value={draft.rsvp} onChange={(v) => setDraft({ ...draft, rsvp: v })}
              options={RSVP_STATES.map((r) => ({ value: r.key, label: r.label }))} />
            <Text label="Country" value={draft.country} onChange={(v) => setDraft({ ...draft, country: v })} />
            <Num label="Plus-ones" value={draft.plus_one} onChange={(v) => setDraft({ ...draft, plus_one: v })} />
            <Num label="Kids w/ chair (5+)" value={draft.kids_chair} onChange={(v) => setDraft({ ...draft, kids_chair: v })} />
            <Num label="Kids on lap (under 5)" value={draft.kids_lap} onChange={(v) => setDraft({ ...draft, kids_lap: v })} />
          </div>
          <Text label="Dietary" value={draft.dietary} onChange={(v) => setDraft({ ...draft, dietary: v })} />
          <div className="grid-2">
            <Toggle label="Needs accommodation" value={draft.accommodation_needed} onChange={(v) => setDraft({ ...draft, accommodation_needed: v })} />
            <Toggle label="Needs transport" value={draft.transport_needed} onChange={(v) => setDraft({ ...draft, transport_needed: v })} />
          </div>
          <Area label="Notes" value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
        </Modal>
      )}
    </>
  );
}
