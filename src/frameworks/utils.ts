import { normalizePath } from "../core/virtual-fs";

/**
 * Find first file that exists in the file map (by normalized path).
 */
export function findEntry(
  files: Record<string, string>,
  candidates: string[]
): string | null {
  const normalized = new Set<string>();
  for (const p of Object.keys(files)) {
    normalized.add(normalizePath(p));
  }
  for (const c of candidates) {
    const n = normalizePath(c);
    if (normalized.has(n)) return n;
  }
  return null;
}

/**
 * Parse index.html for the first script with src (module or classic) and return the src path (normalized).
 * Strips query string and hash so "script.js?v=1" and "script.js#foo" resolve to "script.js".
 */
export function getEntryFromIndexHtml(html: string): string | null {
  // Prefer type="module" src="..."
  const moduleMatch = html.match(
    /<script[^>]*\s+type\s*=\s*["']module["'][^>]*\s+src\s*=\s*["']([^"']+)["']|<\s*script[^>]*\s+src\s*=\s*["']([^"']+)["'][^>]*\s+type\s*=\s*["']module["']/i
  );
  const moduleSrc = moduleMatch?.[1] ?? moduleMatch?.[2];
  if (moduleSrc) return normalizePath(stripQueryAndHash(moduleSrc));
  // Fallback: any <script ... src="..."> (more permissive: [^>]+ allows any attribute order)
  const srcMatch = html.match(/<script[^>]+src\s*=\s*["']([^"']+)["']/i);
  return srcMatch?.[1] ? normalizePath(stripQueryAndHash(srcMatch[1])) : null;
}

function stripQueryAndHash(src: string): string {
  const q = src.indexOf("?");
  const h = src.indexOf("#");
  const end =
    q === -1 && h === -1
      ? src.length
      : Math.min(q === -1 ? src.length : q, h === -1 ? src.length : h);
  return src.slice(0, end).trim();
}

const ESM_SH_BASE = "https://esm.sh";

/** Strip ^ and ~ from version for CDN URLs. Skip file:/workspace: etc. */
function normalizeVersion(v: string): string | null {
  if (
    v.startsWith("file:") ||
    v.startsWith("workspace:") ||
    v.startsWith("link:")
  )
    return null;
  return v.replace(/^[\^~]/, "").trim() || null;
}

/**
 * Build a full import map from package.json (dependencies + devDependencies).
 * Each package gets a main entry and a trailing-slash entry for subpath imports (e.g. "react/jsx-runtime").
 */
export function getImportMapFromPackageJson(
  files: Record<string, string>
): Record<string, string> {
  const pkgKey = Object.keys(files).find(
    (p) => normalizePath(p) === "package.json"
  );
  const raw = pkgKey ? files[pkgKey] : undefined;
  if (!raw) return {};
  try {
    const pkg = JSON.parse(raw) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (!deps || typeof deps !== "object") return {};
    const map: Record<string, string> = {};
    for (const [name, range] of Object.entries(deps)) {
      const version = normalizeVersion(range);
      if (!version) continue;
      const url = `${ESM_SH_BASE}/${name}@${version}`;
      map[name] = url;
      map[name + "/"] = url + "/";
    }
    return map;
  } catch {
    return {};
  }
}

/**
 * Replace the first <script type="module" src="..."> in html with scriptsBlock.
 * Used for React template; vanilla adapter does not swap—it appends.
 */
export function injectScriptsIntoHtml(
  html: string,
  scriptsBlock: string
): string {
  const re =
    /<script[^>]*type\s*=\s*["']module["'][^>]*src\s*=\s*["'][^"']*["'][^>]*>\s*<\/script>/i;
  return html.replace(re, scriptsBlock);
}
