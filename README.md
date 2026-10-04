# React Components Lesson

A 50-minute, Replit-ready React lesson. Students explore a small blog app, **Team Blog**,
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

**On Replit:** choose **Create Repl → Import from GitHub**, paste this repo's URL, and click
**Run**. The first run installs packages, which takes about 20 seconds.

**Locally:**

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`, and the lab is at `http://localhost:5173/anatomy.html`.
You can also open `public/anatomy.html` straight in a browser, since it needs no build step.

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

Start with [`teacher/LESSON_PLAN.md`](teacher/LESSON_PLAN.md). To see the finished app, copy
`teacher/solution/src/` over `src/`, or swap in one file at a time to help a stuck student.

Anyone who forks this repo can see the `teacher/` folder. If you don't want students to see
the solution, keep `teacher/` in a separate private repo.

Built with React 19 and Vite 5.
