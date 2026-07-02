import { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import Logo from "./Logo.jsx";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

export default function AuthGate() {
  const { signIn, signInWithGoogle } = useData();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  async function google() {
    setErr("");
    const { error } = await signInWithGoogle();
    if (error) setErr(error.message);
    // on success the browser redirects to Google, then back signed in
  }

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
        <Logo size={56} />
        <p className="eyebrow" style={{ marginTop: 14 }}>LAVA YOU</p>
        <h1>A+B Wedding ❤️</h1>

        {sent ? (
          <p className="auth-msg">
            Check your inbox — we sent a sign-in link to <b>{email}</b>. Open it
            on this device to continue.
          </p>
        ) : (
          <>
            <p className="auth-msg">Sign in to open your wedding board.</p>

            <button className="btn btn-block btn-google" onClick={google}>
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>

            {!showEmail ? (
              <button className="auth-alt" onClick={() => setShowEmail(true)}>
                or sign in with email instead
              </button>
            ) : (
              <>
                <div className="auth-divider"><span>or email</span></div>
                <input
                  className="input"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
                <button className="btn btn-block" onClick={submit} disabled={busy}>
                  {busy ? "Sending…" : "Send link"}
                </button>
              </>
            )}

            {err && <p className="auth-err">{err}</p>}
          </>
        )}
      </div>
    </div>
  );
}
