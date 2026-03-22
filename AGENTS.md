# Instructions for coding agents

Fretium is a browser-based fretboard diagram generator.

## Defaults

- Use `pnpm` for all commands.
- Keep edits minimal and focused on the user request.
- Prefer targeted checks during iteration; run full validation before finishing.

## Testing

- Always run tests with `--run` to avoid watch mode:

  ```sh
  pnpm test --run
  ```

- When iterating on a specific test file, run only that file:

  ```sh
  pnpm test --run path/to/file.test.ts
  ```

- For type-level test assertions, use Vitest's typechecking infrastructure with
  `.test-d.ts` files and `expectTypeOf`/`assertType`, wrapped in normal Vitest
  `test(...)` (or `describe`, `it`, etc.) blocks, rather than adding TSC-only fixtures or
  `@ts-expect-error` probes to runtime test files.

- Use per-file runs during tight iteration loops, then run the full suite in final validation.

## Fast iteration loop

Run only what is needed while developing:

- TypeScript/runtime changes: `pnpm lint:tsc`
- Lint/style-sensitive changes: `pnpm lint:eslint` and/or `pnpm lint:prettier`
- Dependency/unused-export-sensitive changes: `pnpm lint:knip`
- Import graph/module structure changes: `pnpm lint:madge`
- Behavioral changes: `pnpm test --run path/to/file.test.ts` while iterating, then `pnpm test --run` before completion

## Final validation (required)

Before completing a task, run all of these unless the task was purely non-code (e.g. documentation):

```sh
pnpm lint:tsc
pnpm lint:eslint
pnpm lint:prettier
pnpm lint:knip
pnpm lint:madge
pnpm test --run
pnpm build
```
