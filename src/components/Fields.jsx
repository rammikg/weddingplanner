// Lightweight controlled fields. Each calls onChange with the raw value.

export function Field({ label, children }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export function Text({ label, value, onChange, placeholder }) {
  return (
    <Field label={label}>
      <input
        className="input"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function Area({ label, value, onChange, placeholder }) {
  return (
    <Field label={label}>
      <textarea
        className="input area"
        value={value ?? ""}
        placeholder={placeholder}
        rows={3}
        onChange={(e) => onChange(e.target.value)}
      />
    </Field>
  );
}

export function Num({ label, value, onChange, min = 0 }) {
  return (
    <Field label={label}>
      <input
        className="input"
        type="number"
        min={min}
        value={value ?? 0}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
      />
    </Field>
  );
}

export function DateField({ label, value, onChange }) {
  return (
    <Field label={label}>
      <input
        className="input"
        type="date"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
      />
    </Field>
  );
}

export function Select({ label, value, onChange, options }) {
  // options: array of strings, or {value,label}
  const norm = options.map((o) =>
    typeof o === "string" ? { value: o, label: o } : o
  );
  return (
    <Field label={label}>
      <select
        className="input"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {norm.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  );
}

export function Toggle({ label, value, onChange }) {
  return (
    <label className="toggle">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}
