# React Components & Context: 50-Minute Lesson

## Lesson overview

Students look at a small React + TypeScript app, Team Blog, through the **Component Anatomy Lab** first: what each component is, which ones are reused, and where each gets its data. Then they refactor the real code to match what they saw: they move the signed-in user into Context and replace hand-written role checks with a `<Can>` component.

Every outlined box in the lab is one file in `src/components`, so students can always point at a box and open the matching file. TypeScript helps with the refactor: when students remove a prop, VS Code underlines every place that still passes it.

### The two ideas this lesson is built on

**1. Every component is one of four kinds.** Students should be able to name the kind of any component in the app by the end of class. The comment at the top of each file names it, and the lab's **What kind?** lens colors each component by kind.

| Kind of component | What it does | In Team Blog |
| --- | --- | --- |
| Layout | Arranges other components. Holds no data of its own. | `App`, `Header` |
| Feature | Owns data or state, or reads it from context. | `UserMenu`, `PostList`, `ProfileCard`, `LoginScreen` |
| Presentational | Shows exactly what its props say. Easy to reuse and test. | `PostCard`, `Avatar`, `Button`, `Tag` |
| Logic only | Has no UI of its own; provides data or makes a decision. | `AuthProvider`, `Can` (built in class) |

**2. Props and context answer different questions.** Ask: *does every component need the same value, or does each one need its own?*

| | Context | Props |
| --- | --- | --- |
| Use it for | One value the whole app shares | A value that differs from child to child |
| In Team Blog | The signed-in user (`useAuth()`) | Each `PostCard`'s `post`; `Avatar`'s `name` |
| Why not the other? | As a prop, the user gets threaded through components that ignore it | As context, every PostCard would get the same post |

The code marks both: search for `PROPS ARE RIGHT HERE` (starter and solution) and `CONTEXT IS RIGHT HERE` (solution). The finished `ProfileCard.tsx` shows both in one file.

The refactor only moves `user` into context. **`post` and `name` stay props, on purpose.** Say this explicitly, or students leave thinking "context good, props bad."

**Audience:** students who know JSX, props, `useState`, and basic `useEffect`, and who have seen TypeScript types and interfaces. They don't need any prior experience with Context.

**Learning objectives.** By the end of class, students can:

1. Explain why an app is split into components, and name each component's single job.
2. Tell layout, feature, presentational, and logic-only components apart.
3. Read a component's props interface to see exactly what it depends on.
4. Spot prop drilling: a component receiving props it only passes along.
5. Build a typed `AuthProvider` and `useAuth` hook, and use them instead of props.
6. Decide whether data should come from props or from context.
7. Judge component size: when a split is too coarse and when it's too fine.

**Materials**

- This repo: the starter code is in `src/`, and the finished code is in `teacher/solution/src/`
- The Component Anatomy Lab: the **Component Anatomy Lab ↗** button in the app's bottom-right corner opens it at `http://localhost:5173/anatomy.html`
- A projector. Students follow along in VS Code on their own machines
- The exit ticket in Segment 6

**Key vocabulary:** component · props · props interface · layout / feature / presentational component · prop drilling · context · Provider · `useContext` · custom hook · permission

## Project map

```
src/
├─ main.tsx               renders <App />
├─ App.tsx                owns the user (starter) / picks a screen (finished)
├─ types.ts               Role, User, Post
├─ styles.css             all styling; nothing to edit
├─ data/fakeApi.ts        pretend server: fakeLogin(), fetchPosts()
├─ components/
│  ├─ Header.tsx          layout
│  ├─ UserMenu.tsx        feature: avatar + dropdown
│  ├─ PostList.tsx        feature: loads posts
│  ├─ PostCard.tsx        presentational: one post
│  ├─ ProfileCard.tsx     feature: the signed-in user
│  ├─ LoginScreen.tsx     feature: pick a role
│  ├─ Avatar.tsx          presentational, used 5 times
│  ├─ Button.tsx          presentational, used everywhere
│  └─ Tag.tsx             presentational
└─ auth/                  ← students create this today
   ├─ AuthContext.tsx     AuthProvider + useAuth + Permission type
   └─ Can.tsx             permission gate
```

## Setup

**Before class (about 5 minutes):**

1. Make sure your copy of this repo is **public**, so students can fork it.
2. Share the repo URL and ask students to arrive with it cloned and `npm install` already run. The README walks them through it. They need Node.js 18 or newer.
3. On your own machine, run `npm run dev` and `npm run solution`. Sign in as each role on both, at ports 5173 and 5174, and confirm the posts load.
4. Run `npm run typecheck` and confirm it finishes with no output, which means no errors.
5. Open `http://localhost:5173/anatomy.html` and confirm the lab loads.

**At the start of class:** every student runs `npm run dev` in VS Code's terminal and has the app open in a browser tab. Anyone whose install failed can pair with a neighbor for Segments 1–2 while it finishes.

**Projector layout:** VS Code on the left, the browser on the right. Keep one tab on the app and one on the lab. The app reloads every time you save.

**Note:** anyone who forks the repo can see the `teacher/` folder, including the solution. If that matters, move `teacher/` to a private repo before sharing.

**Fallback if a student gets stuck:** copy any single file from `teacher/solution/src/` over the matching file in `src/`. The files are designed to swap one at a time.

**If `npm run dev` fails:** check `node -v` (it must be 18 or newer), then delete `node_modules` and run `npm install` again. If port 5173 is in use, Vite picks the next free port and prints it in the terminal.

### How TypeScript shows up during class

- `npm run dev` **doesn't stop on type errors**. The app keeps running while you refactor, and VS Code shows the errors as red underlines.
- **The Problems panel** (**View → Problems**) lists every type error in open files. To check the whole project, run `npm run typecheck` in a second terminal.
- **Hovering** over any variable shows its type. Hover over `user` in a few files during Segment 2.

## Agenda

| Time | Segment | Mode | Students leave with |
| --- | --- | --- | --- |
| 0–8 min | 1. Tour the lab | Whole class, lab on screen | Each component's job and kind |
| 8–15 min | 2. Trace the data | Lab + read code in pairs | Prop drilling spotted; context explained |
| 15–28 min | 3. Build `AuthProvider` + `useAuth` | Live code-along | No auth props left |
| 28–38 min | 4. Permissions with `<Can>` | Code-along, then pairs | Every role check replaced |
| 38–45 min | 5. Too big or too small? | Discussion | A rule for component size |
| 45–50 min | 6. Exit ticket | Individual | Exit ticket answers, homework |

**If you run long:** in Segment 4, give students `Can.tsx` ready-made so they only use it, and shorten Segment 5 to the first question.

## Segment 1: Tour the lab (0–8 min)

Students see the app as a set of named pieces before they read any code.

**Setup:** open the lab with **Lens: What kind?** and **Code: Starter** selected.

**Do (3 min).** Click through a few boxes and read the inspector aloud: the file path, the kind, and "why it's a component." Keep the code open next to it, and have students open `src/components/PostCard.tsx` while the PostCard box is selected. Every box is one file.

**Read the props interface (1 min).** Point at the top of `PostCard.tsx`:

```tsx
interface PostCardProps {
  post: Post;
  user: User;
}
```

"The interface is the component's contract: everything it needs from outside. Keep an eye on `user`; we'll come back to it."

**The four kinds of component (2 min).** The **What kind?** lens colors every component by its role. Walk through the four colors in the legend under the lab, using the table in "The two ideas this lesson is built on" above. Have students check the top comment of two or three files (`// LAYOUT:`, `// FEATURE:`, `// PRESENTATIONAL:`). Point out that no logic-only components exist yet, and that two arrive today.

**Switch to the Reuse lens (2 min).** Avatar is written once and used 5 times. Ask the prompt on screen: *"What would it take to make every avatar square if each one were hand-written markup?"* (You'd edit five places and probably miss one.)

**Ask:** "Why is Avatar its own file, but the menu items inside UserMenu aren't?" Don't settle it yet; you come back to it in Segment 5.

## Segment 2: Trace the data (8–15 min)

Students find the props that only pass through, then learn the tool that fixes it.

**Switch to Lens: Data flow, Code: Starter (2 min).** Orange boxes receive props they never use. Header and PostList are orange.

**Read and predict (2 min, pairs).** Have pairs trace `user` in the code, from `App.tsx` to the Delete button in `PostCard.tsx`, by reading each component's props interface. Then answer:

1. Which components declare `user` in their props but never use it themselves? *(Header passes it straight to UserMenu, and PostList uses it once but mostly passes it on.)*
2. Why does PostCard need `user`? *(Only to decide whether to show Edit and Delete.)*
3. What would you change to add a new role, such as `moderator`? *(The `Role` type in `types.ts`, plus every `user.role === …` check, in three files.)*

Name it on the board: **prop drilling** means passing data through components that don't need it, just to reach one that does.

**But not every prop is a problem (1 min).** Open `PostList.tsx` and find the `PROPS ARE RIGHT HERE` comment above `posts.map`. Ask: "Should `post` move into context too?" *(No. Every card needs a different post, and context gives everyone the same value.)* Then compare the two props PostCard receives: `post` differs per card, but `user` is the same for every card. That difference is the whole rule.

**Context in two minutes.** Context is a broadcast channel. A **Provider** high in the tree sends a value, and any component inside it can read that value with `useContext`. Components in between don't touch it.

```tsx
const AuthContext = createContext<AuthContextValue | null>(null);  // the channel
<AuthContext value={...}>...</AuthContext>                          // the broadcaster
const auth = useContext(AuthContext);                               // a receiver, anywhere below
```

If no Provider is above, `useContext` returns the default value you passed to `createContext`, which is `null` here. That's why the type includes `| null`.

Students will see `<AuthContext.Provider value={...}>` in most tutorials and existing code. It's the older way to write the same thing. React 19 lets you render the context itself as the provider, and the React team plans to deprecate `.Provider` eventually. Both work in this project.

**Flip Code to Finished for 10 seconds.** The orange boxes are gone, and Header shows "No data." "That's where we're going."

## Segment 3: Build AuthProvider + useAuth (15–28 min)

Students move the user out of `App` and into a Provider, then delete every auth prop, using TypeScript errors as a checklist.

**Step 1: create `src/auth/AuthContext.tsx` (5 min).** Move the `useState` and `login`/`logout` code out of `App.tsx` into this file:

```tsx
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { fakeLogin } from "../data/fakeApi";
import type { Role, User } from "../types";

// Everything a component can get from useAuth()
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (role: Role) => Promise<void>;
  logout: () => void;
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

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

> **Callout: three names that sound alike.** This file is confusing on first read because three pieces share almost the same name. Put this table on the board before going further.
>
> | Name | What it is | Who uses it |
> | --- | --- | --- |
> | `AuthContext` | The **channel**, made once with `createContext()`. It holds no data by itself. | Only this file |
> | `AuthProvider` | **Our component.** It owns the user state and broadcasts it on the channel. | `main.tsx`, once |
> | `useAuth()` | **Our hook.** It reads from the channel. | Every component that needs auth |
> | `AuthContext.Provider` | The **older syntax** for broadcasting, which you'll see in tutorials. Same job as `<AuthContext value={...}>`. | Nobody here |
>
> **"Why not just use `AuthContext` directly?"** You could, but wrapping it is the standard pattern, for three reasons:
>
> 1. **State has to live in a component.** `useState` only works inside a component, so something has to own the user. `AuthProvider` is that component.
> 2. **One way in, one way out.** `AuthContext` isn't exported. Other files can't broadcast a different value or read it the wrong way; they go through `AuthProvider` and `useAuth()`.
> 3. **The hook hides the boilerplate.** Without `useAuth`, every component would repeat `useContext(AuthContext)` plus a `null` check. With it, components write one line and TypeScript knows the result is never `null`.

Say this out loud: "It's the same state App had. We moved it into a component whose only job is to own it and share it. `AuthContextValue` is the context's contract, just like a props interface." `useMemo` and `useCallback` keep the value from changing on every render; don't go deeper unless someone asks.

Ask: "Why does `useAuth` throw instead of returning `null`?" *(A forgotten Provider fails loudly. It also means `useAuth()` always returns an `AuthContextValue`, so components never need to null-check the context itself.)*

**Step 2: wrap the app in `main.tsx` (1 min):**

```tsx
import { AuthProvider } from "./auth/AuthContext";
// ...
<StrictMode>
  <AuthProvider>
    <App />
  </AuthProvider>
</StrictMode>
```

**Step 3: delete the props, letting TypeScript guide you (6 min).** Start at the top, with `App.tsx`. Delete its `useState`, `login`, and `logout`, add `const { user } = useAuth();`, and remove every auth prop from the JSX: `<Header />`, `<PostList />`, `<ProfileCard />`, `<LoginScreen />`.

Now open the Problems panel. TypeScript lists each child that still requires a prop, for example *"Type '{}' is missing the following properties from type 'HeaderProps': user, logout."* That list is the to-do list. Work down the tree: in each file, delete the auth fields from the props interface and the parameters, and add one line that asks for what the component needs.

| File | Remove | Add |
| --- | --- | --- |
| `App.tsx` | `useState`, `login`, `logout`, and every auth prop it passes | `const { user } = useAuth();` |
| `Header.tsx` | `HeaderProps`, `{ user, logout }`, and the props on `<UserMenu>` | nothing |
| `UserMenu.tsx` | `UserMenuProps` and `{ user, logout }` | `const { user, logout } = useAuth();` |
| `LoginScreen.tsx` | `LoginScreenProps` and `{ login, loading }` | `const { login, loading } = useAuth();` |
| `ProfileCard.tsx` | `ProfileCardProps` and `{ user }` | `const { user } = useAuth();` and `if (!user) return null;` |
| `PostList.tsx` | `PostListProps`, `{ user }`, and `user={user}` on PostCard | `const { user } = useAuth();` *(temporary)* |
| `PostCard.tsx` | `user` from `PostCardProps` and from the parameters | `const { user } = useAuth();` *(temporary)* |

The app keeps running while there are type errors, but it won't behave correctly until the list is empty.

**The `| null` errors.** `useAuth()` returns `user: User | null`, so TypeScript flags `user.role` as "possibly null" in PostList and PostCard. For now, write `user?.role`. Point out that these temporary checks disappear in Segment 4. In ProfileCard, the `if (!user) return null;` line handles it.

**Checkpoint:** run `npm run typecheck`; it should print nothing. Then sign in and out as each role. The app should behave exactly as before. If the screen goes blank, open the browser console: the error from `useAuth` names the problem.

**Point out the cost:** PostCard now calls `useAuth()` just for two role checks. That makes it depend on auth, so it can't be rendered in a test without a Provider. Segment 4 fixes that.

## Segment 4: Permissions with Can (28–38 min)

Students replace every hand-written role check with a typed permission check.

**Teacher adds permissions to `AuthContext.tsx` (3 min).** Add this above `AuthProvider`:

```tsx
export type Permission =
  | "posts:read"
  | "posts:write"
  | "posts:delete"
  | "settings:edit"
  | "users:manage";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  viewer: ["posts:read"],
  editor: ["posts:read", "posts:write", "settings:edit"],
  admin: ["posts:read", "posts:write", "posts:delete", "settings:edit", "users:manage"],
};
```

Add `hasPermission: (permission: Permission) => boolean;` to `AuthContextValue`. Then add this inside `AuthProvider`, and add `hasPermission` to `value` and to its dependency list:

```tsx
const permissions = useMemo(
  () => new Set<Permission>(user ? ROLE_PERMISSIONS[user.role] : []),
  [user],
);
const hasPermission = useCallback(
  (permission: Permission) => permissions.has(permission),
  [permissions],
);
```

The key idea: components ask "can I do X?", never "is this an admin?" Adding a role then means editing one map. And `Record<Role, Permission[]>` means TypeScript errors if you add a role to `Role` and forget to give it permissions.

**Create `src/auth/Can.tsx` together (2 min):**

```tsx
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

**Quick demo (30 sec):** type `<Can permission="posts:destroy">` and show the red underline. A typo in a permission name is now a compile error instead of a button that silently never appears.

**Pair exercise (5 min).** Replace every role check with `<Can>`:

1. `UserMenu.tsx`: wrap **Settings** in `settings:edit` and **Manage users** in `users:manage`.
2. `PostList.tsx`: wrap **+ New post** in `posts:write`, with `fallback={<span className="muted small">Read-only access</span>}`. Then delete `useAuth` from PostList, because it no longer needs the user.
3. `PostCard.tsx`: wrap **Edit** in `posts:write` and **Delete** in `posts:delete`. Then delete `useAuth` from PostCard.
4. Run `npm run typecheck`. If it reports an unused import, delete that import.
5. Test each role and check the results against this table:

| Role | New post | Edit | Delete | Settings | Manage users |
| --- | --- | --- | --- | --- | --- |
| viewer | No (shows Read-only) | No | No | No | No |
| editor | Yes | Yes | No | Yes | No |
| admin | Yes | Yes | Yes | Yes | Yes |

**Checkpoint:** in the lab, set **Code: Finished** and **Lens: Data flow**. Students' code should now match it: `PostCardProps` contains only `post`, and the purple boxes are the only components that read context. Ask one last time: "Why is `post` still a prop?" *(It's different for every card.)*

**Must-say:** hiding a button is about the user experience, not security. Anyone can call your API from the browser console, so the server has to check the same permissions on every request.

## Segment 5: Too big or too small? (38–45 min)

Students decide how fine-grained components should be.

Put the lab's **Rules to take away** section on screen. Then ask the class to vote on each proposal, and have someone defend each side:

1. **"Extract PostTitle into its own component."** *(No. It's one `<h3>` used in one place, with no state and no logic. It adds a file, an import, and a props interface but no meaning.)*
2. **"Extract the dropdown's menu items into a MenuItem component."** *(Debatable. They repeat four times, but only inside one file and they're one tag each. Extract it once a second menu needs the same item.)*
3. **"Make Avatar call `useAuth()` so we don't have to pass `name`."** *(No. Then Avatar could only ever show the signed-in user, never a post's author.)*
4. **"Put the whole post list, cards included, in PostList.tsx."** *(No. That's too coarse: PostCard's markup would sit inside a loop, and you couldn't reuse or test a single card.)*

Land on the rule: **extract a component when it repeats, has one job you can name, owns its own state, or needs testing on its own. Otherwise, keep it as plain JSX.**

## Segment 6: Exit ticket and homework (45–50 min)

**Exit ticket (3 min, individual):**

1. Name one presentational component and one feature component in Team Blog, and say what makes each one that kind.
2. Before the refactor, why did `HeaderProps` include `user` and `logout`? What changed after?
3. Why does `PostCardProps` still include `post` instead of PostCard reading posts from context?

*Look-fors:* (1) presentational components show their props; feature components own data or read context. (2) Header only passed them along to UserMenu, which is prop drilling; now UserMenu reads context itself, and Header has no props at all. (3) PostCard should show *any* post, so the caller decides which one.

**Homework (pick one):**

- **Core:** Add a `moderator` role that can read, write, and delete posts but can't edit settings or manage users. Add it to the `Role` type first and let TypeScript tell you what else must change. Write two sentences on why no component needed to change.
- **Stretch:** Build a `PostDetail` page that shows one post with its full text. Reuse `Avatar`, `Tag`, `Button`, and `Can`. Which new components and types did you need, and why?
- **Challenge:** Add a theme toggle (light or dark) using a second, typed context, `ThemeContext`. Explain why theme belongs in context but the post data doesn't.

## Common mistakes

| Symptom | Cause | Fix |
| --- | --- | --- |
| "useAuth must be used inside &lt;AuthProvider&gt;" | `main.tsx` doesn't wrap `<App />` | Wrap `<App />` in `<AuthProvider>` in `main.tsx` |
| `Cannot find name 'useAuth'` | Missing import | `import { useAuth } from "../auth/AuthContext";` (one `../` from `components/`) |
| `'user' is possibly 'null'` | `useAuth()` returns `User \| null` | Use `user?.role` (temporary), or `if (!user) return null;` in ProfileCard |
| `Type '{}' is missing the following properties from type 'HeaderProps': user, logout` | The parent stopped passing props the child still declares | Delete that field from the child's props interface and call `useAuth()` instead |
| `Type '{ user: … }' is not assignable to type 'IntrinsicAttributes'` | A parent still passes a prop you removed | Delete the prop where the error points, such as `<UserMenu user={user} />` → `<UserMenu />` |
| `Type '"posts:destroy"' is not assignable to type 'Permission'` | A typo in a permission name | Use one of the five names in `Permission` |
| Buttons never appear for any role | `hasPermission` wasn't added to `value` or its dependency list | Add it to both |
| `'User' is declared but its value is never read` | A leftover import after removing props | Delete the unused import |

**For students who finish early:** remove the `useMemo` around `value`, add a `console.log` in PostCard, and count the extra renders when the menu opens. Then explain why the `useMemo` is there.
