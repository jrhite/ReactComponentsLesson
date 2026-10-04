// FEATURE: lets you sign in as one of three roles.

import Button from "./Button.jsx";

export default function LoginScreen({ login, loading }) {
  return (
    <section className="login">
      <h2>Sign in to Team Blog</h2>
      <p className="muted">Pick a role to see what each one is allowed to do.</p>
      <div className="login-buttons">
        {["viewer", "editor", "admin"].map((role) => (
          <Button key={role} variant="primary" onClick={() => login(role)} disabled={loading}>
            {role}
          </Button>
        ))}
      </div>
      {loading && <p className="muted small">Signing in…</p>}
    </section>
  );
}
