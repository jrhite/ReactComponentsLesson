// =============================================================
//  STARTER — Prop-drilling version (runs as-is)
//  Goal of today's class: replace the drilled `user` / `logout`
//  props with an AuthContext, then add permissions.
// =============================================================
import { useState } from "react";

// Fake API call
async function fakeLogin(role) {
  await new Promise(r => setTimeout(r, 300));
  return { id: 1, name: "Jane Doe", email: "jane@example.com", avatarUrl: "", role };
}

/* ---------------- Avatar (plain props) ---------------- */
function Avatar({ user, size = 36 }) {
  const initials = user.name.split(" ").map(p => p[0]).join("").toUpperCase();
  const style = {
    width: size, height: size, borderRadius: "50%",
    display: "grid", placeItems: "center",
    background: "#4f46e5", color: "white", fontWeight: 600,
  };
  return <div style={style} aria-label={user.name}>{initials}</div>;
}

/* ---------------- User dropdown ---------------- */
// PREDICT: which of these props does UserMenu actually use itself?
function UserMenu({ user, logout }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={styles.avatarBtn}>
        <Avatar user={user} />
      </button>

      {open && (
        <div role="menu" style={styles.dropdown}>
          <MenuItem onClick={() => alert("Profile")}>Profile</MenuItem>
          <MenuItem onClick={() => alert("Settings")}>Settings</MenuItem>
          <MenuItem onClick={logout}>Log out</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick }) {
  return <button role="menuitem" onClick={onClick} style={styles.menuItem}>{children}</button>;
}

/* ---------------- Layout ---------------- */
// Header doesn't use `logout` — it only passes it through.
function Header({ user, logout }) {
  return (
    <header style={styles.header}>
      <h1 style={{ margin: 0, fontSize: 20 }}>MyApp</h1>
      {user ? <UserMenu user={user} logout={logout} /> : <span>Not signed in</span>}
    </header>
  );
}

function LoginScreen({ login, loading }) {
  return (
    <div style={{ padding: 24 }}>
      <h2>Sign in as…</h2>
      {["viewer", "editor", "admin"].map(role => (
        <button key={role} onClick={() => login(role)} disabled={loading} style={{ marginRight: 8 }}>
          {role}
        </button>
      ))}
      {loading && <p>Signing in…</p>}
    </div>
  );
}

function PostList({ user }) {
  const posts = [{ id: 1, title: "Hello world" }, { id: 2, title: "Context is neat" }];
  return (
    <section style={{ padding: 24 }}>
      <h2>Posts</h2>
      <p>Signed in as <strong>{user.role}</strong></p>
      <button>+ New post</button>
      <ul>
        {posts.map(p => (
          <li key={p.id}>
            {p.title} <button>Edit</button> <button>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

// Dashboard passes `user`, `login`, and `loading` straight through.
function Dashboard({ user, login, loading }) {
  return user ? <PostList user={user} /> : <LoginScreen login={login} loading={loading} />;
}

/* ---------------- App: owns all the state ---------------- */
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  async function login(role) {
    setLoading(true);
    try { setUser(await fakeLogin(role)); }
    finally { setLoading(false); }
  }

  function logout() { setUser(null); }

  return (
    <>
      <Header user={user} logout={logout} />
      <Dashboard user={user} login={login} loading={loading} />
    </>
  );
}

const styles = {
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 24px", borderBottom: "1px solid #ddd",
  },
  avatarBtn: { background: "none", border: "none", cursor: "pointer" },
  dropdown: {
    position: "absolute", right: 0, top: "calc(100% + 8px)", minWidth: 200,
    background: "white", border: "1px solid #ddd", borderRadius: 8,
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)", zIndex: 10,
  },
  menuItem: {
    display: "block", width: "100%", textAlign: "left", padding: "8px 12px",
    background: "none", border: "none", cursor: "pointer",
  },
};
