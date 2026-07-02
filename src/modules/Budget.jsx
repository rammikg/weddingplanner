import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { BUDGET_CATEGORIES, money } from "../lib/constants.js";
import Modal from "../components/Modal.jsx";
import { Text, Num, Select, Toggle } from "../components/Fields.jsx";

const emptyItem = { label: "", category: "venue", planned: 0, actual: 0, paid: false, vendor_id: null };

export default function Budget() {
  const { budgetItems, vendors, settings, addRow, updateRow, deleteRow, updateSettings } = useData();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyItem);
  const cur = settings?.currency || "EUR";

  const totals = useMemo(() => {
    const planned = budgetItems.reduce((s, i) => s + Number(i.planned || 0), 0);
    const actual = budgetItems.reduce((s, i) => s + Number(i.actual || 0), 0);
    const paid = budgetItems.reduce((s, i) => s + (i.paid ? Number(i.actual || 0) : 0), 0);
    return { planned, actual, paid };
  }, [budgetItems]);

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
          <p className="eyebrow">Money</p>
          <h1>Budget</h1>
        </div>
        <button className="btn" onClick={openNew}>+ Expense</button>
      </header>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-label">Total budget</span>
          <input
            className="stat-input"
            type="number"
            value={budget}
            onChange={(e) => updateSettings({ total_budget: Number(e.target.value || 0) })}
          />
        </div>
        <div className="stat">
          <span className="stat-label">Spent (actual)</span>
          <span className="stat-val">{money(totals.actual, cur)}</span>
        </div>
        <div className={`stat ${remaining < 0 ? "bad" : "good"}`}>
          <span className="stat-label">Remaining</span>
          <span className="stat-val">{money(remaining, cur)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Paid so far</span>
          <span className="stat-val">{money(totals.paid, cur)}</span>
        </div>
      </div>

      {Object.entries(byCategory)
        .filter(([, c]) => c.items.length > 0)
        .map(([cat, c]) => (
          <section className="cat-block" key={cat}>
            <div className="cat-head">
              <h2>{cat}</h2>
              <span className={c.actual > c.planned ? "over" : "muted"}>
                {money(c.actual, cur)} / {money(c.planned, cur)}
              </span>
            </div>
            {c.items.map((i) => (
              <div className="row" key={i.id} onClick={() => openEdit(i)}>
                <div className="row-main">
                  <span className="row-title">{i.label}</span>
                  {i.vendor_id && <span className="row-sub">{vendorName(i.vendor_id)}</span>}
                </div>
                <div className="row-right">
                  <span className={`amt ${Number(i.actual) > Number(i.planned) ? "over" : ""}`}>
                    {money(i.actual, cur)}
                  </span>
                  <span className="row-sub">plan {money(i.planned, cur)}</span>
                </div>
                <span className={`pill ${i.paid ? "ok" : "warn"}`}>{i.paid ? "paid" : "unpaid"}</span>
              </div>
            ))}
          </section>
        ))}

      {budgetItems.length === 0 && <p className="empty">No expenses yet. Add your first with “+ Expense”.</p>}

      {editing && (
        <Modal
          title={editing.id ? "Edit expense" : "New expense"}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={editing.id ? remove : null}
        >
          <Text label="Label" value={draft.label} onChange={(v) => setDraft({ ...draft, label: v })} />
          <div className="grid-2">
            <Select label="Category" value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })} options={BUDGET_CATEGORIES} />
            <Select label="Linked vendor" value={draft.vendor_id || ""}
              onChange={(v) => setDraft({ ...draft, vendor_id: v || null })}
              options={[{ value: "", label: "—" }, ...vendors.map((v) => ({ value: v.id, label: v.name }))]} />
            <Num label="Planned" value={draft.planned} onChange={(v) => setDraft({ ...draft, planned: v })} />
            <Num label="Actual" value={draft.actual} onChange={(v) => setDraft({ ...draft, actual: v })} />
          </div>
          <Toggle label="Paid" value={draft.paid} onChange={(v) => setDraft({ ...draft, paid: v })} />
        </Modal>
      )}
    </>
  );
}
