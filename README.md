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
