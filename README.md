# React Components Lesson

A 50-minute, Replit-ready React lesson on components and Context. Students refactor a
small app from **prop drilling** to **React Context**, then add a user dropdown and
role-based permissions. An interactive **Component Anatomy Lab** shows why components
are drawn where they are.

## What's inside

| Path | What it is | Audience |
| --- | --- | --- |
| `src/App.jsx` | The starter app: a working prop-drilling version to refactor | Students |
| `public/anatomy.html` | Component Anatomy Lab: a mock app with lenses for boundaries, reuse, props vs. context, and granularity | Students + teacher |
| `teacher/LESSON_PLAN.md` | Minute-by-minute plan with checkpoints, exit ticket, and homework | Teacher |
| `teacher/solution/App.jsx` | The finished build: `AuthProvider`, `useAuth`, `UserMenu`, `<Can>` | Teacher |

## Get started

**On Replit:** choose **Create Repl → Import from GitHub**, paste this repo's URL, then
click **Run**. The first run installs packages, which takes about 20 seconds, and then
the app opens in the preview pane.

**Locally:** fork or clone the repo, then run:

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`, and the Anatomy Lab is at
`http://localhost:5173/anatomy.html`. You can also open `public/anatomy.html`
directly in a browser, since it needs no build step.

## For students

All of today's code lives in `src/App.jsx`. It already works, so log in as
**viewer**, **editor**, and **admin** before you change anything.

### Checkpoints

1. `AuthProvider` and `useAuth` replace every drilled `user` / `logout` prop.
2. `UserMenu` reads from context and closes on an outside click or Escape.
3. `<Can permission="...">` hides any button a role isn't allowed to use.

### Vocabulary

prop drilling · context · Provider · consumer · default value · custom hook ·
presentational component · permission · role

## Component Anatomy Lab

Open `/anatomy.html` and switch between four lenses:

- **Boundaries** colors each component by kind: layout, feature, presentational, primitive, or logic-only.
- **Reuse** shows how many times each component appears from a single definition.
- **Props vs. context** shows where each component gets its data.
- **Granularity** compares a too-coarse split, a just-right split, and a too-fine split.

Click any outlined box to see why it's a component and where its boundary sits. The
role switcher shows `<Can>` hiding and showing buttons live.

## For teachers

Start with [`teacher/LESSON_PLAN.md`](teacher/LESSON_PLAN.md). Everything in
`teacher/`, including the solution, is visible to anyone who forks this repo. If you
don't want students to see it, keep `teacher/` in a separate private repo.

Built with React 19 and Vite 5.
