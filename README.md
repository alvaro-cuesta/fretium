<a id="fretium-fretboard-diagram-generator"></a>

<h1>
  <p align="center">
    <a href="https://fretium.cuesta.dev"><img src="./public/favicon.svg" width="24" height="24" /></a> Fretium, fretboard diagram generator
  </p>
</h1>

<p align="center">
  <a href="#fretium-fretboard-diagram-generator">
    <img src="https://img.shields.io/github/package-json/v/alvaro-cuesta/fretium" alt="Version" /></a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/github/license/alvaro-cuesta/fretium" alt="License" /></a>
  <a href="https://github.com/alvaro-cuesta/fretium/actions/workflows/ci.yml">
    <img src="https://github.com/alvaro-cuesta/fretium/actions/workflows/ci.yml/badge.svg" alt="CI Status" /></a>
  <a href="https://github.com/alvaro-cuesta/fretium/issues">
    <img src="https://img.shields.io/github/issues/alvaro-cuesta/fretium" alt="Issues" /></a>
  <a href="#development">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="https://pr.new/alvaro-cuesta/fretium" alt="Start new PR in StackBlitz Codeflow">
    <img src="https://developer.stackblitz.com/img/start_pr_small.svg" /></a>
</p>

A **fretboard diagram generator** for guitar, bass, ukulele, and other stringed instruments. Generate chord and scale diagrams directly in your browser.

<p align="center">
  <a href="https://fretium.cuesta.dev"><img src="./public/favicon.svg" alt="Fretium" width="128" height="128" /></a>
  <br />
  <b>Try it now on <a href="https://fretium.cuesta.dev">fretium.cuesta.dev</a>!</b>
</p>

## Development

Install [Node.js](https://nodejs.org), clone this repository and run this in the root of the project to install the required dependencies:

```sh
corepack enable
corepack install
pnpm install --frozen-lockfile
```

### Local development

Just run this to start a local development server and follow the instructions:

```sh
pnpm dev
```

### Lints

You should periodically run linters to ensure the code passes some basic checks:

```sh
pnpm lint:tsc
pnpm lint:eslint
pnpm lint:knip
pnpm lint:prettier
pnpm lint:madge
```

Or just let your IDE do the work with TypeScript/ESLint/Prettier integrations. These are automatically run as checks on GitHub Actions, but it's better if you keep lints up to date as you code!

### Tests

Run all tests:

```sh
pnpm test
```

These are automatically run as checks on GitHub Actions, but it's better if you keep tests up to date as you code!

### Things to do

- See [`TODO.md`](TODO.md) for outstanding general tasks.
- See [open issues](https://github.com/alvaro-cuesta/fretium/issues).
- Do a global search for `@todo` in the code.

## Production build

Run this to build and serve the application in production mode:

```sh
pnpm build
pnpm preview
```
