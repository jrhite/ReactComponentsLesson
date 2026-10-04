// LOGIC (no UI): owns the signed-in user and their permissions,
// and broadcasts both to every component inside <AuthProvider>.

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { fakeLogin } from "../data/fakeApi.js";

const AuthContext = createContext(null);

// Which actions each role may take. Components ask "can I do X?",
// never "is this an admin?", so adding a role only changes this map.
const ROLE_PERMISSIONS = {
  viewer: ["posts:read"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  admin: ["posts:read", "posts:write", "posts:delete", "settings:edit", "users:manage"],
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (role) => {
    setLoading(true);
    try {
      setUser(await fakeLogin(role));
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const permissions = useMemo(() => new Set(user ? ROLE_PERMISSIONS[user.role] : []), [user]);
  const hasPermission = useCallback((perm) => permissions.has(perm), [permissions]);

  // useMemo keeps the same object between renders unless something changed,
  // so consumers don't re-render for no reason.
  const value = useMemo(
    () => ({ user, loading, login, logout, hasPermission }),
    [user, loading, login, logout, hasPermission],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
