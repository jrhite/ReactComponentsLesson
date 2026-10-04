# React Context & Auth: 50-Minute Replit Lesson

## Lesson overview

Students refactor a prop-drilled React app into one that shares auth state through Context. Then they add a user dropdown and role-based permissions. The class follows a read-before-write rhythm: students predict and trace code before they change it.

**Audience:** students who know components, props, `useState`, and basic `useEffect`. No prior Context experience is needed.

**Learning objectives.** By the end of class, students can:

1. Explain prop drilling and why it becomes a problem as an app grows.
2. Define *context*, *Provider*, *consumer*, and *default value*, and say what `useContext` returns with and without a Provider.
3. Build an `AuthProvider` and a `useAuth` custom hook that throws a clear error when the Provider is missing.
4. Decide when a component should read context versus receive props (connected vs. presentational).
5. Gate UI with permissions using `hasPermission()` and a `<Can>` component, and state why UI gating is not security.

**Materials**

- This repo: `src/App.jsx` is the student starter, and `teacher/solution/App.jsx` is the finished build
- The Component Anatomy Lab (`/anatomy.html` in the running app) for the opening discussion or a follow-up class
- Projector for live code-along; students follow along in their own Repls
- Exit ticket (3 questions, in Segment 6)

**Key vocabulary:** prop drilling · context · Provider · consumer · default value · custom hook · presentational component · permission · role

## Setup (before class, ~5 minutes)

1. Make sure your copy of this repo is **public**, so students can fork or import it.
2. Test the import yourself on Replit: **Create Repl → Import from GitHub**, then paste the repo URL.
3. Click **Run** and confirm the login screen shows three buttons: viewer, editor, admin.
4. Open `/anatomy.html` in the preview pane (add it to the end of the preview URL) to check that the Component Anatomy Lab loads.
5. Share the repo URL with students. Each student forks it on GitHub or imports it into their own Repl.

**Note:** the `teacher/` folder, including the solution, is visible to anyone who forks the repo. If that's a concern, move `teacher/` to a private repo before sharing.

**Fallback if a student's Repl breaks mid-class:** paste the code from the matching checkpoint in this plan, or paste `teacher/solution/App.jsx` into `src/App.jsx` and keep following along.

## Agenda

The class runs in six segments. Roughly half the time is students typing in their own Repls.

| Time | Segment | Mode | Students leave with |
| --- | --- | --- | --- |
| 0–7 min | 1. Hook: feel the prop-drilling pain | Read + predict | A count of props passed through components that never use them |
| 7–15 min | 2. Core concepts and vocabulary | Mini-lecture + check | Context, Provider, consumer, default value defined |
| 15–27 min | 3. Build `AuthProvider` + `useAuth` | Live code-along | Prop drilling removed, app still works |
| 27–37 min | 4. Connected `UserMenu` dropdown | Code-along + discussion | Dropdown reads context; Avatar stays presentational |
| 37–45 min | 5. Permissions with `<Can>` | Pair exercise | Buttons that appear or hide by role |
| 45–50 min | 6. Wrap-up + exit ticket | Individual | Exit ticket answers, homework |

**If you run long:** cut the Escape-key handler in Segment 4, and give students the `<Can>` component in Segment 5 so they only apply it.

## Segment 1: Hook — feel the prop-drilling pain (0–7 min)

Students trace the starter code and discover that most components carry auth data they never use.

**Do (2 min):** Students import the repo, click Run, and log in as each role. Everything works.

**Read and predict (3 min, pairs).** Project `src/App.jsx`. Have pairs trace `logout` from `App` to the button that calls it, writing down every component it passes through. Then answer:

1. Which components receive `logout` but never call it? *(Header.)*
2. Which receive `user` only to hand it down? *(Dashboard. Header uses it for just one check.)*
3. How many files would you edit to show the user's email inside `PostList`? *(Easy here, but imagine six layers deep.)*

**Name it (2 min).** Write **prop drilling** on the board: passing data through components that don't need it, just to reach one that does. Draw the tree:

```
App  (owns user, login, logout, loading)
├─ Header        ← user, logout   (passes logout through)
│   └─ UserMenu  ← user, logout
│       └─ Avatar ← user
└─ Dashboard     ← user, login, loading   (passes all through)
    ├─ LoginScreen ← login, loading
    └─ PostList    ← user
```

**Transition line:** "What if any component could just *ask* for the user, without its parents carrying it?"

## Segment 2: Core concepts and vocabulary (7–15 min)

Context is a broadcast channel: a Provider sends a value, and any component below it can tune in with `useContext`.

**Analogy (2 min): a radio station.**

| Radio | React | Code |
| --- | --- | --- |
| Building a frequency | Creating a context | `createContext(defaultValue)` |
| The station broadcasting | Provider | `<AuthContext.Provider value={...}>` |
| A radio tuning in | Consumer | `useContext(AuthContext)` |
| Static when no station is in range | Default value | The argument to `createContext` |
| Signal range | The Provider's subtree | Only components rendered inside it |

**Show the minimal shape (3 min).** Type this in a scratch file, not the project:

```jsx
const ThemeContext = createContext("light");

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = useContext(ThemeContext); // "dark"
  return <p>{theme}</p>;
}
```

**Check for understanding (3 min, cold call or whiteboards):**

1. If `Child` renders *outside* the Provider, what does `theme` equal? *("light", the default.)*
2. Is a Provider required? *(No, but without one the value is a constant you can never update. That's why real apps always use one.)*
3. When the Provider's `value` changes, who re-renders? *(Every component below it that calls `useContext` on that context.)*

This repo uses React 19, where `<ThemeContext value="dark">` works as shorthand for `.Provider`. The lesson uses `.Provider` because students will see it in most existing code.

## Segment 3: Build AuthProvider + useAuth (15–27 min)

Students move auth state out of `App` into a Provider, then delete every drilled prop. The app should behave exactly as before.

**Step 1 — Create the context and Provider (5 min).** Add this near the top of `App.jsx`, and update the import:

```jsx
import { createContext, useContext, useState, useMemo, useCallback } from "react";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (role = "viewer") => {
    setLoading(true);
    try { setUser(await fakeLogin(role)); }
    finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

Think aloud: "This is the same state `App` had. We just moved it into a component whose only job is to own it and broadcast it." Skip a deep dive on `useMemo`/`useCallback`. Just say they stop every consumer from re-rendering on every Provider render, and come back to it if asked.

**Step 2 — The custom hook with a guard (2 min):**

```jsx
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

Ask: "Why default to `null` and throw, instead of using a fake user?" *(A forgotten Provider fails loudly instead of silently showing wrong data.)*

**Step 3 — Wrap the app and delete props (5 min).** Replace `App`:

```jsx
export default function App() {
  return (
    <AuthProvider>
      <Header />
      <Dashboard />
    </AuthProvider>
  );
}
```

Then go component by component. Remove the props from each signature and replace them with one line, such as `const { user, logout } = useAuth();`, picking only what that component uses. `Dashboard` needs only `user`; `LoginScreen` needs `login` and `loading`.

**Checkpoint:** log in and out as each role. If the screen goes blank, open the browser console, where the guard's error message usually names the problem.

**Quick demo of the guard (30 sec):** temporarily move `<Header />` outside `<AuthProvider>` and show the error, then move it back.

## Segment 4: Connected UserMenu dropdown (27–37 min)

`UserMenu` reads auth from context and gains a user-info header and click-outside closing. `Avatar` keeps taking a prop on purpose.

**Discussion first (3 min): should `Avatar` call `useAuth()` too?** Let students argue both sides, then land on this rule:

- **Connected component:** knows *where* the data lives (calls `useAuth`). Example: `UserMenu`.
- **Presentational component:** only knows *how* to display what it's given (props). Example: `Avatar`.

`Avatar` stays presentational so it can show *any* user: a comment author, a teammate list, or a test with fake data. If it called `useAuth`, it could only ever show the logged-in user.

**Code-along (5 min).** Update `UserMenu`, and add `useRef` and `useEffect` to the import:

```jsx
function UserMenu() {
  const { user, logout } = useAuth();
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
      <button onClick={() => setOpen(o => !o)} aria-haspopup="menu"
              aria-expanded={open} style={styles.avatarBtn}>
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
          <MenuItem onClick={() => alert("Settings")}>Settings</MenuItem>
          <MenuItem onClick={logout}>Log out</MenuItem>
        </div>
      )}
    </div>
  );
}
```

**Trace together (2 min).** Have students read the `useEffect` line by line and answer in their own words:

1. Why `if (!open) return;`? *(There are no listeners while the menu is closed.)*
2. What does the returned function do, and when does it run? *(It removes the listeners when the menu closes or the component unmounts. Without it, listeners pile up.)*
3. Why `menuRef.current.contains(e.target)`? *(Clicks inside the menu shouldn't close it.)*

**Checkpoint:** open the menu, click elsewhere, then press Escape. Both should close it.

## Segment 5: Permissions with hasPermission and Can (37–45 min)

You add the permission engine to the Provider (3 min); then pairs build `<Can>` and gate the UI themselves (5 min).

**Teacher adds (3 min).** Above `AuthProvider`:

```jsx
const ROLE_PERMISSIONS = {
  admin:  ["posts:read", "posts:write", "posts:delete", "users:manage", "settings:edit"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  viewer: ["posts:read"],
};
```

Inside `AuthProvider`, add the following, then add `hasPermission` to `value` and to its dependency list:

```jsx
const permissions = useMemo(
  () => new Set(user ? ROLE_PERMISSIONS[user.role] ?? [] : []),
  [user]
);
const hasPermission = useCallback(perm => permissions.has(perm), [permissions]);
```

Key idea to say out loud: components ask *"can I do X?"*, never *"is this an admin?"* Adding a role later means editing one map, not hunting through every component.

**Pair exercise (5 min).** Put this on screen:

1. Write a `Can` component that takes `permission`, `children`, and an optional `fallback`. It shows `children` only if the user has that permission. *(Hint: it's 3 lines and calls `useAuth`.)*
2. In `PostList`, gate **+ New post** and **Edit** with `posts:write`, and **Delete** with `posts:delete`. Show *Read-only access* as the fallback for New post.
3. In `UserMenu`, show **Settings** only with `settings:edit`, and add a **Manage users** item for `users:manage`.
4. Test as viewer, editor, and admin, and record what each role sees.

**Answer for step 1:**

```jsx
function Can({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}
```

**Expected results for step 4:**

| Role | New post | Edit | Delete | Settings | Manage users |
| --- | --- | --- | --- | --- | --- |
| viewer | No (shows Read-only) | No | No | No | No |
| editor | Yes | Yes | No | Yes | No |
| admin | Yes | Yes | Yes | Yes | Yes |

**Must-say before moving on:** hiding a button is UX, not security. Anyone can call your API from the browser console, so the server has to check the same permissions on every request.

## Segment 6: Wrap-up, exit ticket, homework (45–50 min)

Students explain the pattern back in their own words before leaving.

**Recap (1 min).** Redraw the Segment 1 tree. Now `App` passes nothing: `AuthProvider` wraps everything, and each component that needs auth calls `useAuth()` directly.

**Exit ticket (3 min, individual, on paper or as a Replit comment):**

1. In one sentence, what problem does Context solve?
2. What does `useContext(AuthContext)` return if there is no `AuthProvider` above it? Why does our `useAuth` throw in that case?
3. A teammate hides the Delete button for viewers and says the feature is secure. What do you tell them?

*Look-fors:* (1) mentions passing data through components that don't need it; (2) says "`null`, the default" and explains failing loudly; (3) says the server must enforce permissions too.

**Homework (assign in the last minute).** Pick one:

- **Core:** Add a `moderator` role that can read, write, and delete posts but can't edit settings or manage users. Change only `ROLE_PERMISSIONS`. Write two sentences on why no component needed to change.
- **Stretch:** Add an `updateProfile(changes)` function to the context and a Profile form in the dropdown that changes the user's name. Confirm the avatar initials update everywhere.
- **Challenge:** Persist the session so a page refresh keeps the user logged in. Explain one security risk of your approach.

## Common mistakes and differentiation

Most stuck students hit one of five errors, and the first two cause most of the trouble.

| Symptom | Cause | Fix |
| --- | --- | --- |
| "useAuth must be used inside &lt;AuthProvider&gt;" | Component rendered outside the Provider, or `App` not updated | Wrap `<Header />` and `<Dashboard />` in `<AuthProvider>` |
| `createContext is not defined` (or `useRef`, `useEffect`, etc.) | Missing from the React import line | Add it to `import { … } from "react"` |
| `Cannot read properties of null (reading 'name')` | `UserMenu` or `PostList` rendered while `user` is `null` | Keep the `user ? … : …` checks in `Header` and `Dashboard` |
| A new permission never shows up | `hasPermission` added to the Provider but not to `value` (or its deps) | Add it to both the object and the dependency array |
| Dropdown never closes on an outside click | `ref={menuRef}` missing from the wrapper `div` | Attach the ref to the outermost `div` of `UserMenu` |

**Support for students who fall behind:**

- Give them the checkpoint code for the segment they're on so they can rejoin the group.
- In Segment 5, give them the `Can` component and have them only apply it.
- Pair them with a student who finished the previous checkpoint.

**Extensions for students who finish early:**

- Explain in writing why `value` is wrapped in `useMemo`. Then remove it and use the React DevTools profiler (or a `console.log` in `PostList`) to show the extra renders.
- Split the file into `auth/AuthContext.jsx`, `components/UserMenu.jsx`, and so on, exporting `AuthProvider` and `useAuth`.
- Rewrite `<AuthContext.Provider value={value}>` with the React 19 shorthand and confirm it still works.
