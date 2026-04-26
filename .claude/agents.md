# Pre-push checklist

Before pushing to origin, **always** run these checks and fix any issues:

1. `pnpm run lint:tsc` — TypeScript build
2. `pnpm run lint:eslint` — ESLint (run on changed files: `npx eslint <files>`)
3. `pnpm run lint:prettier` — Prettier formatting (fix with `pnpm exec prettier --write <files>`)
4. `pnpm run lint:madge` — Circular dependency detection
5. `pnpm vitest run --exclude '.claude/**'` — Test suite

If any check fails, fix the issue and re-run before pushing. Do **not** push and fix CI in a follow-up commit.

## Common pitfalls

- **Circular dependencies**: Don't import from a parent component file (e.g. `CommonControls` importing from `App.tsx`). Extract shared types to their own file.
- **CSS module types**: New `.module.scss` files need a `pnpm run build` to generate their `.d.ts` — run this before `lint:tsc` if you created a new stylesheet.
- **Prettier**: Always format changed files before committing. CI runs `prettier --check .` which fails on any unformatted file.
- **ESLint unused vars**: When commenting out code, also comment out (or remove) any imports/variables that become unused.
- **Infinite render loops**: When adding `useEffect` callbacks that update parent state via inline arrow props, ensure the state setter compares by **value** not identity — inline arrows create new references every render.
