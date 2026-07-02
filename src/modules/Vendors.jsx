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
  const [filters, setFilters] = useState({ category: "", status: "", q: "" });
  const cur = settings?.currency || "EUR";

  const filtered = useMemo(() => vendors.filter((v) => {
    if (filters.category && v.category !== filters.category) return false;
    if (filters.status && v.status !== filters.status) return false;
    if (filters.q && !v.name.toLowerCase().includes(filters.q.toLowerCase())) return false;
    return true;
  }), [vendors, filters]);

  const totalOutstanding = useMemo(
    () => vendors.reduce((s, v) => s + Math.max(0, balance(v)), 0),
    [vendors]
  );

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

      <div className="stat-row tight">
        <div className="stat">
          <span className="stat-label">Vendors</span>
          <span className="stat-val">{vendors.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Outstanding balance</span>
          <span className="stat-val">{money(totalOutstanding, cur)}</span>
        </div>
      </div>

      <div className="filters">
        <input className="input filter-search" placeholder="Search vendors…"
          value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} />
        <select className="input" value={filters.category}
          onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="">All types</option>
          {VENDOR_CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.label}</option>)}
        </select>
        <select className="input" value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="">Any stage</option>
          {VENDOR_PIPELINE.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="vendor-list">
        {filtered.map((v) => (
          <article className="vendor-card" key={v.id} onClick={() => openEdit(v)}>
            <div className="vendor-top">
              <div>
                <span className="vendor-name">{v.name}</span>
                <span className="row-sub">{catLabel(v.category)}</span>
              </div>
              <span className={`pill stage-${v.status}`}>{v.status}</span>
            </div>
            <div className="vendor-money">
              <span>Quote <b>{money(v.quote, cur)}</b></span>
              <span className={`${balance(v) > 0 ? "over" : "ok-text"}`}>
                Balance <b>{money(balance(v), cur)}</b>
              </span>
              <span className={`pill ${v.deposit_paid ? "ok" : "warn"}`}>
                {v.deposit_paid ? "deposit paid" : "deposit due"}
              </span>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="empty">No vendors match.</p>}
      </div>

      {editing && (
        <Modal
          title={editing.id ? "Edit vendor" : "New vendor"}
          onClose={() => setEditing(null)}
          onSave={save}
          onDelete={editing.id ? remove : null}
        >
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
            <Num label="Quote" value={draft.quote} onChange={(v) => setDraft({ ...draft, quote: v })} />
            <Num label="Deposit required" value={draft.deposit_required} onChange={(v) => setDraft({ ...draft, deposit_required: v })} />
          </div>
          <Toggle label="Deposit paid" value={draft.deposit_paid} onChange={(v) => setDraft({ ...draft, deposit_paid: v })} />
          <div className="balance-note">
            Remaining balance: <b>{money(balance(draft), cur)}</b>
          </div>
          <Text label="Contract link (URL)" value={draft.contract_url} onChange={(v) => setDraft({ ...draft, contract_url: v })} />
          <Area label="Notes / log" value={draft.notes} onChange={(v) => setDraft({ ...draft, notes: v })} />
        </Modal>
      )}
    </>
  );
}
