# React Components Lesson

A 50-minute React + TypeScript lesson you run locally in VS Code. Students explore a small blog app, **Team Blog**,
in an interactive **Component Anatomy Lab**, then refactor the real code: they move the
signed-in user into **React Context** and replace hand-written role checks with a
`<Can>` permission component.

Everything is plain React and TypeScript with no other libraries: `useState`, `useEffect`, `useContext`, and Vite.

## What's inside

| Path | What it is |
| --- | --- |
| `src/` | The starter app. It works, but passes `user` down through props. Students edit this. |
| `public/anatomy.html` | The Component Anatomy Lab. Every box in it matches a file in `src/components`. |
| `teacher/LESSON_PLAN.md` | A minute-by-minute plan with checkpoints, an exit ticket, and homework. |
| `teacher/solution/src/` | The finished app, with `AuthProvider`, `useAuth`, and `<Can>`. Same file layout as `src/`. |

## The four kinds of component

Every component in this app is one of four kinds. The comment at the top of each file says
which, and the lab's **What kind?** lens colors them the same way.

| Kind | What it does | In this app |
| --- | --- | --- |
| **Layout** | Arranges other components. Holds no data of its own. | `App`, `Header` |
| **Feature** | Owns data or state, or reads it from context. | `UserMenu`, `PostList`, `ProfileCard`, `LoginScreen` |
| **Presentational** | Shows exactly what its props say. Easy to reuse and test. | `PostCard`, `Avatar`, `Button`, `Tag` |
| **Logic only** | Has no UI of its own; provides data or makes a decision. | `AuthProvider`, `Can` *(you build these)* |

## Props or context?

Both get data into a component. The question is **does every component need the same value,
or does each one need its own?**

- **Context** is for one value the whole app shares. There's one signed-in user, and
  components all over the tree need it. Passing it as a prop means threading it through
  components that ignore it, which is prop drilling.
- **Props** are for values that differ from one child to the next. `PostList` hands each
  `PostCard` a *different* post, and `Avatar` shows *whichever* name it's given: you in the
  header, an author on each post. Context can't do that, because it gives every component
  the same value.

The code marks the good props: search the project for `PROPS ARE RIGHT HERE`
(**Cmd/Ctrl+Shift+F** in VS Code). The starter has no context yet, so the finished code in
`teacher/solution/src/` also marks `CONTEXT IS RIGHT HERE`. There, `ProfileCard.tsx` uses
both in one file: it reads the user from context, then passes a plain `name` prop to `Avatar`.

## Three names that sound alike

`src/auth/AuthContext.tsx`, which you build today, has three pieces with nearly the same name:

| Name | What it is | Who uses it |
| --- | --- | --- |
| `AuthContext` | The **channel**, made with `createContext()`. Holds no data by itself. | Only `AuthContext.tsx` |
| `AuthProvider` | **Our component.** Owns the user state and broadcasts it on the channel. | `main.tsx`, once |
| `useAuth()` | **Our hook.** Reads from the channel. | Any component that needs auth |

Tutorials often write `<AuthContext.Provider value={...}>`. That's the older syntax for the
same thing. Since React 19, you can write `<AuthContext value={...}>`, which this project uses.

## Get started

You need [Node.js](https://nodejs.org) 18 or newer (check with `node -v`) and VS Code.

1. Fork this repo on GitHub, then clone your fork:

   ```bash
   git clone https://github.com/<your-username>/ReactComponentsLesson.git
   cd ReactComponentsLesson
   code .
   ```

2. In VS Code's terminal (**Terminal → New Terminal**), install packages and start the app:

   ```bash
   npm install
   npm run dev
   ```

   The app opens in your browser at `http://localhost:5173`. Leave this terminal running:
   the page updates every time you save a file.

3. Open the Component Anatomy Lab with the **Component Anatomy Lab ↗** button in the app's
   bottom-right corner. It opens in a new tab at `http://localhost:5173/anatomy.html`.

VS Code will offer to install two recommended extensions: Prettier, which formats your code
on save, and ES7+ React snippets. Both are optional.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the starter app at http://localhost:5173 |
| `npm run solution` | Starts the finished app at http://localhost:5174, for comparing |
| `npm run typecheck` | Checks every file for type errors. No output means no errors. |

Press **Ctrl+C** in the terminal to stop the app.

`npm run dev` keeps running even when there are type errors. VS Code underlines them in red,
and **View → Problems** lists them all.

## For students

1. Sign in as **viewer**, **editor**, and **admin**, and notice what changes.
2. Open the lab with the **Component Anatomy Lab ↗** button. Click a box, then open the file it names.
3. Follow along as we refactor. Your checkpoints:
   - `src/auth/AuthContext.tsx` exists, with `AuthProvider` and `useAuth`.
   - No props interface contains `user`, `login`, or `logout`.
   - `npm run typecheck` prints no errors.
   - Every `user.role === …` check is replaced with `<Can permission="…">`.

When you're done, set the lab to **Code: Finished**. Your code should match what it shows.

```
src/
├─ main.tsx
├─ App.tsx
├─ types.ts            Role, User, Post
├─ data/fakeApi.ts
├─ components/
│  ├─ Header.tsx        layout
│  ├─ UserMenu.tsx      feature
│  ├─ PostList.tsx      feature
│  ├─ ProfileCard.tsx   feature
│  ├─ LoginScreen.tsx   feature
│  ├─ PostCard.tsx      presentational
│  ├─ Avatar.tsx        presentational
│  ├─ Button.tsx        presentational
│  └─ Tag.tsx           presentational
└─ auth/                you create this
   ├─ AuthContext.tsx
   └─ Can.tsx
```

## For teachers

Start with [`teacher/LESSON_PLAN.md`](teacher/LESSON_PLAN.md). To demo the finished app, run
`npm run solution`, which serves it on port 5174 next to the starter. To help a stuck student,
copy one file from `teacher/solution/src/` over the matching file in `src/`.

Anyone who forks this repo can see the `teacher/` folder. If you don't want students to see
the solution, keep `teacher/` in a separate private repo.

Built with React 19, TypeScript 5, and Vite 5.
