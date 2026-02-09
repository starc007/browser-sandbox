# Example — Test Browser Sandbox

1. Build the package and start a local server:

   ```bash
   bun run example
   ```

2. Open in your browser:

   **http://localhost:3000/example/**

3. Click **Build React** or **Build Vanilla** to run a test build. The preview iframe will show the built app.

The page loads the built package from `../dist/` and calls `buildSandbox()` with sample files for React (src/main.tsx + src/App.tsx) and Vanilla (index.html + src/main.js).
