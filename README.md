# browser-sandbox

**Preview AI-generated code in the browser.** Pass in-memory project files (e.g. from an AI that generated React or Vanilla HTML/JS), get a Blob URL to load in an `<iframe>`—no server, no Node, no local build. Built for quickly rendering and iterating on generated Vite-style projects.

- **In-memory:** `files` is `Record<path, content>`. Dependencies and HTML come from your project (`package.json`, `index.html`).
- **Browser-only:** Uses esbuild-wasm; runs entirely in the client.

## Install

```bash
bun add browser-sandbox
```

## Usage

When you have project files as strings (e.g. from an AI or editor), pass them to `buildSandbox` and show the result in an iframe:

```ts
import { buildSandbox } from "browser-sandbox";

// e.g. files from AI-generated project
const { url, error } = await buildSandbox({
  files: {
    "package.json": '{"dependencies":{"react":"^18.0.0","react-dom":"^18.0.0"}}',
    "index.html": "<!DOCTYPE html><html><body><div id=\"root\"></div></body></html>",
    "src/main.tsx": "import React from 'react'; import { createRoot } from 'react-dom/client'; import App from './App'; createRoot(document.getElementById('root')).render(<App />);",
    "src/App.tsx": "import React from 'react'; export default function App() { return <h1>Hello</h1>; }",
  },
  framework: "react",
});

if (error) {
  console.error(error); // human-readable message
  return;
}
document.querySelector("iframe").src = url;
```

- **Result:** `{ url: string, error?: string }`. On failure, `error` is set with a human-readable message; `url` is empty. No throwing.
- **Import map:** Built from your `package.json` (`dependencies` + `devDependencies`). All listed packages are loaded from [esm.sh](https://esm.sh) at runtime.
- **HTML:** Your `index.html` is used as the page template (when present). The bundle (or inline script) is injected where the module script was.

## Supported frameworks

- **react** — Entry: `src/main.jsx`, `src/main.tsx`, `main.jsx`, etc. Uses your `index.html` and `package.json`.
- **vanilla** — Entry: `index.html` only. Optional `<script type="module" src="...">` for an external JS file, or inline script only (single HTML file, no JS file).

## Running the example

From the repo root:

```bash
bun run example
```

Open **http://localhost:3000/**. Choose **Framework** (React or Vanilla), select your **project folder** or **individual files**, then click **Build**. Only source files (`.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.json`, `.css`) are used; `node_modules`, `.git`, `dist`, etc. are ignored.

## Requirements

- Runs in the browser only (no Node).
- Uses [esbuild-wasm](https://github.com/evanw/esbuild) for bundling. The first build loads the WASM binary from a CDN (unpkg).

## Adding frameworks

Implement the `FrameworkAdapter` interface and add an adapter under `src/frameworks/adapters/`, then register it in `src/frameworks/registry.ts`. See `src/frameworks/adapters/react.ts` and `vanilla.ts` for examples.
