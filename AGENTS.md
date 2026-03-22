# Instructions for coding agents

This project is **Fretium**, a **fretboard diagram generator** for guitar, bass, ukulele, and other stringed instruments. Generate chord and scale diagrams directly in your browser.

## Development workflow and gotchas

This is a general guide for development workflow and best practices when working on this project. It is not exhaustive, but it should cover the most common scenarios. It is of paramount importance to follow these instructions to ensure a smooth development experience and maintain code quality.

### Running tests

Always run tests with `--run` to ensure that watch mode is disabled, or you will get stuck.

### Validation phase

Once finished you should always run all tests, lint checks and build the project, as a final validation step.

```sh
pnpm lint:tsc
pnpm lint:eslint
pnpm lint:prettier
pnpm lint:knip
pnpm lint:madge
pnpm test --run
pnpm build
```
