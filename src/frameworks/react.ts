import type { FrameworkAdapter } from "./types";
import { findEntry, getReactVersionsFromPackageJson, injectScriptsIntoHtml } from "./utils";

const REACT_ENTRY_CANDIDATES = [
  "src/main.jsx",
  "src/main.tsx",
  "src/main.ts",
  "main.jsx",
  "main.tsx",
  "main.ts",
  "src/index.jsx",
  "src/index.tsx",
  "src/index.ts",
  "index.jsx",
  "index.tsx",
  "index.ts",
];

const DEFAULT_REACT_VERSION = "18.2.0";

function buildReactImportMap(reactVersion: string, reactDomVersion: string): Record<string, string> {
  return {
    react: `https://esm.sh/react@${reactVersion}`,
    "react/jsx-runtime": `https://esm.sh/react@${reactVersion}/jsx-runtime`,
    "react-dom": `https://esm.sh/react-dom@${reactDomVersion}`,
    "react-dom/client": `https://esm.sh/react-dom@${reactDomVersion}/client`,
  };
}

export const reactAdapter: FrameworkAdapter = {
  getEntry(files) {
    const entry = findEntry(files, REACT_ENTRY_CANDIDATES);
    if (!entry) {
      throw new Error(
        `Entry file not found. Expected one of: ${REACT_ENTRY_CANDIDATES.join(
          ", "
        )}`
      );
    }
    return entry;
  },

  getImportMap(files) {
    const versions = getReactVersionsFromPackageJson(files);
    const react = versions?.react ?? DEFAULT_REACT_VERSION;
    const reactDom = versions?.reactDom ?? DEFAULT_REACT_VERSION;
    return buildReactImportMap(react, reactDom);
  },

  getHtmlTemplate(scriptsBlock, customHtml) {
    if (customHtml) {
      return injectScriptsIntoHtml(customHtml, scriptsBlock);
    }
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sandbox</title>
</head>
<body>
  <div id="root"></div>
  ${scriptsBlock}
</body>
</html>`;
  },
};
