import type { FrameworkAdapter } from "../frameworks/types";
import { normalizePath } from "./virtual-fs";

/**
 * Build full HTML: inject import map and bundle script, then delegate to adapter for structure.
 * Vanilla: index.html is rendered as-is; we only append the script block (no swap). React: we replace
 * the first module script in the template with the script block.
 */
export function buildHtml(
  adapter: FrameworkAdapter,
  importMap: Record<string, string>,
  bundleContent: string,
  files?: Record<string, string>
): string {
  const importMapScript =
    Object.keys(importMap).length > 0
      ? `<script type="importmap">${JSON.stringify({
          imports: importMap,
        })}</script>\n`
      : "";
  const bundleScript = `<script type="module">\n${bundleContent}\n</script>`;
  const scriptsBlock = importMapScript + bundleScript;
  const customHtml = files
    ? (() => {
        const key = Object.keys(files).find(
          (p) => normalizePath(p) === "index.html"
        );
        return key ? files[key] : undefined;
      })()
    : undefined;
  return adapter.getHtmlTemplate(scriptsBlock, customHtml);
}
