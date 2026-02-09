import type { FrameworkAdapter } from "../frameworks/types";
import { normalizePath } from "./virtual-fs";

/**
 * Build full HTML: inject import map and bundle script, then delegate to adapter for structure.
 * When files contain index.html, the adapter uses it as the template.
 */
export function buildHtml(
  adapter: FrameworkAdapter,
  importMap: Record<string, string>,
  bundleContent: string,
  files?: Record<string, string>
): string {
  const importMapScript =
    Object.keys(importMap).length > 0
      ? `<script type="importmap">${JSON.stringify({ imports: importMap })}</script>\n`
      : "";
  const bundleScript = `<script type="module">\n${bundleContent}\n</script>`;
  const scriptsBlock = importMapScript + bundleScript;
  const customHtml = files
    ? Object.keys(files).find((p) => normalizePath(p) === "index.html")
      ? files[Object.keys(files).find((p) => normalizePath(p) === "index.html")!]
      : undefined
    : undefined;
  return adapter.getHtmlTemplate(scriptsBlock, customHtml);
}
