import { useEffect } from "react";

export default function Modal({ title, onClose, onDelete, onSave, saveLabel = "Save", children }) {
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
            <button className="btn btn-ghost danger" onClick={onDelete}>Delete</button>
          )}
          <div className="spacer" />
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          {onSave && <button className="btn" onClick={onSave}>{saveLabel}</button>}
        </footer>
      </div>
    </div>
  );
}
