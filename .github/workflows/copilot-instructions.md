## Running test

Always run tests with `--run` to ensure that watch mode is disabled, or you will get stuck.

## Validation phase

Once finished you should always run all lint checks as a final validation step.

```sh
pnpm lint:tsc
pnpm lint:eslint
pnpm lint:prettier
pnpm lint:knip
pnpm lint:madge
```

And also ensure that the code builds successfully:

```sh
pnpm build
```
