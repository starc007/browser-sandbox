/**
 * Adapter interface for a framework preset.
 * Core only depends on this; new frameworks implement it and register.
 */
export interface FrameworkAdapter {
  /** Resolve entry file path (e.g. "src/main.tsx"). Throws if not found. */
  getEntry(files: Record<string, string>): string;
  /** Import map for externals (e.g. react, react-dom). Can use files["package.json"] for versions. */
  getImportMap(files: Record<string, string>): Record<string, string>;
  /** Build full HTML. Uses customHtml (e.g. files["index.html"]) when provided; otherwise default template. */
  getHtmlTemplate(scriptsBlock: string, customHtml?: string): string;
}
