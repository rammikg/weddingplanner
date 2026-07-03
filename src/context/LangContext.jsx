import { createContext, useContext, useState } from "react";
import { translate } from "../lib/i18n.js";

const LangContext = createContext(null);
export const useLang = () => useContext(LangContext);

function initial() {
  try { return localStorage.getItem("wos_lang") || "en"; }
  catch { return "en"; }
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initial);

  function setLang(l) {
    setLangState(l);
    try { localStorage.setItem("wos_lang", l); } catch { /* ignore */ }
    try { document.documentElement.lang = l; } catch { /* ignore */ }
  }

  const t = (key, vars) => translate(lang, key, vars);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}
