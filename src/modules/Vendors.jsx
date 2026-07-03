import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { VENDOR_CATEGORIES, VENDOR_PIPELINE, money } from "../lib/constants.js";
import Modal from "../components/Modal.jsx";
import { Text, Area, Num, Select, Toggle } from "../components/Fields.jsx";

const emptyVendor = {
  name: "", category: "other", status: "lead", contact_name: "", phone: "",
  email: "", quote: 0, deposit_required: 0, deposit_paid: false,
  contract_url: "", notes: "",
};
const balance = (v) => Number(v.quote || 0) - (v.deposit_paid ? Number(v.deposit_required || 0) : 0);

export default function Vendors() {
  const { vendors, settings, addRow, updateRow, deleteRow } = useData();
  const { t } = useLang();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyVendor);
  const [filters, setFilters] = useState({ status: "", q: "" });
  const cur = settings?.currency || "EUR";
  const rate = settings?.eur_czk_rate || 25;
  const fmt = (v) => money(v, cur, rate);

  const filtered = useMemo(() => vendors.filter((v) => {
    if (filters.status && v.status !== filters.status) return false;
    if (filters.q && !v.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [vendors, filters]);

  const groups = useMemo(() => {
    const map = {};
    for (const v of filtered) (map[v.category] || (map[v.category] = [])).push(v);
    return VENDOR_CATEGORIES.filter((c) => map[c.key]?.length).map((c) => ({ ...c, items: map[c.key] }));
  }, [filtered]);

  const totalOutstanding = useMemo(
    () => vendors.reduce((s, v) => s + Math.max(0, balance(v)), 0), [vendors]);
  const totalPaid = useMemo(
    () => vendors.reduce((s, v) => s + (v.deposit_paid ? Number(v.deposit_required || 0) : 0), 0), [vendors]);

  function openNew() { setDraft(emptyVendor); setEditing({}); }
  function openEdit(v) { setDraft({ ...v }); setEditing(v); }
  function save() {
    if (!draft.name.trim()) return;
    if (editing?.id) updateRow("vendors", editing.id, draft);
    else addRow("vendors", draft);
    setEditing(null);
  }
  function remove() { if (editing?.id) deleteRow("vendors", editing.id); setEditing(null); }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("eyebrow_suppliers")}</p>
          <h1>{t("title_vendors")}</h1>
        </div>
        <button className="btn" onClick={openNew}>{t("btn_vendor")}</button>
      </header>

      <div className="stat-row three">
        <div className="stat">
          <span className="stat-label">{t("stat_vendors")}</span>
          <span className="stat-val">{vendors.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t("stat_deposits_paid")}</span>
          <span className="stat-val">{fmt(totalPaid)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t("stat_outstanding")}</span>
          <span className="stat-val">{fmt(totalOutstanding)}</span>
        </div>
      </div>

      <div className="filters">
        <input className="input filter-search" placeholder={t("search_vendors")}
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">{t("any_stage")}</option>
          {VENDOR_PIPELINE.map((s) => <option key={s} value={s}>{t(`stage_${s}`)}</option>)}
        </select>
      </div>

      {groups.length === 0 && <p className="empty">{t("no_vendors")}</p>}

      {groups.map((g) => (
        <details className="cat-drop" key={g.key}>
          <summary>
            <span className="cat-drop-name">{t(`vcat_${g.key}`)}</span>
            <span className="count">{g.items.length}</span>
          </summary>
          <div className="cat-drop-body">
            {g.items.map((v) => (
              <article className="vendor-card" key={v.id} onClick={() => openEdit(v)}>
                <div className="vendor-top">
                  <span className="vendor-name">{v.name}</span>
                  <span className={`pill stage-${v.status}`}>{t(`stage_${v.status}`)}</span>
                </div>
                <div className="vendor-money">
                  <span>{t("v_price")} <b>{fmt(v.quote)}</b></span>
                  <span className={`${balance(v) > 0 ? "over" : "ok-text"}`}>
                    {t("v_balance")} <b>{fmt(balance(v))}</b>
                  </span>
                  <span className={`pill ${v.deposit_paid ? "ok" : "warn"}`}>
                    {v.deposit_paid ? t("deposit_paid_pill") : t("deposit_due_pill")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </details>
      ))}

      {editing && (
        <Modal title={editing.id ? t("edit_vendor") : t("new_vendor")}
          onClose={() => setEditing(null)} onSave={save} onDelete={editing.id ? remove : null}>
          <Text label={t("f_name")} value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <div className="grid-2">
            <Select label={t("f_type")} value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })}
              options={VENDOR_CATEGORIES.map((c) => ({ value: c.key, label: t(`vcat_${c.key}`) }))} />
            <Select label={t("f_stage")} value={draft.status}
              onChange={(v) => setDraft({ ...draft, status: v })}
              options={VENDOR_PIPELINE.map((s) => ({ value: s, label: t(`stage_${s}`) }))} />
            <Text label={t("f_contact_name")} value={draft.contact_name} onChange={(v) => setDraft({ ...draft, contact_name: v })} />
            <Text label={t("f_phone")} value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
          </div>
          <Text label={t("f_email")} value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
          <div className="grid-2">
            <Num label={t("f_price_quote")} value={draft.quote} onChange={(v) => setDraft({ ...draft, quote: v })} />
            <Num label={t("f_deposit_required")} value={draft.deposit_required} onChange={(v) => setDraft({ ...draft, deposit_required: v })} />
          </div>
          <Toggle label={t("f_deposit_paid")} value={draft.deposit_paid} onChange={(v) => setDraft({ ...draft, deposit_paid: v })} />
          <div className="balance-note">
            {t("remaining_balance")}: <b>{fmt(balance(draft))}</b>
            <span className="balance-hint"> · {t("balance_hint")}</span>
          </div>
          <Text label={t("f_contract")} value={draft.contract_url} onChange={(v) => setDraft({ ...draft, contract_url: v })} />
          <Area label={t("f_notes_log")} value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
        </Modal>
      )}
    </>
  );
}
