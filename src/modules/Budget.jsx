import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { BUDGET_CATEGORIES, money } from "../lib/constants.js";
import Modal from "../components/Modal.jsx";
import { Text, Num, Select, Toggle } from "../components/Fields.jsx";

const emptyItem = { label: "", category: "venue", planned: 0, actual: 0, paid: false, vendor_id: null };

export default function Budget() {
  const { budgetItems, vendors, settings, addRow, updateRow, deleteRow } = useData();
  const { t } = useLang();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyItem);
  const cur = settings?.currency || "EUR";
  const rate = settings?.eur_czk_rate || 25;
  const fmt = (v) => money(v, cur, rate);
  const bcat = (c) => { const v = t(`bcat:${c}`); return v === `bcat:${c}` ? c : v; };

  const totals = useMemo(() => {
    const planned = budgetItems.reduce((s, i) => s + Number(i.planned || 0), 0);
    const actual = budgetItems.reduce((s, i) => s + Number(i.actual || 0), 0);
    const paid = budgetItems.reduce((s, i) => s + (i.paid ? Number(i.actual || 0) : 0), 0);
    return { planned, actual, paid };
  }, [budgetItems]);

  const vendorSummary = useMemo(() => {
    const quoted = vendors.reduce((s, v) => s + Number(v.quote || 0), 0);
    const depositsPaid = vendors.reduce((s, v) => s + (v.deposit_paid ? Number(v.deposit_required || 0) : 0), 0);
    const outstanding = vendors.reduce(
      (s, v) => s + Math.max(0, Number(v.quote || 0) - (v.deposit_paid ? Number(v.deposit_required || 0) : 0)), 0);
    return { quoted, depositsPaid, outstanding };
  }, [vendors]);

  const budget = Number(settings?.total_budget || 0);
  const remaining = budget - totals.actual;

  const byCategory = useMemo(() => {
    const map = {};
    for (const c of BUDGET_CATEGORIES) map[c] = { planned: 0, actual: 0, items: [] };
    for (const i of budgetItems) {
      const c = map[i.category] || (map[i.category] = { planned: 0, actual: 0, items: [] });
      c.planned += Number(i.planned || 0);
      c.actual += Number(i.actual || 0);
      c.items.push(i);
    }
    return map;
  }, [budgetItems]);

  const vendorName = (id) => vendors.find((v) => v.id === id)?.name || "";

  function openNew() { setDraft(emptyItem); setEditing({}); }
  function openEdit(i) { setDraft({ ...i }); setEditing(i); }
  function save() {
    if (!draft.label.trim()) return;
    if (editing?.id) updateRow("budget_items", editing.id, draft);
    else addRow("budget_items", draft);
    setEditing(null);
  }
  function remove() { if (editing?.id) deleteRow("budget_items", editing.id); setEditing(null); }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("eyebrow_money")}{cur === "CZK" ? ` · ${t("czk_view")}` : ""}</p>
          <h1>{t("title_budget")}</h1>
        </div>
        <button className="btn" onClick={openNew}>{t("btn_expense")}</button>
      </header>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">{t("stat_total_budget")}</span>
          <span className="stat-val">{fmt(budget)}</span>
        </div>
        <div className={`stat ${totals.planned > budget ? "bad" : ""}`}>
          <span className="stat-label">{t("stat_planned")}</span>
          <span className="stat-val">{fmt(totals.planned)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t("stat_spent")}</span>
          <span className="stat-val">{fmt(totals.actual)}</span>
        </div>
        <div className={`stat ${remaining < 0 ? "bad" : "good"}`}>
          <span className="stat-label">{t("stat_remaining")}</span>
          <span className="stat-val">{fmt(remaining)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">{t("stat_paid")}</span>
          <span className="stat-val">{fmt(totals.paid)}</span>
        </div>
      </div>

      <section className="vendor-summary">
        <div className="vs-head">
          <h2>{t("vendor_commitments")}</h2>
          <span className="hint">{t("from_vendors_tab")}</span>
        </div>
        <div className="vs-grid">
          <div><span className="vs-cap">{t("total_quoted")}</span><span className="vs-val">{fmt(vendorSummary.quoted)}</span></div>
          <div><span className="vs-cap">{t("deposits_paid")}</span><span className="vs-val ok-text">{fmt(vendorSummary.depositsPaid)}</span></div>
          <div><span className="vs-cap">{t("outstanding")}</span><span className="vs-val over">{fmt(vendorSummary.outstanding)}</span></div>
        </div>
      </section>

      {Object.entries(byCategory)
        .filter(([, c]) => c.items.length > 0)
        .map(([cat, c]) => (
          <section className="cat-block" key={cat}>
            <div className="cat-head">
              <h2>{bcat(cat)}</h2>
              <span className={c.actual > c.planned ? "over" : "muted"}>{fmt(c.actual)} / {fmt(c.planned)}</span>
            </div>
            {c.items.map((i) => (
              <div className="row" key={i.id} onClick={() => openEdit(i)}>
                <div className="row-main">
                  <span className="row-title">{i.label}</span>
                  {i.vendor_id && <span className="row-sub">{vendorName(i.vendor_id)}</span>}
                </div>
                <div className="row-right">
                  <span className={`amt ${Number(i.actual) > Number(i.planned) ? "over" : ""}`}>{fmt(i.actual)}</span>
                  <span className="row-sub">{t("plan_prefix")} {fmt(i.planned)}</span>
                </div>
                <span className={`pill ${i.paid ? "ok" : "warn"}`}>{i.paid ? t("paid") : t("unpaid")}</span>
              </div>
            ))}
          </section>
        ))}

      {budgetItems.length === 0 && <p className="empty">{t("no_expenses")}</p>}

      {editing && (
        <Modal title={editing.id ? t("edit_expense") : t("new_expense")}
          onClose={() => setEditing(null)} onSave={save} onDelete={editing.id ? remove : null}>
          <Text label={t("f_label")} value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
          <div className="grid-2">
            <Select label={t("f_category")} value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })}
              options={BUDGET_CATEGORIES.map((c) => ({ value: c, label: bcat(c) }))} />
            <Select label={t("f_linked_vendor")} value={draft.vendor_id || ""}
              onChange={(v) => setDraft({ ...draft, vendor_id: v || null })}
              options={[{ value: "", label: "—" }, ...vendors.map((v) => ({ value: v.id, label: v.name }))]} />
            <Num label={t("f_planned_eur")} value={draft.planned} onChange={(v) => setDraft({ ...draft, planned: v })} />
            <Num label={t("f_actual_eur")} value={draft.actual} onChange={(v) => setDraft({ ...draft, actual: v })} />
          </div>
          <Toggle label={t("f_paid")} value={draft.paid} onChange={(v) => setDraft({ ...draft, paid: v })} />
        </Modal>
      )}
    </>
  );
}
