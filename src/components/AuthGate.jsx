import { useState } from "react";
import { useData } from "../context/DataContext.jsx";

export default function AuthGate() {
  const { signIn } = useData();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!email.trim()) return;
    setBusy(true);
    setErr("");
    const { error } = await signIn(email.trim());
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <p className="eyebrow">Kragujevac · September</p>
        <h1>Wedding OS</h1>
        {sent ? (
          <p className="auth-msg">
            Check your inbox — we sent a sign-in link to <b>{email}</b>. Open it
            on this device to continue.
          </p>
        ) : (
          <>
            <p className="auth-msg">
              Enter your email and we’ll send a one-tap sign-in link. No password.
            </p>
            <input
              className="input"
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
            {err && <p className="auth-err">{err}</p>}
            <button className="btn btn-block" onClick={submit} disabled={busy}>
              {busy ? "Sending…" : "Send link"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
