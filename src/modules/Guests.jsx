import { useMemo, useRef, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { SIDES, RSVP_STATES, RSVP_CYCLE } from "../lib/constants.js";
import { guestsToCsv, csvToGuests, downloadCsv } from "../lib/csv.js";
import Modal from "../components/Modal.jsx";
import { Text, Area, Num, Select, Toggle } from "../components/Fields.jsx";

const emptyGuest = {
  name: "", side: "Serbian", country: "", rsvp: "none",
  plus_one: 0, kids_chair: 0, kids_lap: 0, dietary: "",
  accommodation_needed: false, transport_needed: false, notes: "",
};

export default function Guests() {
  const { guests, addRow, updateRow, deleteRow, addManyGuests } = useData();
  const { t } = useLang();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyGuest);
  const [filters, setFilters] = useState({ side: "", rsvp: "", acc: false, trans: false, q: "" });
  const fileRef = useRef(null);

  const tally = useMemo(() => {
    const acc = { confirmed: 0, tentative: 0, declined: 0, none: 0,
      paidHeadcount: 0, lapKids: 0, plusOnes: 0, kidsChair: 0,
      perSide: Object.fromEntries(SIDES.map((s) => [s, { invited: 0, confirmed: 0, paid: 0 }])) };
    for (const g of guests) {
      acc[g.rsvp] = (acc[g.rsvp] || 0) + 1;
      const side = acc.perSide[g.side] || (acc.perSide[g.side] = { invited: 0, confirmed: 0, paid: 0 });
      side.invited += 1;
      if (g.rsvp === "confirmed") {
        const seats = 1 + Number(g.plus_one || 0) + Number(g.kids_chair || 0);
        acc.paidHeadcount += seats;
        acc.lapKids += Number(g.kids_lap || 0);
        acc.plusOnes += Number(g.plus_one || 0);
        acc.kidsChair += Number(g.kids_chair || 0);
        side.confirmed += 1;
        side.paid += seats;
      }
    }
    acc.totalBodies = acc.paidHeadcount + acc.lapKids;
    return acc;
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

  function exportCsv() { downloadCsv("wedding-guests.csv", guestsToCsv(guests)); }
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
          <p className="eyebrow">{t("eyebrow_people")}</p>
          <h1>{t("title_guests")}</h1>
        </div>
        <button className="btn" onClick={openNew}>{t("btn_guest")}</button>
      </header>

      <div className="tally">
        <div className="tally-main">
          <div className="tally-big">
            <span className="tally-num">{tally.paidHeadcount}</span>
            <span className="tally-cap">{t("paid_headcount")}</span>
          </div>
          <div className="tally-big sub">
            <span className="tally-num">{tally.totalBodies}</span>
            <span className="tally-cap">{t("total_bodies")}</span>
          </div>
        </div>
        <div className="tally-line">
          <span className="chip ok">{t("rsvp_confirmed")} {tally.confirmed}</span>
          <span className="chip warn">{t("rsvp_tentative")} {tally.tentative}</span>
          <span className="chip mute">{t("rsvp_declined")} {tally.declined}</span>
          <span className="chip">{t("rsvp_none")} {tally.none}</span>
        </div>
        <div className="tally-line small">
          <span>{t("plus_ones")} {tally.plusOnes}</span>
          <span>{t("kids_chair")} {tally.kidsChair}</span>
          <span>{t("kids_lap")} {tally.lapKids}</span>
        </div>
        <div className="tally-sides">
          {SIDES.map((s) => (
            <div className="side" key={s}>
              <span className="side-name">{t(`side_${s}`)}</span>
              <span className="side-num">{t("side_confirmed", { c: tally.perSide[s].confirmed, i: tally.perSide[s].invited })}</span>
              <span className="side-sub">{tally.perSide[s].paid} {t("paid_seats")}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="filters">
        <input className="input filter-search" placeholder={t("search_names")}
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.side}
          onChange={(e) => setFilters((f) => ({ ...f, side: e.target.value }))}>
          <option value="">{t("all_sides")}</option>
          {SIDES.map((s) => <option key={s} value={s}>{t(`side_${s}`)}</option>)}
        </select>
        <select className="input" value={filters.rsvp}
          onChange={(e) => setFilters((f) => ({ ...f, rsvp: e.target.value }))}>
          <option value="">{t("any_rsvp")}</option>
          {RSVP_STATES.map((r) => <option key={r.key} value={r.key}>{t(`rsvp_${r.key}`)}</option>)}
        </select>
        <label className="chk"><input type="checkbox" checked={filters.acc}
          onChange={(e) => setFilters((f) => ({ ...f, acc: e.target.checked }))} /> {t("needs_hotel")}</label>
        <label className="chk"><input type="checkbox" checked={filters.trans}
          onChange={(e) => setFilters((f) => ({ ...f, trans: e.target.checked }))} /> {t("needs_transport")}</label>
      </div>

      <div className="io-row">
        <button className="btn btn-ghost" onClick={exportCsv}>{t("export_csv")}</button>
        <button className="btn btn-ghost" onClick={() => fileRef.current?.click()}>{t("import_csv")}</button>
        <input ref={fileRef} type="file" accept=".csv" hidden onChange={onImportFile} />
        <span className="io-hint">{t("shown_total", { shown: filtered.length, total: guests.length })}</span>
      </div>

      <div className="guest-list">
        {filtered.map((g) => (
          <div className="guest-row" key={g.id} onClick={() => openEdit(g)}>
            <button className={`rsvp rsvp-${g.rsvp}`} onClick={(e) => cycleRsvp(g, e)}>
              {t(`rsvp_${g.rsvp}`)}
            </button>
            <div className="guest-main">
              <span className="guest-name">{g.name}</span>
              <span className="guest-sub">
                {t(`side_${g.side}`)}
                {g.plus_one ? ` · +${g.plus_one}` : ""}
                {g.kids_chair ? ` · ${g.kids_chair}🪑` : ""}
                {g.kids_lap ? ` · ${g.kids_lap}👶` : ""}
                {g.accommodation_needed ? " · 🏨" : ""}
                {g.transport_needed ? " · 🚐" : ""}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="empty">{t("no_match")}</p>}
      </div>

      {editing && (
        <Modal title={editing.id ? t("edit_guest") : t("new_guest")}
          onClose={() => setEditing(null)} onSave={save} onDelete={editing.id ? remove : null}>
          <Text label={t("f_name")} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <div className="grid-2">
            <Select label={t("f_side")} value={draft.side} onChange={(v) => setDraft({ ...draft, side: v })}
              options={SIDES.map((s) => ({ value: s, label: t(`side_${s}`) }))} />
            <Select label={t("f_rsvp")} value={draft.rsvp} onChange={(v) => setDraft({ ...draft, rsvp: v })}
              options={RSVP_STATES.map((r) => ({ value: r.key, label: t(`rsvp_${r.key}`) }))} />
            <Text label={t("f_country")} value={draft.country} onChange={(v) => setDraft({ ...draft, country: v })} />
            <Num label={t("f_plus_ones")} value={draft.plus_one} onChange={(v) => setDraft({ ...draft, plus_one: v })} />
            <Num label={t("f_kids_chair")} value={draft.kids_chair} onChange={(v) => setDraft({ ...draft, kids_chair: v })} />
            <Num label={t("f_kids_lap")} value={draft.kids_lap} onChange={(v) => setDraft({ ...draft, kids_lap: v })} />
          </div>
          <Text label={t("f_dietary")} value={draft.dietary} onChange={(v) => setDraft({ ...draft, dietary: v })} />
          <div className="grid-2">
            <Toggle label={t("f_needs_accommodation")} value={draft.accommodation_needed} onChange={(v) => setDraft({ ...draft, accommodation_needed: v })} />
            <Toggle label={t("f_needs_transport")} value={draft.transport_needed} onChange={(v) => setDraft({ ...draft, transport_needed: v })} />
          </div>
          <Area label={t("f_notes")} value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
        </Modal>
      )}
    </>
  );
}
