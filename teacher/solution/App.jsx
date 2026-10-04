// =============================================================
//  SOLUTION — AuthContext + user dropdown + permissions
// =============================================================
import {
  createContext, useContext, useState, useMemo,
  useCallback, useRef, useEffect,
} from "react";

/* ---------------- 1. Auth context ---------------- */
const AuthContext = createContext(null);

const ROLE_PERMISSIONS = {
  admin:  ["posts:read", "posts:write", "posts:delete", "users:manage", "settings:edit"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  viewer: ["posts:read"],
};

async function fakeLogin(role) {
  await new Promise(r => setTimeout(r, 300));
  return { id: 1, name: "Jane Doe", email: "jane@example.com", avatarUrl: "", role };
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const permissions = useMemo(
    () => new Set(user ? ROLE_PERMISSIONS[user.role] ?? [] : []),
    [user]
  );

  const login = useCallback(async (role = "viewer") => {
    setLoading(true);
    try { setUser(await fakeLogin(role)); }
    finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => setUser(null), []);
  const hasPermission = useCallback(perm => permissions.has(perm), [permissions]);

  const value = useMemo(
    () => ({ user, loading, login, logout, hasPermission }),
    [user, loading, login, logout, hasPermission]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ---------------- 2. Permission gate ---------------- */
function Can({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}

/* ---------------- 3. Avatar (still plain props: presentational) ---------------- */
function Avatar({ user, size = 36 }) {
  const initials = user.name.split(" ").map(p => p[0]).join("").toUpperCase();
  const style = {
    width: size, height: size, borderRadius: "50%",
    display: "grid", placeItems: "center",
    background: "#4f46e5", color: "white", fontWeight: 600,
  };
  return <div style={style} aria-label={user.name}>{initials}</div>;
}

/* ---------------- 4. User dropdown (connected) ---------------- */
function UserMenu() {
  const { user, logout, hasPermission } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = e => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        style={styles.avatarBtn}
      >
        <Avatar user={user} />
      </button>

      {open && (
        <div role="menu" style={styles.dropdown}>
          <div style={{ padding: "8px 12px", borderBottom: "1px solid #eee" }}>
            <strong>{user.name}</strong>
            <div style={{ fontSize: 12, color: "#666" }}>{user.email}</div>
            <div style={{ fontSize: 12, color: "#666" }}>Role: {user.role}</div>
          </div>

          <MenuItem onClick={() => alert("Profile")}>Profile</MenuItem>

          {hasPermission("settings:edit") && (
            <MenuItem onClick={() => alert("Settings")}>Settings</MenuItem>
          )}

          <Can permission="users:manage">
            <MenuItem onClick={() => alert("Admin panel")}>Manage users</MenuItem>
          </Can>

          <MenuItem onClick={logout}>Log out</MenuItem>
        </div>
      )}
    </div>
  );
}

function MenuItem({ children, onClick }) {
  return <button role="menuitem" onClick={onClick} style={styles.menuItem}>{children}</button>;
}

/* ---------------- 5. Layout (no auth props anywhere!) ---------------- */
function Header() {
  const { user } = useAuth();
  return (
    <header style={styles.header}>
      <h1 style={{ margin: 0, fontSize: 20 }}>MyApp</h1>
      {user ? <UserMenu /> : <span>Not signed in</span>}
    </header>
  );
}

function LoginScreen() {
  const { login, loading } = useAuth();
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

function PostList() {
  const { user } = useAuth();
  const posts = [{ id: 1, title: "Hello world" }, { id: 2, title: "Context is neat" }];
  return (
    <section style={{ padding: 24 }}>
      <h2>Posts</h2>
      <p>Signed in as <strong>{user.role}</strong></p>

      <Can permission="posts:write" fallback={<p><em>Read-only access</em></p>}>
        <button>+ New post</button>
      </Can>

      <ul>
        {posts.map(p => (
          <li key={p.id}>
            {p.title}{" "}
            <Can permission="posts:write"><button>Edit</button></Can>{" "}
            <Can permission="posts:delete"><button>Delete</button></Can>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Dashboard() {
  const { user } = useAuth();
  return user ? <PostList /> : <LoginScreen />;
}

/* ---------------- 6. App root ---------------- */
export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Dashboard />
    </AuthProvider>
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
