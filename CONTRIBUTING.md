# Contributing to browser-sandbox

Thanks for your interest in contributing. This document gives a short guide to development and contributing.

## Development setup

- **Runtime:** [Bun](https://bun.sh) (Node works for install; Bun preferred for scripts).
- **Install:** `bun install`
- **Build:** `bun run build` (output in `dist/`)
- **Example:** `bun run example` then open http://localhost:3000/

## Code style

- TypeScript with strict mode.
- Prefer small, focused modules.
- No Node-only APIs (package runs in the browser).

## Adding a new framework

1. Implement the `FrameworkAdapter` interface in `src/frameworks/adapters/<name>.ts`:
   - `getEntry(files)` — resolve entry file path
   - `getImportMap(files)` — return import map for externals (e.g. from `package.json`)
   - `getHtmlTemplate(scriptsBlock, customHtml?)` — return full HTML (use project `index.html` when provided)
2. Export the adapter from `src/frameworks/adapters/index.ts`.
3. Register it in `src/frameworks/registry.ts`.

See `src/frameworks/adapters/react.ts` and `vanilla.ts` for examples.

## Submitting changes

1. Open an issue or pick an existing one to discuss.
2. Fork the repo, create a branch, make your changes.
3. Ensure `bun run build` passes.
4. Open a pull request with a clear description of the change.

## License

By contributing, you agree that your contributions will be licensed under the same [MIT License](LICENSE) that covers this project.
