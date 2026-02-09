import type { FrameworkAdapter } from "../frameworks/types";
import { normalizePath, dirname, resolveRelative } from "./virtual-fs";

/**
 * Inline CSS into HTML: replace each <link rel="stylesheet" href="..."> (where the file exists in files)
 * with a <style>...</style> block so styles work in a single-document blob.
 */
export function inlineCssInHtml(
  html: string,
  files: Record<string, string>,
  indexDir: string
): string {
  const normalizedToContent = new Map<string, string>();
  for (const [path, content] of Object.entries(files)) {
    const n = normalizePath(path);
    if (/\.css$/i.test(n)) normalizedToContent.set(n, content);
  }
  if (normalizedToContent.size === 0) return html;

  const linkRe = /<link\s[^>]*\/?>/gi;
  return html.replace(linkRe, (tag) => {
    const relMatch = tag.match(/\brel\s*=\s*["']([^"']+)["']/i);
    const hrefMatch = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i);
    if (relMatch?.[1]?.toLowerCase() !== "stylesheet" || !hrefMatch?.[1])
      return tag;
    const path = stripQueryAndHash(hrefMatch[1].trim());
    const resolved = resolveRelative(indexDir, path);
    const normalized = normalizePath(resolved);
    let content = normalizedToContent.get(normalized);
    if (content == null) {
      const lower = normalized.toLowerCase();
      for (const [n, c] of normalizedToContent) {
        if (n.toLowerCase() === lower) {
          content = c;
          break;
        }
      }
    }
    return content != null ? `<style>${content}</style>` : tag;
  });
}

function stripQueryAndHash(src: string): string {
  const q = src.indexOf("?");
  const h = src.indexOf("#");
  const end =
    q === -1 && h === -1 ? src.length : Math.min(q === -1 ? src.length : q, h === -1 ? src.length : h);
  return src.slice(0, end).trim();
}

/** Escape CSS so a literal </style> inside it doesn't close the HTML <style> tag. */
function escapeCssForStyleTag(css: string): string {
  return css.replace(/<\/style>/gi, "\\3C/style>");
}

/**
 * Build full HTML: inject import map and bundle script, then delegate to adapter for structure.
 * Vanilla: index.html is rendered as-is (with CSS inlined); we append the script block.
 * React: we replace the first module script in the template with the script block.
 * When emittedCss is set (e.g. from React import './index.css'), it is injected as a <style> block before the script.
 */
export function buildHtml(
  adapter: FrameworkAdapter,
  importMap: Record<string, string>,
  bundleContent: string,
  files?: Record<string, string>,
  emittedCss?: string
): string {
  const importMapScript =
    Object.keys(importMap).length > 0
      ? `<script type="importmap">${JSON.stringify({
          imports: importMap,
        })}</script>\n`
      : "";
  const emittedStyle =
    emittedCss && emittedCss.trim()
      ? `<style>${escapeCssForStyleTag(emittedCss.trim())}</style>\n`
      : "";
  const bundleScript = `<script type="module">\n${bundleContent}\n</script>`;
  const scriptsBlock = importMapScript + emittedStyle + bundleScript;
  let customHtml: string | undefined;
  let indexDir = "";
  if (files) {
    const indexKey = Object.keys(files).find(
      (p) => normalizePath(p).toLowerCase() === "index.html"
    );
    if (indexKey) {
      customHtml = files[indexKey];
      indexDir = dirname(indexKey);
      customHtml = inlineCssInHtml(customHtml, files, indexDir);
    }
  }
  return adapter.getHtmlTemplate(scriptsBlock, customHtml);
}
