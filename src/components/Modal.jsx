import { useEffect } from "react";
import { useLang } from "../context/LangContext.jsx";

export default function Modal({ title, onClose, onDelete, onSave, saveLabel, children }) {
  const { t } = useLang();
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-head">
          <h3>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="modal-body">{children}</div>
        <footer className="modal-foot">
          {onDelete && (
            <button className="btn btn-ghost danger" onClick={onDelete}>{t("delete")}</button>
          )}
          <div className="spacer" />
          <button className="btn btn-ghost" onClick={onClose}>{t("cancel")}</button>
          {onSave && <button className="btn" onClick={onSave}>{saveLabel || t("save")}</button>}
        </footer>
      </div>
    </div>
  );
}
