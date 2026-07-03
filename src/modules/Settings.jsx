import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import { useLang } from "../context/LangContext.jsx";
import { LANGS } from "../lib/i18n.js";

export default function Settings() {
  const { settings, members, updateSettings, addRow, updateRow, deleteRow, session, signOut, isConfigured } = useData();
  const { t, lang, setLang } = useLang();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const currency = settings?.currency || "EUR";

  function addMember() {
    if (!name.trim()) return;
    addRow("members", { name: name.trim(), role_label: role.trim() });
    setName(""); setRole("");
  }

  return (
    <>
      <header className="page-head">
        <div>
          <p className="eyebrow">{t("eyebrow_setup")}</p>
          <h1>{t("title_settings")}</h1>
        </div>
      </header>

      {!isConfigured && <div className="banner"><b>{t("demo_banner")}</b></div>}

      <section className="settings-block">
        <h2>{t("set_language")}</h2>
        <label className="field">
          <span className="field-label">{t("set_language")}</span>
          <select className="input" value={lang} onChange={(e) => setLang(e.target.value)}>
            {LANGS.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </label>
      </section>

      <section className="settings-block">
        <h2>{t("set_wedding_day")}</h2>
        <p className="hint">{t("set_wedding_hint")}</p>
        <label className="field">
          <span className="field-label">{t("f_date")}</span>
          <input className="input" type="date" value={settings?.wedding_date || ""}
            onChange={(e) => updateSettings({ wedding_date: e.target.value || null })} />
        </label>
      </section>

      <section className="settings-block">
        <h2>{t("set_budget_currency")}</h2>
        <div className="grid-2">
          <label className="field">
            <span className="field-label">{t("f_total_budget_eur")}</span>
            <input className="input" type="number" value={settings?.total_budget || 0}
              onChange={(e) => updateSettings({ total_budget: Number(e.target.value || 0) })} />
          </label>
          <label className="field">
            <span className="field-label">{t("f_display_currency")}</span>
            <select className="input" value={currency}
              onChange={(e) => updateSettings({ currency: e.target.value })}>
              <option value="EUR">EUR (€)</option>
              <option value="CZK">CZK (Kč)</option>
            </select>
          </label>
        </div>
        {currency === "CZK" && (
          <label className="field">
            <span className="field-label">{t("f_exchange_rate")}</span>
            <input className="input" type="number" step="0.1" value={settings?.eur_czk_rate || 25}
              onChange={(e) => updateSettings({ eur_czk_rate: Number(e.target.value || 25) })} />
          </label>
        )}
        <p className="hint">{t("currency_note")}</p>
      </section>

      <section className="settings-block">
        <h2>{t("set_people")}</h2>
        <p className="hint">{t("set_people_hint")}</p>
        <div className="member-list">
          {members.map((m) => (
            <div className="member" key={m.id}>
              <input className="input" value={m.name}
                onChange={(e) => updateRow("members", m.id, { name: e.target.value })} />
              <input className="input" value={m.role_label || ""} placeholder={t("f_role")}
                onChange={(e) => updateRow("members", m.id, { role_label: e.target.value })} />
              <button className="icon-btn" onClick={() => deleteRow("members", m.id)} aria-label="Remove">×</button>
            </div>
          ))}
        </div>
        <div className="member add">
          <input className="input" placeholder={t("ph_name")} value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input" placeholder={t("ph_role")} value={role} onChange={(e) => setRole(e.target.value)} />
          <button className="btn" onClick={addMember}>{t("add")}</button>
        </div>
      </section>

      <section className="settings-block">
        <h2>{t("set_account")}</h2>
        {isConfigured ? (
          <>
            <p className="hint">{t("signed_in_as", { email: session?.user?.email })}</p>
            <button className="btn btn-ghost" onClick={signOut}>{t("sign_out")}</button>
          </>
        ) : (
          <p className="hint">{t("no_account_demo")}</p>
        )}
      </section>
    </>
  );
}
