import { useMemo, useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { VENDOR_CATEGORIES, VENDOR_PIPELINE, money } from "../lib/constants.js";
import Modal from "../components/Modal.jsx";
import { Text, Area, Num, Select, Toggle } from "../components/Fields.jsx";

const emptyVendor = {
  name: "", category: "other", status: "lead", contact_name: "", phone: "",
  email: "", quote: 0, deposit_required: 0, deposit_paid: false,
  contract_url: "", notes: "",
};

const catLabel = (k) => VENDOR_CATEGORIES.find((c) => c.key === k)?.label || k;
const balance = (v) => Number(v.quote || 0) - (v.deposit_paid ? Number(v.deposit_required || 0) : 0);

export default function Vendors() {
  const { vendors, settings, addRow, updateRow, deleteRow } = useData();
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyVendor);
  const [filters, setFilters] = useState({ status: "", q: "" });
  const cur = settings?.currency || "EUR";
  const rate = settings?.eur_czk_rate || 25;

  const filtered = useMemo(() => vendors.filter((v) => {
    if (filters.status && v.status !== filters.status) return false;
    if (filters.q && !v.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [vendors, filters]);

  // group by category (only categories that have matching vendors)
  const groups = useMemo(() => {
    const map = {};
    for (const v of filtered) (map[v.category] || (map[v.category] = [])).push(v);
    return VENDOR_CATEGORIES
      .filter((c) => map[c.key]?.length)
      .map((c) => ({ ...c, items: map[c.key] }));
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
          <p className="eyebrow">Suppliers</p>
          <h1>Vendors</h1>
        </div>
        <button className="btn" onClick={openNew}>+ Vendor</button>
      </header>

      <div className="stat-row three">
        <div className="stat">
          <span className="stat-label">Vendors</span>
          <span className="stat-val">{vendors.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Deposits paid</span>
          <span className="stat-val">{money(totalPaid, cur, rate)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Outstanding</span>
          <span className="stat-val">{money(totalOutstanding, cur, rate)}</span>
        </div>
      </div>

      <div className="filters">
        <input className="input filter-search" placeholder="Search vendors…"
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">Any stage</option>
          {VENDOR_PIPELINE.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {groups.length === 0 && <p className="empty">No vendors yet. Add your first with “+ Vendor”.</p>}

      {groups.map((g) => (
        <details className="cat-drop" key={g.key}>
          <summary>
            <span className="cat-drop-name">{g.label}</span>
            <span className="count">{g.items.length}</span>
          </summary>
          <div className="cat-drop-body">
            {g.items.map((v) => (
              <article className="vendor-card" key={v.id} onClick={() => openEdit(v)}>
                <div className="vendor-top">
                  <span className="vendor-name">{v.name}</span>
                  <span className={`pill stage-${v.status}`}>{v.status}</span>
                </div>
                <div className="vendor-money">
                  <span>Price <b>{money(v.quote, cur, rate)}</b></span>
                  <span className={`${balance(v) > 0 ? "over" : "ok-text"}`}>
                    Balance <b>{money(balance(v), cur, rate)}</b>
                  </span>
                  <span className={`pill ${v.deposit_paid ? "ok" : "warn"}`}>
                    {v.deposit_paid ? "deposit paid" : "deposit due"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </details>
      ))}

      {editing && (
        <Modal title={editing.id ? "Edit vendor" : "New vendor"}
          onClose={() => setEditing(null)} onSave={save} onDelete={editing.id ? remove : null}>
          <Text label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <div className="grid-2">
            <Select label="Type" value={draft.category}
              onChange={(v) => setDraft({ ...draft, category: v })}
              options={VENDOR_CATEGORIES.map((c) => ({ value: c.key, label: c.label }))} />
            <Select label="Stage" value={draft.status}
              onChange={(v) => setDraft({ ...draft, status: v })} options={VENDOR_PIPELINE} />
            <Text label="Contact name" value={draft.contact_name} onChange={(v) => setDraft({ ...draft, contact_name: v })} />
            <Text label="Phone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
          </div>
          <Text label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
          <div className="grid-2">
            <Num label="Their price / quote (EUR)" value={draft.quote} onChange={(v) => setDraft({ ...draft, quote: v })} />
            <Num label="Deposit required (EUR)" value={draft.deposit_required} onChange={(v) => setDraft({ ...draft, deposit_required: v })} />
          </div>
          <Toggle label="Deposit paid" value={draft.deposit_paid} onChange={(v) => setDraft({ ...draft, deposit_paid: v })} />
          <div className="balance-note">
            Remaining balance: <b>{money(balance(draft), cur, rate)}</b>
            <span className="balance-hint"> · “price” = what they charge, not what you’ve paid</span>
          </div>
          <Text label="Contract link (URL)" value={draft.contract_url} onChange={(v) => setDraft({ ...draft, contract_url: v })} />
          <Area label="Notes / log" value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
        </Modal>
      )}
    </>
  );
}
