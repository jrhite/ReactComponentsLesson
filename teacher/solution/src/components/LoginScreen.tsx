// FEATURE (connected): reads login and loading from useAuth().

import { useAuth } from "../auth/AuthContext";
import type { Role } from "../types";
import Button from "./Button";

const ROLES: Role[] = ["viewer", "editor", "admin"];

export default function LoginScreen() {
  const { login, loading } = useAuth();

  return (
    <section className="login">
      <h2>Sign in to Team Blog</h2>
      <p className="muted">Pick a role to see what each one is allowed to do.</p>
      <div className="login-buttons">
        {ROLES.map((role) => (
          <Button key={role} variant="primary" onClick={() => login(role)} disabled={loading}>
            {role}
          </Button>
        ))}
      </div>
      {loading && <p className="muted small">Signing in…</p>}
    </section>
  );
}
