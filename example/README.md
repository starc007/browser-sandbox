# Example — Test Browser Sandbox

1. Build the package, bundle the example script, and start a local server:

   ```bash
   bun run example
   ```

2. Open in your browser:

   **http://localhost:3000/**

3. Choose **Framework** (React or Vanilla), select your **project folder** (or files) via the file input, then click **Build**. The preview iframe shows the built app.

Only source files (`.js`, `.jsx`, `.ts`, `.tsx`, `.html`, `.json`, `.css`) are used; `node_modules`, `.git`, `dist`, and similar paths are ignored. Use “Upload folder” (directory picker) so paths like `src/main.jsx` and `package.json` are preserved.
