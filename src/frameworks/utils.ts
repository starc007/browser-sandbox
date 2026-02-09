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
