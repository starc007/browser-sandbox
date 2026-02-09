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
 * Directory of a path (empty string if at root). e.g. "src/index.html" → "src", "index.html" → "".
 */
export function dirname(path: string): string {
  const n = normalizePath(path);
  const i = n.lastIndexOf("/");
  return i === -1 ? "" : n.slice(0, i);
}

/**
 * Resolve a relative path against a base directory (project-root-relative).
 * e.g. resolveRelative("src", "main.js") → "src/main.js", resolveRelative("src", "../script.js") → "script.js".
 */
export function resolveRelative(baseDir: string, relativePath: string): string {
  const base = normalizePath(baseDir).replace(/\/$/, "") || "";
  const rel = normalizePath(relativePath);
  const combined = base ? base + "/" + rel : rel;
  const parts = combined.split("/").filter(Boolean);
  const out: string[] = [];
  for (const seg of parts) {
    if (seg === ".") continue;
    if (seg === "..") {
      out.pop();
      continue;
    }
    out.push(seg);
  }
  return out.join("/") || ".";
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
