import type { FrameworkAdapter } from "../types";
import { normalizePath } from "../../core/virtual-fs";
import { getEntryFromIndexHtml } from "../utils";

/** Returned by getEntry when index.html has no external script (inline-only). */
const INLINE_ONLY = "";

/**
 * Vanilla: entry is always index.html. The script to bundle is taken from the first
 * <script type="module" src="..."> in index.html (e.g. script.js, main.js, src/main.js).
 * No fixed path list—any path in index.html works; other JS files are bundled via imports.
 */
export const vanillaAdapter: FrameworkAdapter = {
  getEntry(files) {
    const indexLower = "index.html";
    const indexKey = Object.keys(files).find(
      (p) => normalizePath(p).toLowerCase() === indexLower
    );
    const indexContent = indexKey ? files[indexKey] : undefined;
    if (!indexContent) {
      throw new Error("Entry file not found. Vanilla expects index.html.");
    }
    let entryPath = getEntryFromIndexHtml(indexContent);
    if (!entryPath) {
      return INLINE_ONLY;
    }
    const normalizedList = Object.keys(files).map((p) => normalizePath(p));
    const normalizedSet = new Set(normalizedList);
    if (normalizedSet.has(entryPath)) {
      return entryPath;
    }
    // Case-insensitive match (e.g. script.js vs Script.js)
    const entryLower = entryPath.toLowerCase();
    const caseMatch = normalizedList.find(
      (p) => p.toLowerCase() === entryLower
    );
    if (caseMatch) return caseMatch;
    // Basename match (e.g. HTML has "script.js", files have "src/script.js" or vice versa)
    const entryBasename = entryPath.replace(/^.*\//, "");
    const basenameMatch = normalizedList.find(
      (p) => p === entryBasename || p.endsWith("/" + entryBasename)
    );
    if (basenameMatch) return basenameMatch;
    // Fallback: if there is exactly one .js file in the project, use it (common case: index.html + script.js)
    const jsExtensions = /\.(js|mjs|cjs)$/i;
    const jsFiles = normalizedList.filter((p) => jsExtensions.test(p));
    if (jsFiles.length === 1) return jsFiles[0];
    throw new Error(
      `Entry script not found in files: ${entryPath} (referenced from index.html).`
    );
  },

  getImportMap(_files) {
    // Vanilla projects are already browser-compatible; no import map needed.
    return {};
  },

  getHtmlTemplate(scriptsBlock, customHtml) {
    if (!customHtml) {
      throw new Error("index.html is required for Vanilla.");
    }
    // Append bundled script so it runs (blob URL has no separate script file; we don't swap the original tag).
    if (customHtml.includes("</body>")) {
      return customHtml.replace("</body>", `${scriptsBlock}\n</body>`);
    }
    return customHtml + "\n" + scriptsBlock;
  },
};
