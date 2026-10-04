# React Components & Context: 50-Minute Lesson

## Lesson overview

Students look at a small React app, Team Blog, through the **Component Anatomy Lab** first: what each component is, which ones are reused, and where each gets its data. Then they refactor the real code to match what they saw: they move the signed-in user into Context and replace hand-written role checks with a `<Can>` component.

Every outlined box in the lab is one file in `src/components`, so students can always point at a box and open the matching file.

**Audience:** students who know JSX, props, `useState`, and basic `useEffect`. They don't need any prior experience with Context.

**Learning objectives.** By the end of class, students can:

1. Explain why an app is split into components, and name each component's single job.
2. Tell layout, feature, presentational, and logic-only components apart.
3. Spot prop drilling: a component receiving props it only passes along.
4. Build an `AuthProvider` and a `useAuth` hook, and use them instead of props.
5. Decide whether data should come from props or from context.
6. Judge component size: when a split is too coarse and when it's too fine.

**Materials**

- This repo: the starter code is in `src/`, and the finished code is in `teacher/solution/src/`
- The Component Anatomy Lab at `http://localhost:5173/anatomy.html` while the app is running
- A projector. Students follow along in VS Code on their own machines
- The exit ticket in Segment 6

**Key vocabulary:** component · props · layout / feature / presentational component · prop drilling · context · Provider · `useContext` · custom hook · permission

## Project map

```
src/
├─ main.jsx               renders <App />
├─ App.jsx                owns the user (starter) / picks a screen (finished)
├─ styles.css             all styling; nothing to edit
├─ data/fakeApi.js        pretend server: fakeLogin(), fetchPosts()
├─ components/
│  ├─ Header.jsx          layout
│  ├─ UserMenu.jsx        feature: avatar + dropdown
│  ├─ PostList.jsx        feature: loads posts
│  ├─ PostCard.jsx        presentational: one post
│  ├─ ProfileCard.jsx     feature: the signed-in user
│  ├─ LoginScreen.jsx     feature: pick a role
│  ├─ Avatar.jsx          presentational, used 5 times
│  ├─ Button.jsx          presentational, used everywhere
│  └─ Tag.jsx             presentational
└─ auth/                  ← students create this today
   ├─ AuthContext.jsx     AuthProvider + useAuth
   └─ Can.jsx             permission gate
```

## Setup

**Before class (about 5 minutes):**

1. Make sure your copy of this repo is **public**, so students can fork it.
2. Share the repo URL and ask students to arrive with it cloned and `npm install` already run. The README walks them through it. They need Node.js 18 or newer.
3. On your own machine, run `npm run dev` and `npm run solution`. Sign in as each role on both, at ports 5173 and 5174, and confirm the posts load.
4. Open `http://localhost:5173/anatomy.html` and confirm the lab loads.

**At the start of class:** every student runs `npm run dev` in VS Code's terminal and has the app open in a browser tab. Anyone whose install failed can pair with a neighbor for Segments 1–2 while it finishes.

**Projector layout:** VS Code on the left, the browser on the right. Keep one tab on the app and one on the lab. The app reloads every time you save.

**Note:** anyone who forks the repo can see the `teacher/` folder, including the solution. If that matters, move `teacher/` to a private repo before sharing.

**Fallback if a student gets stuck:** copy any single file from `teacher/solution/src/` over the matching file in `src/`. The files are designed to swap one at a time.

**If `npm run dev` fails:** check `node -v` (it must be 18 or newer), then delete `node_modules` and run `npm install` again. If port 5173 is in use, Vite picks the next free port and prints it in the terminal.

## Agenda

| Time | Segment | Mode | Students leave with |
| --- | --- | --- | --- |
| 0–8 min | 1. Tour the lab | Whole class, lab on screen | Each component's job and kind |
| 8–15 min | 2. Trace the data | Lab + read code in pairs | Prop drilling spotted; context explained |
| 15–28 min | 3. Build `AuthProvider` + `useAuth` | Live code-along | No auth props left |
| 28–38 min | 4. Permissions with `<Can>` | Code-along, then pairs | Every role check replaced |
| 38–45 min | 5. Too big or too small? | Discussion | A rule for component size |
| 45–50 min | 6. Exit ticket | Individual | Exit ticket answers, homework |

**If you run long:** in Segment 4, give students `Can.jsx` ready-made so they only use it, and shorten Segment 5 to the first question.

## Segment 1: Tour the lab (0–8 min)

Students see the app as a set of named pieces before they read any code.

**Setup:** open the lab with **Lens: What kind?** and **Code: Starter** selected.

**Do (3 min).** Click through a few boxes and read the inspector aloud: the file path, the kind, and "why it's a component." Keep the code open next to it, and have students open `src/components/PostCard.jsx` while the PostCard box is selected. Every box is one file.

**The four kinds (2 min):**

| Kind | What it does | Example |
| --- | --- | --- |
| Layout | Arranges other components | Header, App |
| Feature | Has its own data or state | UserMenu, PostList |
| Presentational | Shows whatever props it's given | Avatar, PostCard, Button |
| Logic only | No UI of its own | (none yet; two arrive today) |

**Switch to the Reuse lens (3 min).** Avatar is written once and used 5 times, and Button is used on every post. Ask the prompt on screen: *"What would it take to make every avatar square if each one were hand-written markup?"* (You'd edit five places and probably miss one.)

**Ask:** "Why is Avatar its own file, but the menu items inside UserMenu aren't?" Don't settle it yet; you come back to it in Segment 5.

## Segment 2: Trace the data (8–15 min)

Students find the props that only pass through, then learn the tool that fixes it.

**Switch to Lens: Data flow, Code: Starter (2 min).** Orange boxes receive props they never use. Header and PostList are orange.

**Read and predict (3 min, pairs).** Have pairs trace `user` in the code, from `App.jsx` to the Delete button in `PostCard.jsx`, and answer:

1. Which components receive `user` without using it? *(Header passes it straight to UserMenu, and PostList uses it once but mostly passes it on.)*
2. Why does PostCard need `user`? *(Only to decide whether to show Edit and Delete.)*
3. What would you change to add a new role, such as `moderator`? *(Every `user.role === …` check, in three files.)*

Name it on the board: **prop drilling** means passing data through components that don't need it, just to reach one that does.

**Context in two minutes.** Context is a broadcast channel. A **Provider** high in the tree sends a value, and any component inside it can read that value with `useContext`. Components in between don't touch it.

```jsx
const AuthContext = createContext(null);                // the channel
<AuthContext.Provider value={...}>...</...>             // the broadcaster
const auth = useContext(AuthContext);                   // a receiver, anywhere below
```

If no Provider is above, `useContext` returns the default value you passed to `createContext`, which is `null` here.

**Flip Code to Finished for 10 seconds.** The orange boxes are gone, and Header shows "No data." "That's where we're going."

## Segment 3: Build AuthProvider + useAuth (15–28 min)

Students move the user out of `App` and into a Provider, then delete every auth prop.

**Step 1: create `src/auth/AuthContext.jsx` (5 min).** Move the `useState` and `login`/`logout` code out of `App.jsx` into this file:

```jsx
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { fakeLogin } from "../data/fakeApi.js";

const AuthContext = createContext(null);

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

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

Say this out loud: "It's the same state App had. We moved it into a component whose only job is to own it and share it." `useMemo` and `useCallback` keep the value from changing on every render; don't go deeper unless someone asks.

Ask: "Why does `useAuth` throw instead of returning `null`?" *(A forgotten Provider fails loudly instead of quietly breaking something later.)*

**Step 2: wrap the app in `main.jsx` (1 min):**

```jsx
import { AuthProvider } from "./auth/AuthContext.jsx";
// ...
<StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</StrictMode>
```

**Step 3: delete the props, one file at a time (6 min).** In each file, remove the auth props from the function's parameters and add one line that asks for what the component needs:

| File | Remove | Add |
| --- | --- | --- |
| `App.jsx` | `useState`, `login`, `logout`, and every auth prop it passes | `const { user } = useAuth();` |
| `Header.jsx` | `{ user, logout }` and the props on `<UserMenu>` | nothing |
| `UserMenu.jsx` | `{ user, logout }` | `const { user, logout } = useAuth();` |
| `ProfileCard.jsx` | `{ user }` | `const { user } = useAuth();` |
| `LoginScreen.jsx` | `{ login, loading }` | `const { login, loading } = useAuth();` |
| `PostList.jsx` | `{ user }` and `user={user}` on PostCard | `const { user } = useAuth();` *(temporary)* |
| `PostCard.jsx` | `user` from `{ post, user }` | `const { user } = useAuth();` *(temporary)* |

**Checkpoint:** sign in and out as each role. The app should behave exactly as before. If the screen goes blank, open the console: the error from `useAuth` names the problem.

**Point out the cost:** PostCard now calls `useAuth()` just for two role checks. That makes it depend on auth, so it can't be rendered in a test without a Provider. Segment 4 fixes that.

## Segment 4: Permissions with Can (28–38 min)

Students replace every hand-written role check with a permission check.

**Teacher adds permissions to `AuthContext.jsx` (3 min).** Add this above `AuthProvider`:

```jsx
const ROLE_PERMISSIONS = {
  viewer: ["posts:read"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  admin: ["posts:read", "posts:write", "posts:delete", "settings:edit", "users:manage"],
};
```

Inside `AuthProvider`, add this, then add `hasPermission` to `value` and to its dependency list:

```jsx
const permissions = useMemo(() => new Set(user ? ROLE_PERMISSIONS[user.role] : []), [user]);
const hasPermission = useCallback((perm) => permissions.has(perm), [permissions]);
```

The key idea: components ask "can I do X?", never "is this an admin?" Adding a role then means editing one map.

**Create `src/auth/Can.jsx` together (2 min):**

```jsx
import { useAuth } from "./AuthContext.jsx";

export default function Can({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();
  return hasPermission(permission) ? children : fallback;
}
```

**Pair exercise (5 min).** Replace every `user.role` check with `<Can>`:

1. `UserMenu.jsx`: wrap **Settings** in `settings:edit` and **Manage users** in `users:manage`.
2. `PostList.jsx`: wrap **+ New post** in `posts:write`, with `fallback={<span className="muted small">Read-only access</span>}`. Then delete `useAuth` from PostList, because it no longer needs the user.
3. `PostCard.jsx`: wrap **Edit** in `posts:write` and **Delete** in `posts:delete`. Then delete `useAuth` from PostCard.
4. Test each role and check the results against this table:

| Role | New post | Edit | Delete | Settings | Manage users |
| --- | --- | --- | --- | --- | --- |
| viewer | No (shows Read-only) | No | No | No | No |
| editor | Yes | Yes | No | Yes | No |
| admin | Yes | Yes | Yes | Yes | Yes |

**Checkpoint:** in the lab, set **Code: Finished** and **Lens: Data flow**. Students' code should now match it: PostCard takes only `post`, and the purple boxes are the only components that read context.

**Must-say:** hiding a button is about the user experience, not security. Anyone can call your API from the browser console, so the server has to check the same permissions on every request.

## Segment 5: Too big or too small? (38–45 min)

Students decide how fine-grained components should be.

Put the lab's **Rules to take away** section on screen. Then ask the class to vote on each proposal, and have someone defend each side:

1. **"Extract PostTitle into its own component."** *(No. It's one `<h3>` used in one place, with no state and no logic. It adds a file and an import but no meaning.)*
2. **"Extract the dropdown's menu items into a MenuItem component."** *(Debatable. They repeat four times, but only inside one file and they're one tag each. Extract it once a second menu needs the same item.)*
3. **"Make Avatar call `useAuth()` so we don't have to pass `name`."** *(No. Then Avatar could only ever show the signed-in user, never a post's author.)*
4. **"Put the whole post list, cards included, in PostList.jsx."** *(No. That's too coarse: PostCard's markup would sit inside a loop, and you couldn't reuse or test a single card.)*

Land on the rule: **extract a component when it repeats, has one job you can name, owns its own state, or needs testing on its own. Otherwise, keep it as plain JSX.**

## Segment 6: Exit ticket and homework (45–50 min)

**Exit ticket (3 min, individual):**

1. Name one presentational component and one feature component in Team Blog, and say what makes each one that kind.
2. Before the refactor, why was Header receiving `user` and `logout`? What changed after?
3. Why does PostCard take `post` as a prop instead of reading posts from context?

*Look-fors:* (1) presentational components show their props; feature components own data or read context. (2) Header only passed them along to UserMenu, which is prop drilling; now UserMenu reads context itself. (3) PostCard should show *any* post, so the caller decides which one.

**Homework (pick one):**

- **Core:** Add a `moderator` role that can read, write, and delete posts but can't edit settings or manage users. Change only `ROLE_PERMISSIONS`, then write two sentences on why no component needed to change.
- **Stretch:** Build a `PostDetail` page that shows one post with its full text. Reuse `Avatar`, `Tag`, `Button`, and `Can`. Which new components did you need, and why?
- **Challenge:** Add a theme toggle (light or dark) using a second context, `ThemeContext`. Explain why theme belongs in context but the post data doesn't.

## Common mistakes

| Symptom | Cause | Fix |
| --- | --- | --- |
| "useAuth must be used inside &lt;AuthProvider&gt;" | `main.jsx` doesn't wrap `<App />` | Wrap `<App />` in `<AuthProvider>` in `main.jsx` |
| `useAuth is not defined` | Missing import | `import { useAuth } from "../auth/AuthContext.jsx";` (one `../` from `components/`) |
| `Cannot read properties of null (reading 'name')` | A component used `user` while signed out | Keep the `if (!user)` check in UserMenu and the `user ? … : …` check in App |
| Buttons never appear for any role | `hasPermission` wasn't added to `value` or its dependency list | Add it to both |
| Header still passes props | Old props left on `<UserMenu user={user} … />` | Change it to `<UserMenu />` |

**For students who finish early:** remove the `useMemo` around `value`, add a `console.log` in PostCard, and count the extra renders when the menu opens. Then explain why the `useMemo` is there.
