import { normalizePath } from "../core/virtual-fs";

/**
 * Find first file that exists in the file map (by normalized path).
 */
export function findEntry(files: Record<string, string>, candidates: string[]): string | null {
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

/**
 * Get react and react-dom versions from package.json (strip ^ and ~ for CDN).
 */
export function getReactVersionsFromPackageJson(
  files: Record<string, string>
): { react: string; reactDom: string } | null {
  const pkgKey = Object.keys(files).find((p) => normalizePath(p) === "package.json");
  const raw = pkgKey ? files[pkgKey] : undefined;
  if (!raw) return null;
  try {
    const pkg = JSON.parse(raw) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const react = deps?.react ?? deps?.React;
    const reactDom = deps?.["react-dom"];
    if (!react) return null;
    const strip = (v: string) => v.replace(/^[\^~]/, "");
    return { react: strip(react), reactDom: reactDom ? strip(reactDom) : strip(react) };
  } catch {
    return null;
  }
}

/**
 * Replace the first <script type="module" src="..."> in html with scriptsBlock.
 */
export function injectScriptsIntoHtml(html: string, scriptsBlock: string): string {
  const re = /<script[^>]*type\s*=\s*["']module["'][^>]*src\s*=\s*["'][^"']*["'][^>]*>\s*<\/script>/i;
  return html.replace(re, scriptsBlock);
}
