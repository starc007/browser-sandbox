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
 *
 * When react is a dependency, every other package gets ?external=react so esm.sh
 * leaves bare "react" imports for the browser import map to resolve — ensuring a
 * single React instance across all packages.
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

    const hasReact = "react" in deps;
    const reactVersion = hasReact ? normalizeVersion(deps["react"]) : null;

    const map: Record<string, string> = {};
    for (const [name, range] of Object.entries(deps)) {
      const version = normalizeVersion(range);
      if (!version) continue;
      const url = `${ESM_SH_BASE}/${name}@${version}`;

      // For non-react packages: add ?external=react so they use the import map's
      // React instead of bundling their own copy (prevents multiple React instances)
      const isReactPkg = name === "react";
      const needsExternal = hasReact && !isReactPkg;
      const suffix = needsExternal ? "?external=react" : "";

      map[name] = url + suffix;
      map[name + "/"] = url + "/" + suffix;
    }

    // Ensure react subpaths resolve correctly (jsx-runtime, etc.)
    if (hasReact && reactVersion) {
      const reactUrl = `${ESM_SH_BASE}/react@${reactVersion}`;
      if (!map["react/jsx-runtime"]) {
        map["react/jsx-runtime"] = `${reactUrl}/jsx-runtime`;
      }
      if (!map["react/jsx-dev-runtime"]) {
        map["react/jsx-dev-runtime"] = `${reactUrl}/jsx-dev-runtime`;
      }
    }

    // Ensure react-dom/client resolves correctly with ?external=react
    if (hasReact && deps["react-dom"]) {
      const rdVersion = normalizeVersion(deps["react-dom"]);
      if (rdVersion && !map["react-dom/client"]) {
        map[
          "react-dom/client"
        ] = `${ESM_SH_BASE}/react-dom@${rdVersion}/client?external=react`;
      }
    }

    return map;
  } catch {
    return {};
  }
}

/**
 * Replace the first <script type="module" src="..."> in html with scriptsBlock.
 * Used for React template; vanilla adapter does not swap—it appends.
 * Uses a function replacement so $ in scriptsBlock (e.g. "$100,000") is never interpreted as $1.
 */
export function injectScriptsIntoHtml(
  html: string,
  scriptsBlock: string
): string {
  const re =
    /<script[^>]*type\s*=\s*["']module["'][^>]*src\s*=\s*["'][^"']*["'][^>]*>\s*<\/script>/i;
  return html.replace(re, () => scriptsBlock);
}

/**
 * For React with custom HTML: remove the user's entry script, put import map in <head>
 * (so it's parsed before any module and React resolves to a single instance), then
 * put style + bundle script after <div id="root"></div>.
 */
export function injectScriptsIntoHtmlWithBodyScript(
  html: string,
  scriptsBlock: string
): string {
  // Remove user's <script type="module" src="..."> so it doesn't 404
  const scriptTagRe =
    /<script\s[^>]*(?:type\s*=\s*["']module["'][^>]*src\s*=\s*["'][^"']*["']|src\s*=\s*["'][^"']*["'][^>]*type\s*=\s*["']module["'])[^>]*>\s*<\/script>\s*/i;
  let out = html.replace(scriptTagRe, "");

  // Import map must be first (in head) so "react" resolves before any module runs
  const importMapMatch = scriptsBlock.match(
    /<script\s+type\s*=\s*["']importmap["'][^>]*>[\s\S]*?<\/script>/i
  );
  const importMapBlock = importMapMatch ? importMapMatch[0] : "";
  const afterImportMap = importMapBlock
    ? scriptsBlock.replace(importMapBlock, "").replace(/^\s+/, "")
    : scriptsBlock;

  if (importMapBlock) {
    // Ensure import map is the FIRST script in head (before any existing scripts)
    if (out.includes("<head>")) {
      const headMatch = out.match(/<head[^>]*>/i);
      if (headMatch) {
        const headEnd = out.indexOf(headMatch[0]) + headMatch[0].length;
        out =
          out.slice(0, headEnd) + `\n${importMapBlock}` + out.slice(headEnd);
      } else {
        out = out.replace("</head>", `${importMapBlock}\n</head>`);
      }
    } else {
      // No head tag - insert before first script or at start of body
      const firstScript = out.search(/<script/i);
      if (firstScript !== -1) {
        out =
          out.slice(0, firstScript) +
          importMapBlock +
          "\n" +
          out.slice(firstScript);
      } else {
        out = importMapBlock + "\n" + out;
      }
    }
  }
  const rootDivRe = /(<div\s+id\s*=\s*["']root["'][^>]*>\s*<\/div>)/i;
  if (rootDivRe.test(out)) {
    // Use function replacement so $ in bundle (e.g. "$100,000") is never interpreted as $1
    out = out.replace(rootDivRe, (match) => `${match}\n${afterImportMap}`);
  } else {
    out = out.replace("</body>", `${afterImportMap}\n</body>`);
  }
  return out;
}
