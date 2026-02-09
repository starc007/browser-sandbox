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
 * Parse index.html for the first <script type="module" src="..."> and return the src path (normalized).
 */
export function getEntryFromIndexHtml(html: string): string | null {
  const match = html.match(
    /<script[^>]*\s+type\s*=\s*["']module["'][^>]*\s+src\s*=\s*["']([^"']+)["']|<\s*script[^>]*\s+src\s*=\s*["']([^"']+)["'][^>]*\s+type\s*=\s*["']module["']/i
  );
  const src = match?.[1] ?? match?.[2];
  return src ? normalizePath(src) : null;
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
 */
export function injectScriptsIntoHtml(
  html: string,
  scriptsBlock: string
): string {
  const re =
    /<script[^>]*type\s*=\s*["']module["'][^>]*src\s*=\s*["'][^"']*["'][^>]*>\s*<\/script>/i;
  return html.replace(re, scriptsBlock);
}
