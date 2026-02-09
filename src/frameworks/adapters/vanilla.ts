import type { FrameworkAdapter } from "../types";
import { normalizePath, dirname, resolveRelative } from "../../core/virtual-fs";
import { getEntryFromIndexHtml } from "../utils";

/** Returned by getEntry when index.html has no external script (inline-only). */
const INLINE_ONLY = "";

const JS_EXT = /\.(js|mjs|cjs)$/i;

function findIndexHtmlKey(files: Record<string, string>): string | undefined {
  const indexLower = "index.html";
  return Object.keys(files).find(
    (p) => normalizePath(p).toLowerCase() === indexLower
  );
}

/**
 * Resolve the entry script path against the list of normalized file paths.
 * Tries: exact (resolved path), case-insensitive, basename with same-dir preference, then single .js fallback.
 */
function resolveEntryPath(
  resolvedPath: string,
  indexDir: string,
  normalizedList: string[],
  normalizedSet: Set<string>
): string | null {
  if (normalizedSet.has(resolvedPath)) return resolvedPath;

  const resolvedLower = resolvedPath.toLowerCase();
  const caseMatch = normalizedList.find(
    (p) => p.toLowerCase() === resolvedLower
  );
  if (caseMatch) return caseMatch;

  const basename = resolvedPath.replace(/^.*\//, "");
  const basenameCandidates = normalizedList.filter(
    (p) => p === basename || p.endsWith("/" + basename)
  );
  if (basenameCandidates.length === 1) return basenameCandidates[0];
  if (basenameCandidates.length > 1) {
    const sameDir = basenameCandidates.find((p) => dirname(p) === indexDir);
    if (sameDir) return sameDir;
    const exactResolved = basenameCandidates.find((p) => p === resolvedPath);
    if (exactResolved) return exactResolved;
    return basenameCandidates[0];
  }

  const jsFiles = normalizedList.filter((p) => JS_EXT.test(p));
  if (jsFiles.length === 1) return jsFiles[0];
  return null;
}

/**
 * Vanilla: entry is always index.html. The script to bundle is taken from the first
 * <script src="..."> in index.html. Paths are resolved relative to index.html's directory,
 * so it works with: multiple JS files, JS in folders, or mix of root and nested files.
 */
export const vanillaAdapter: FrameworkAdapter = {
  getEntry(files) {
    const indexKey = findIndexHtmlKey(files);
    if (!indexKey) {
      throw new Error("Entry file not found. Vanilla expects index.html.");
    }
    const indexContent = files[indexKey];
    const rawScriptSrc = getEntryFromIndexHtml(indexContent);
    if (!rawScriptSrc) {
      return INLINE_ONLY;
    }

    const indexDir = dirname(indexKey);
    const resolvedPath = resolveRelative(indexDir, rawScriptSrc);
    const normalizedList = Object.keys(files).map((p) => normalizePath(p));
    const normalizedSet = new Set(normalizedList);

    const entryPath = resolveEntryPath(
      resolvedPath,
      indexDir,
      normalizedList,
      normalizedSet
    );
    if (entryPath) return entryPath;

    // Referenced script not in uploaded files (e.g. only index.html uploaded): serve HTML as-is (inline-only).
    return INLINE_ONLY;
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
