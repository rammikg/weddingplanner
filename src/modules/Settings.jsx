import { useState } from "react";
import { useData } from "../context/DataContext.jsx";

export default function Settings() {
  const { settings, members, updateSettings, addRow, updateRow, deleteRow, session, signOut, isConfigured } = useData();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  function addMember() {
    if (!name.trim()) return;
    addRow("members", { name: name.trim(), role_label: role.trim() });
    setName(""); setRole("");
  }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">Setup</p>
          <h1>Settings</h1>
        </div>
      </header>

      {!isConfigured && (
        <div className="banner">
          <b>Demo mode.</b> Changes live only in this browser and reset on reload.
          Add Supabase keys (see README) to save and share.
        </div>
      )}

      <section className="settings-block">
        <h2>Budget</h2>
        <div className="grid-2">
          <label className="field">
            <span className="field-label">Total budget</span>
            <input className="input" type="number" value={settings?.total_budget || 0}
              onChange={(e) => updateSettings({ total_budget: Number(e.target.value || 0) })} />
          </label>
          <label className="field">
            <span className="field-label">Currency</span>
            <input className="input" value={settings?.currency || "EUR"}
              onChange={(e) => updateSettings({ currency: e.target.value.toUpperCase().slice(0, 3) })} />
          </label>
        </div>
      </section>

      <section className="settings-block">
        <h2>People (assignees)</h2>
        <p className="hint">These power the assignee dropdown on tasks. They don’t need to log in.</p>
        <div className="member-list">
          {members.map((m) => (
            <div className="member" key={m.id}>
              <input className="input" value={m.name}
                onChange={(e) => updateRow("members", m.id, { name: e.target.value })} />
              <input className="input" value={m.role_label || ""} placeholder="role"
                onChange={(e) => updateRow("members", m.id, { role_label: e.target.value })} />
              <button className="icon-btn" onClick={() => deleteRow("members", m.id)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
        <div className="member add">
          <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
          <button className="btn" onClick={addMember}>Add</button>
        </div>
      </section>

      <section className="settings-block">
        <h2>Account</h2>
        {isConfigured ? (
          <>
            <p className="hint">Signed in as {session?.user?.email}</p>
            <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
          </>
        ) : (
          <p className="hint">No account in demo mode.</p>
        )}
      </section>
    </>
  );
}
