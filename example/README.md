# Example — Test Browser Sandbox

1. Build the package, bundle the example script, and start a local server:

   ```bash
   bun run example
   ```

2. Open in your browser:

   **http://localhost:3000/**

3. Click **Build Axiom** to load the Axiom project (React + Vite-style under `axiom/`), build it in the browser, and preview it in the iframe.

The page fetches the Axiom source files from the server, calls `buildSandbox({ files, framework: "react" })`, and displays the result in the iframe.
