# browser-sandbox

Build Vite-style project files **fully in the browser** and get a Blob URL you can load in an `<iframe>`. No server, no Node APIs.

## Install

```bash
bun add browser-sandbox
```

## Usage

```ts
import { buildSandbox } from "browser-sandbox";

const { url } = await buildSandbox({
  files: {
    "src/main.tsx": `
      import React from "react";
      import { createRoot } from "react-dom/client";
      import App from "./App";
      createRoot(document.getElementById("root")).render(<App />);
    `,
    "src/App.tsx": `
      import React from "react";
      export default function App() {
        return <h1>Hello from sandbox</h1>;
      }
    `,
  },
  framework: "react",
});

// Load in iframe
document.querySelector("iframe").src = url;
```

## Supported frameworks

- **react** — React + React DOM (entry: `src/main.tsx`, `main.tsx`, `src/index.tsx`, etc.)
- **vanilla** — Plain JS (entry: `index.html` with a `<script type="module" src="...">` pointing to your main JS)

## Running the example

From the repo root:

```bash
bun run example
```

Then open **http://localhost:3000/** in your browser and use **Build React** or **Build Vanilla** to test.

## Requirements

- Runs in the browser only (no Node).
- Uses [esbuild-wasm](https://github.com/evanw/esbuild) for bundling. The first build will load the WASM binary from a CDN (default: unpkg).
- Dependencies like `react` and `react-dom` are loaded via **import maps** from [esm.sh](https://esm.sh).

## Adding frameworks

New frameworks can be added by implementing the `FrameworkAdapter` interface (entry resolution, import map, HTML template) and registering in the framework registry. See `src/frameworks/` in the source.
