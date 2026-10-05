# Lesson script: read it aloud

A word-for-word teacher script for the 50-minute lesson, in the order things happen. The students have the code; this is what you say, what goes on screen, what you ask, and what to do when the answer is off.

How to use it:

- **SAY** is spoken text. Read it naturally; it's written to be heard, so the file names are spelled the way you'd say them.
- **SCREEN** is what to show or what students should type.
- **ASK** is a question to put to the class. Wait for an answer before reading on.
- **LISTEN FOR** is the answer you want. **IF THEY SAY** covers the common wrong answers and what to say back.
- Times match the agenda in [`LESSON_PLAN.md`](LESSON_PLAN.md). The plan has the reasoning; this has the words.

This script was rehearsed by running the whole lesson as a live, voiced session, so the wrong-answer branches are the ones that really came up.

---

## Segment 1: Tour the lab (0–8 min)

**SCREEN:** the app on `localhost:5173`, then the lab (the **Component Anatomy Lab** button, bottom right). Lens: **What kind?**, Code: **Starter**.

> **SAY:** "Welcome. Today you're going to take a small blog app, called Team Blog, and refactor it in about fifty minutes. By the end, you'll know when to pass data with props, when to use context, and how big a component should be.
>
> First, though, we look before we touch. This page is a map of the app. Every box on it is a real file in `src/components`."

**SCREEN:** click the **PostCard** box, then open `src/components/PostCard.tsx`.

> **SAY:** "Click a box and the panel shows you its file, what kind of component it is, and why it exists. Now open the matching file. The box and the file are the same thing.
>
> Look at the top of PostCard. There's an interface called PostCardProps. That's the component's contract: everything it needs from outside. It needs a post, and it needs a user. Keep an eye on that user. We'll come back to it."

> **SAY:** "Now the colors. Under the lab there's a legend, and it shows the four kinds of component. Click one to light up just those boxes; click it again, or press Show all, to reset.
>
> **Layout** components arrange other components and hold no data. **Feature** components own data or state, or read it from context. **Presentational** components show exactly what their props say. And **logic-only** components have no screen at all; they provide data or make a decision.
>
> Check the first line of a few files: LAYOUT, FEATURE, PRESENTATIONAL. Notice there's no logic-only component yet. Two arrive today."

**ASK:** "Look at the lab. How many components are presentational?" *(LISTEN FOR: Avatar, Button, Tag, PostCard: four.)*

**SCREEN:** switch to **Lens: Reuse**.

> **SAY:** "Avatar is written once and used five times. Imagine every avatar was hand-written markup, and your boss says: make them all square. You'd edit five places, and you'd probably miss one. That's the first reason a component exists: write it once."

**ASK:** "Why is Avatar its own file, but the menu items inside UserMenu aren't?"

> **SAY:** "Hold that thought. Don't answer yet. We come back to it near the end."

---

## Segment 2: Trace the data (8–15 min)

**SCREEN:** **Lens: Data flow**, Code: **Starter**.

> **SAY:** "Now follow the data. Orange boxes receive props they never use themselves. They just pass them along. Header and PostList are orange."

**ASK (pairs, 2 min):** "In `App.tsx`, find `user`. Follow it down to the Delete button in `PostCard`. Which components carry `user` without using it?"

**LISTEN FOR:** Header (it only hands `user` and `logout` to UserMenu), and PostList (it mostly passes `user` on to each card).

> **SAY:** "That has a name: **prop drilling**. It means passing data through components that don't need it, just to reach one that does."

**ASK:** "Why does PostCard need `user`?" *(Only to decide whether to show Edit and Delete.)*

**ASK:** "Tomorrow your boss wants a new role called moderator. What do you have to change?" *(The Role type, plus every `user.role ===` check, in three files.)*

**SCREEN:** open `PostList.tsx`, find `PROPS ARE RIGHT HERE` above `posts.map`.

> **SAY:** "Before we get carried away: not every prop is a problem. Look at this comment. Every card gets a different post, so the parent has to say which one. That's what props are for."

**ASK:** "Should `post` move into context too?"

**LISTEN FOR:** No, because each card needs its own post, and context gives everyone the same value.

**IF THEY SAY** "yes" or "I'm not sure": "Picture a radio station. Everyone tuned in hears the same song. If posts were on the radio, every card would show the same post. Context is a broadcast. Props are a hand-delivered letter, addressed to one component."

> **SAY:** "So here's the whole rule. **If every component needs the same value, use context. If each one needs its own, use props.** There's one signed-in user, so it's the first kind."

> **SAY:** "Context works like a radio. A **provider** high in the tree broadcasts a value. Any component below can tune in with `useContext`. The ones in between never touch it."

**SCREEN:** show the three-line sketch from the lesson plan (the channel, the broadcaster, the receiver).

> **SAY:** "You'll see `AuthContext.Provider` in most tutorials. That's the older way to write the same thing. React 19 lets you write the context itself as the provider, and that's what we use. Both work."

**ASK:** "Which component do you think will tune in to get the user, so it can show your name in the dropdown?"

**LISTEN FOR:** UserMenu.

**IF THEY SAY** "AuthProvider":

> **SAY:** "Ooh, okay. I'm glad you said that, because lots of people mix this one up. AuthProvider is the station. It's the one broadcasting. My question was: who's listening? The name helps if you read it slowly. Auth... Provider. A provider provides. It gives the value out; it doesn't take it in.
>
> Go back to the lab, keep it on Finished, and look at the tree. Find Header and look at what's inside. One component draws your avatar and opens a dropdown with your name and email. That component needs the user. What's its name?"

---

## Segment 3: Build AuthProvider and useAuth (15–28 min)

> **SAY:** "Time to stop talking and build. Open the project in VS Code. In `src`, make a new folder called `auth`. Inside it, create a file called `AuthContext.tsx`. I'll put the exact code on screen. Don't paste it; type it. Your fingers remember better than your eyes."

### Step 1: the channel

**SCREEN:**

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

> **SAY:** "Just the channel. You create the context, and give it a starting value of null."

**ASK:** "What does `null` mean here?"

**LISTEN FOR:** No provider is above this component, so nobody is broadcasting.

### Step 2: the station

> **SAY:** "Step two: the station. AuthProvider holds the user and the login and logout functions, and broadcasts all three to everything inside it. See `children` in the code? It means: whatever you wrap me around, I let through.
>
> Here's what to notice as you type. This code is not new. It's already living in one of your files."

**SCREEN:** update the imports, then add the provider.

```tsx
import { createContext, useCallback, useMemo, useState, type ReactNode } from "react";
import { fakeLogin } from "../data/fakeApi";
import type { Role, User } from "../types";
```

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

**ASK:** "Which file has the exact same state right now?"

**LISTEN FOR:** `App.tsx`.

**IF THEY SAY** "fakeApi":

> **SAY:** "Good eye: our new provider does import `fakeLogin` from there. But `fakeApi` is just the pretend server. I asked where the state lives: the `useState` for user, the loading flag, login and logout. That's `App.tsx`. So the move for this whole lesson is: cut that state out of App and put it in AuthProvider. We just did the paste half."

### Step 3: the listener

**SCREEN:** add `useContext` to the first import, then add at the bottom:

```tsx
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
```

> **SAY:** "Step three: the listener, a tiny hook called `useAuth`. It tunes in, and if it hears silence, it throws an error that tells you exactly what you forgot."

**ASK:** "Why throw an error instead of returning null?"

**LISTEN FOR:** Otherwise every component that calls the hook needs its own null check.

> **SAY:** "Right. Throwing once, in one place, fixes it for everybody. And a side note that trips people up: context being null and the user being null are different. Context null means you forgot the provider: a bug. User null means nobody's signed in: a normal situation we still handle."

### Step 4: wire it up

**SCREEN:** `src/main.tsx`:

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

`src/App.tsx`: delete the `useState`, `fakeLogin`, `Role` and `User` imports, both `useState` lines, `login` and `logout`; then:

```tsx
import { useAuth } from "./auth/AuthContext";

export default function App() {
  const { user } = useAuth();
  // ...the return stays the same for now
}
```

> **SAY:** "Two edits. In `main.tsx`, wrap the app in AuthProvider: the station goes above everything. In `App.tsx`, delete the state we just copied and replace it with one line asking `useAuth`.
>
> Now the fun part. Open `Header.tsx` and delete `user` and `logout` from `HeaderProps`. Don't fix anything else. Just look."

**ASK:** "Where will the red squiggle appear, and what will it say?"

**LISTEN FOR:** In `App.tsx`, where `<Header user={user} logout={logout} />` is written. A prop that no longer exists is being passed.

> **SAY:** "Yes. And there's a second one, in Header itself, which still tries to read `user` and `logout` from its props. Two squiggles: the parent that passes them, and the child that expects them.
>
> This is why I love TypeScript here. Open the Problems panel: those squiggles are your checklist. Walk down it, one file at a time."

**SCREEN:** the fix in each file.

`Header.tsx` (no props at all):

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

`UserMenu.tsx`: remove the props interface; start the component with:

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

> **SAY:** "Do the same for PostList, ProfileCard and LoginScreen: delete the auth props and add one `useAuth()` line for what the body uses. ProfileCard also needs `if (!user) return null`, because the user can be null. Leave PostCard alone for now; PostList keeps passing it `user`."

**CHECK:** `npm run typecheck` prints nothing; sign in and out as each role.

**ASK:** "How many things does Header itself ask `useAuth` for?"

**LISTEN FOR:** Nothing. Zero.

> **SAY:** "Zero. Header is a layout component. It arranges things. It doesn't need to know who you are. Before today, it was carrying `user` and `logout` like a delivery driver, only to hand them to UserMenu. Now it travels light. That's what removing prop drilling feels like."

---

## Segment 4: Permissions with Can (28–38 min)

> **SAY:** "Second half: permissions. Open UserMenu and find Settings and Manage users. See how they check `user.role` against the word viewer or admin? That's a hand-written check, and it's scattered across the app.
>
> The fix is to stop asking 'are you an admin?' and start asking 'can you do this?' We write down, in one place, which role may take which action. A map."

### Step 1: the permission map

**SCREEN:** in `AuthContext.tsx`, above `AuthContextValue`:

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

Add to `AuthContextValue`:

```tsx
hasPermission: (permission: Permission) => boolean;
```

In `AuthProvider`, above `value`; then extend `value` to include `hasPermission`:

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

**ASK:** "Tomorrow your boss wants a moderator role. Once the map exists, how many files change?"

**LISTEN FOR:** One place: `AuthContext.tsx`. No component knows the word moderator.

> **SAY:** "Almost, with one detail. It's two tiny edits, both in the auth world: add `moderator` to the Role type in `types.ts`, and add a line to the map. And because the map is typed as a Record of Role, TypeScript refuses to compile until you add that line. It reminds you. Zero components touched."

### Step 2: the gatekeeper

**SCREEN:** create `src/auth/Can.tsx`:

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

> **SAY:** "Can has no screen of its own: it's logic only. Wrap it around a button and say `permission="posts:delete"`. If the user may, the button shows. If not, it doesn't. Notice Can is a listener too. It tunes in, same as UserMenu."

**ASK:** "When the user isn't allowed, what should Can draw?"

**LISTEN FOR:** The `fallback`, which defaults to null, meaning nothing.

> **SAY:** "That little prop decides what shows when the answer is no. Its default is null, so a viewer doesn't see a greyed-out Delete button; they see no button at all. You could pass a lock icon, or 'ask an admin'."

### Step 3: cash in

**SCREEN:** `UserMenu.tsx`, add `import Can from "../auth/Can";` and replace the two role checks:

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

`PostCard.tsx`: add the `Can` import, remove `User` from the type import, delete `user` from the props and signature, delete `canEdit` and `canDelete`, then:

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

`PostList.tsx`: stop passing `user` to `<PostCard>`; if `useAuth()` there has no other use, delete it.

> **SAY:** "Now we cash in. Go delete every hand-written role check. In UserMenu, wrap Settings in Can with `settings:edit`, and Manage users with `users:manage`. In PostCard, delete `canEdit` and `canDelete`, and wrap Edit and Delete. PostCard doesn't need the user any more, so remove the prop from PostCard and PostList too."

**CHECK:** `npm run typecheck` is clean. Viewer sees no Edit, Delete or Settings; editor sees Edit and Settings; admin sees everything.

**ASK:** "PostCard no longer takes `user`, but it still takes `post`. Why is `post` a prop and not in context?"

**LISTEN FOR:** Each card needs its own post; context would give every card the same one.

> **SAY:** "Because it's unique to that card. Same for everyone: context. Different for each: props. You just applied the rule live."

---

## Segment 5: Too big or too small? (38–45 min)

**SCREEN:** the lab's **Rules to take away**.

> **SAY:** "You built it. Now the design question: how big should a component be? Four proposals. For each, vote: extract it, or leave it. And give me one sentence of why."

**Proposal 1.** "Extract `PostTitle` into its own component. It's one `h3`, used in one place, with no state or logic."

**LISTEN FOR:** Leave it.

**IF THEY SAY** "extract it, for theming":

> **SAY:** "Theming is a real reason, so test it: can you theme that heading without a new component? Yes. A single CSS rule targets it. A component earns its place when it repeats, has one job you can name, owns state, or needs testing on its own. A maybe, someday isn't on that list. You can always extract later; it takes thirty seconds."

**Proposal 2.** "Extract the dropdown's menu items into a `MenuItem` component."

**LISTEN FOR:** Debatable. They repeat four times, but only inside one file. Extract it when a second menu needs the same item.

> **SAY:** "Good instinct to list what's the same and what differs. Same: the tag, the role, the class. Different: the label and the click. That's a small props interface, so the design is easy. The only question is whether to do it yet."

**Proposal 3.** "`Avatar` takes a `name` prop. That's annoying. Let `Avatar` call `useAuth()` and read the name itself."

**LISTEN FOR:** No. Then `Avatar` could only ever show the signed-in user, never a post's author.

> **SAY:** "That's the most common mistake once people discover context: they start reaching for it everywhere. Avatar's name is different every time it's used, so it stays a prop, even if that costs you one extra word."

**Proposal 4.** "Skip the `PostCard` file. Write the whole card inside the loop in `PostList`." *(Ask it as: "Keep `PostCard`, or inline it into `PostList`?")*

**LISTEN FOR:** Keep `PostCard`. You'd lose reuse (a card on a search page), testing one card with fake data, and a readable `PostList`.

> **SAY:** "The rule from all four votes: extract a component when it repeats, has one job you can name, owns its own state, or needs testing on its own. Otherwise, plain JSX. Too small, and you drown in files. Too big, and nothing can be reused."

**Close the loop from Segment 1:** "Why is Avatar its own file but the menu items aren't?" *(Avatar repeats across files and is used with different names; the menu items repeat only inside one file.)*

---

## Segment 6: Exit ticket and homework (45–50 min)

> **SAY:** "Three questions, individually, three minutes."

1. "Name one presentational component and one feature component in Team Blog, and say what makes each one that kind."
   *LISTEN FOR:* Presentational shows its props (Avatar, Button, Tag, PostCard). Feature owns data or reads context (PostList, UserMenu, ProfileCard, LoginScreen).
2. "Before the refactor, why did `HeaderProps` include `user` and `logout`? What changed after?"
   *LISTEN FOR:* Header only passed them along to UserMenu (prop drilling). Now UserMenu reads context and Header has no props at all.
3. "Why does `PostCardProps` still include `post` instead of PostCard reading posts from context?"
   *LISTEN FOR:* PostCard should show any post; the caller decides which one.

> **SAY:** "Let's land the plane. Two ideas today. One: if everyone needs the same value, use context; if each component needs its own, use props. Two: a component earns its place by repeating, having one clear job, owning state, or needing a test.
>
> And you saw the whole pattern in code: a channel made with `createContext`, a station called `AuthProvider`, a listener called `useAuth`, and a gatekeeper called `Can`."

> **SAY (homework, pick one):** "Core: add a `moderator` role that can read, write and delete posts, but can't edit settings or manage users. Add it to the Role type first and let TypeScript tell you what else has to change. Then write two sentences on why no component needed to change.
>
> Stretch: build a `PostDetail` page that shows one post with its full text, reusing Avatar, Tag, Button and Can. Challenge: add a light/dark theme with a second, typed `ThemeContext`, and explain why theme belongs in context but post data doesn't.
>
> Great work today."

---

## Optional: the voiced version

If you'd like a narrator instead of reading aloud, the same words were recorded as an ElevenLabs flow, with the voice Jay Rogers: https://elevenlabs.io/app/flows/fPTyjtfH3CB3OTFx8rz4. Those clips answer one particular run of the lesson, so for a class, read this script and use the clips only as sample takes.
