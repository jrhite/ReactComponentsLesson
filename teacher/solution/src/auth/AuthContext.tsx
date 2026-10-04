// LOGIC (no UI): owns the signed-in user and their permissions,
// and broadcasts both to every component inside <AuthProvider>.
//
// THREE NAMES, THREE JOBS (they sound alike, so read carefully):
//   AuthContext  - the channel. Created once with createContext(). Holds nothing by itself.
//   AuthProvider - OUR component. Owns the state, then broadcasts it on the channel.
//   useAuth()    - OUR hook. How any component reads from the channel.
// Other components only ever touch AuthProvider (once, in main.tsx) and useAuth().
//
// CONTEXT IS RIGHT HERE: there is one signed-in user for the whole app, and
// components all over the tree need it (UserMenu, ProfileCard, App, <Can>).
// Passing it as a prop meant threading it through components that ignore it.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { fakeLogin } from "../data/fakeApi";
import type { Role, User } from "../types";

export type Permission =
  "posts:read" | "posts:write" | "posts:delete" | "settings:edit" | "users:manage";

// Which actions each role may take. Components ask "can I do X?",
// never "is this an admin?", so adding a role only changes this map.
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["posts:read"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  admin: ["posts:read", "posts:write", "posts:delete", "settings:edit", "users:manage"],
};

// Everything a component can get from useAuth()
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (role: Role) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

// The channel. `null` is what useContext returns if no provider is above it.
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (role: Role) => {
    setLoading(true);
    try {
      setUser(await fakeLogin(role));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const permissions = useMemo(
    () => new Set<Permission>(user ? ROLE_PERMISSIONS[user.role] : []),
    [user],
  );
  const hasPermission = useCallback(
    (permission: Permission) => permissions.has(permission),
    [permissions],
  );

  // useMemo keeps the same object between renders unless something changed,
  // so consumers don't re-render for no reason.
  const value = useMemo(
    () => ({ user, loading, login, logout, hasPermission }),
    [user, loading, login, logout, hasPermission],
  );

  // Broadcast `value` to everything inside. React 19 lets you render the context
  // itself as the provider. Older code (and most tutorials) write the same thing
  // as <AuthContext.Provider value={value}>, which still works but is on its way out.
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
