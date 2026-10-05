# Code steps

The code to type during the lesson, in order. Your teacher (or the voice teacher) will tell you which step you're on. **Type it; don't paste it.** Your fingers remember better than your eyes.

Check your work any time with `npm run typecheck`. No output means no errors.

## Step 1: the channel

Create `src/auth/AuthContext.tsx`:

```tsx
import { createContext } from "react";
import type { Role, User } from "../types";

// Everything a component can get from useAuth()
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (role: Role) => Promise<void>;
  logout: () => void;
}

// The channel. `null` is what you get if nobody is broadcasting.
const AuthContext = createContext<AuthContextValue | null>(null);
```

## Step 2: the station

Update the imports at the top:

```tsx
import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { fakeLogin } from "../data/fakeApi";
import type { Role, User } from "../types";
```

Add below the `createContext` line:

```tsx
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

  // useMemo keeps the same object between renders unless something changed
  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
```

## Step 3: the listener

Add `useContext` to the first import, then add at the bottom of the file:

```tsx
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

## Step 4: wire it up

`src/main.tsx`:

```tsx
import { AuthProvider } from "./auth/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
```

`src/App.tsx`: delete the `useState` import, the `fakeLogin`, `Role` and `User` imports, both `useState` lines, `login` and `logout`. Then:

```tsx
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { user } = useAuth();
  // ...the return stays the same for now
}
```

Next, delete `user` and `logout` from `HeaderProps` in `Header.tsx`, and look at the red squiggles. Open **View → Problems** and work down the list, one file at a time:

`Header.tsx` takes no props:

```tsx
export default function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">
        <span className="logo-mark" />
        Team Blog
      </a>
      <UserMenu />
    </header>
  );
}
```

`UserMenu.tsx`: remove the props interface and start the component with:

```tsx
import { useAuth } from "../auth/AuthContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  // ...rest unchanged
```

`App.tsx`:

```tsx
<Header />
{user ? (
  <div className="page">
    <PostList />
    <ProfileCard />
  </div>
) : (
  <LoginScreen />
)}
```

Do the same for `PostList`, `ProfileCard`, and `LoginScreen`: delete the auth props and add one `useAuth()` line for what the body uses. `ProfileCard` also needs `if (!user) return null;` because the user can be `null`. Leave `PostCard` alone for now; `PostList` still passes it `user`.

## Step 5: the permission map

In `AuthContext.tsx`, above `AuthContextValue`:

```tsx
export type Permission =
  "posts:read" | "posts:write" | "posts:delete" | "settings:edit" | "users:manage";

// Which actions each role may take. Components ask "can I do X?",
// never "is this an admin?", so adding a role only changes this map.
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["posts:read"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  admin: ["posts:read", "posts:write", "posts:delete", "settings:edit", "users:manage"],
};
```

Add one line to `AuthContextValue`:

```tsx
hasPermission: (permission: Permission) => boolean;
```

In `AuthProvider`, above `value`, then extend `value` to include `hasPermission`:

```tsx
const permissions = useMemo(
  () => new Set<Permission>(user ? ROLE_PERMISSIONS[user.role] : []),
  [user],
);
const hasPermission = useCallback(
  (permission: Permission) => permissions.has(permission),
  [permissions],
);

const value = useMemo(
  () => ({ user, loading, login, logout, hasPermission }),
  [user, loading, login, logout, hasPermission],
);
```

## Step 6: the gatekeeper

Create `src/auth/Can.tsx`:

```tsx
// LOGIC (no UI): shows its children only if the signed-in user has the permission.
import type { ReactNode } from "react";
import { useAuth, type Permission } from "./AuthContext";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({ permission, children, fallback = null }: CanProps) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}
```

## Step 7: replace every hand-written role check

`UserMenu.tsx`: add `import Can from "../auth/Can";` and replace the two role checks:

```tsx
<Can permission="settings:edit">
  <button type="button" role="menuitem" className="menu-item">
    Settings
  </button>
</Can>
<Can permission="users:manage">
  <button type="button" role="menuitem" className="menu-item">
    Manage users
  </button>
</Can>
```

`PostCard.tsx`: add the `Can` import, remove `User` from the type import, delete `user` from the props and the function signature, delete `canEdit` and `canDelete`, then:

```tsx
<div className="actions">
  <Can permission="posts:write">
    <Button>Edit</Button>
  </Can>
  <Can permission="posts:delete">
    <Button variant="danger">Delete</Button>
  </Can>
</div>
```

`PostList.tsx`: stop passing `user` to `<PostCard>`. If `useAuth()` there has no other use, delete it.

Check: `npm run typecheck` is clean. Sign in as each role. Viewer sees no Edit, Delete or Settings; editor sees Edit and Settings; admin sees everything.

Stuck? The finished version of every file is in `teacher/solution/src/`.
