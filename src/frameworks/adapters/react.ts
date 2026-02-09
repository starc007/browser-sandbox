import type { FrameworkAdapter } from "../types";
import { findEntry, getImportMapFromPackageJson, injectScriptsIntoHtmlWithBodyScript } from "../utils";

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

const REACT_VERSION = "18.2.0";
const DEFAULT_REACT_IMPORT_MAP: Record<string, string> = {
  react: `https://esm.sh/react@${REACT_VERSION}`,
  "react/jsx-runtime": `https://esm.sh/react@${REACT_VERSION}/jsx-runtime`,
  "react-dom": `https://esm.sh/react-dom@${REACT_VERSION}?external=react`,
  "react-dom/client": `https://esm.sh/react-dom@${REACT_VERSION}/client?external=react`,
};

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
    const fromPkg = getImportMapFromPackageJson(files);
    if (Object.keys(fromPkg).length > 0) return fromPkg;
    return { ...DEFAULT_REACT_IMPORT_MAP };
  },

  getHtmlTemplate(scriptsBlock, customHtml) {
    if (customHtml) {
      return injectScriptsIntoHtmlWithBodyScript(customHtml, scriptsBlock);
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
