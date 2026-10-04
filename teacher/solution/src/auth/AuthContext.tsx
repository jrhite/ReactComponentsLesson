// LOGIC (no UI): owns the signed-in user and their permissions,
// and broadcasts both to every component inside <AuthProvider>.

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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
