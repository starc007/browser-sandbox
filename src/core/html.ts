import type { FrameworkAdapter } from "../frameworks/types";

/**
 * Build full HTML: inject import map and bundle script, then delegate to adapter for structure.
 */
export function buildHtml(
  adapter: FrameworkAdapter,
  importMap: Record<string, string>,
  bundleContent: string
): string {
  const importMapScript =
    Object.keys(importMap).length > 0
      ? `<script type="importmap">${JSON.stringify({ imports: importMap })}</script>\n`
      : "";
  const bundleScript = `<script type="module">\n${bundleContent}\n</script>`;
  const scriptsBlock = importMapScript + bundleScript;
  return adapter.getHtmlTemplate(scriptsBlock);
}
