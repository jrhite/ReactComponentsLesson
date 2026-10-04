# React Components Lesson

A 50-minute React lesson you run locally in VS Code. Students explore a small blog app, **Team Blog**,
in an interactive **Component Anatomy Lab**, then refactor the real code: they move the
signed-in user into **React Context** and replace hand-written role checks with a
`<Can>` permission component.

Everything is plain React with no other libraries: `useState`, `useEffect`, `useContext`, and Vite.

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

3. Open the Component Anatomy Lab in a second browser tab at
   `http://localhost:5173/anatomy.html`, or run `npm run lab` in a second terminal.

VS Code will offer to install two recommended extensions: Prettier, which formats your code
on save, and ES7+ React snippets. Both are optional.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the starter app at http://localhost:5173 |
| `npm run lab` | Starts the app and opens the Anatomy Lab |
| `npm run solution` | Starts the finished app at http://localhost:5174, for comparing |

Press **Ctrl+C** in the terminal to stop the app.

## For students

1. Sign in as **viewer**, **editor**, and **admin**, and notice what changes.
2. Open the lab at `/anatomy.html`. Click a box, then open the file it names.
3. Follow along as we refactor. Your checkpoints:
   - `src/auth/AuthContext.jsx` exists, with `AuthProvider` and `useAuth`.
   - No component receives `user`, `login`, or `logout` as a prop.
   - Every `user.role === …` check is replaced with `<Can permission="…">`.

When you're done, set the lab to **Code: Finished**. Your code should match what it shows.

```
src/
├─ main.jsx
├─ App.jsx
├─ data/fakeApi.js
├─ components/
│  ├─ Header.jsx        layout
│  ├─ UserMenu.jsx      feature
│  ├─ PostList.jsx      feature
│  ├─ ProfileCard.jsx   feature
│  ├─ LoginScreen.jsx   feature
│  ├─ PostCard.jsx      presentational
│  ├─ Avatar.jsx        presentational
│  ├─ Button.jsx        presentational
│  └─ Tag.jsx           presentational
└─ auth/                you create this
   ├─ AuthContext.jsx
   └─ Can.jsx
```

## For teachers

Start with [`teacher/LESSON_PLAN.md`](teacher/LESSON_PLAN.md). To demo the finished app, run
`npm run solution`, which serves it on port 5174 next to the starter. To help a stuck student,
copy one file from `teacher/solution/src/` over the matching file in `src/`.

Anyone who forks this repo can see the `teacher/` folder. If you don't want students to see
the solution, keep `teacher/` in a separate private repo.

Built with React 19 and Vite 5.
