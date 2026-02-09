import type { FrameworkAdapter } from "../types";
import { normalizePath } from "../../core/virtual-fs";
import { getEntryFromIndexHtml, getImportMapFromPackageJson, injectScriptsIntoHtml } from "../utils";

/** Returned by getEntry when index.html has no external script (inline-only). */
const INLINE_ONLY = "";

export const vanillaAdapter: FrameworkAdapter = {
  getEntry(files) {
    const indexPath = normalizePath("index.html");
    const indexKey = Object.keys(files).find((p) => normalizePath(p) === indexPath);
    const indexContent = indexKey ? files[indexKey] : undefined;
    if (!indexContent) {
      throw new Error("Entry file not found. Vanilla expects index.html.");
    }
    const entryPath = getEntryFromIndexHtml(indexContent);
    if (!entryPath) {
      return INLINE_ONLY;
    }
    const normalized = new Set(Object.keys(files).map((p) => normalizePath(p)));
    if (!normalized.has(entryPath)) {
      throw new Error(`Entry script not found in files: ${entryPath} (referenced from index.html).`);
    }
    return entryPath;
  },

  getImportMap(files) {
    return getImportMapFromPackageJson(files);
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
  ${scriptsBlock}
</body>
</html>`;
  },
};
