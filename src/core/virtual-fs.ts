/**
 * Normalize a path for consistent lookup: strip leading ./ and use forward slashes.
 */
export function normalizePath(path: string): string {
  let p = path.replace(/\\/g, "/").trim();
  if (p.startsWith("./")) p = p.slice(2);
  if (p.startsWith("/")) p = p.slice(1);
  return p || ".";
}

/**
 * Build a normalized file map from raw path -> content.
 */
export function createFileMap(files: Record<string, string>): Map<string, string> {
  const map = new Map<string, string>();
  for (const [path, content] of Object.entries(files)) {
    map.set(normalizePath(path), content);
  }
  return map;
}

/**
 * Get file content from a normalized map. Returns null if not found.
 */
export function getFile(map: Map<string, string>, path: string): string | null {
  const normalized = normalizePath(path);
  return map.get(normalized) ?? map.get(normalized + "/index.html") ?? null;
}

export function hasFile(map: Map<string, string>, path: string): boolean {
  return getFile(map, path) !== null;
}
