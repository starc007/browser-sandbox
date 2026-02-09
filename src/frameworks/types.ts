/**
 * Adapter interface for a framework preset.
 * Core only depends on this; new frameworks implement it and register.
 */
export interface FrameworkAdapter {
  /** Resolve entry file path (e.g. "src/main.tsx"). Throws if not found. */
  getEntry(files: Record<string, string>): string;
  /** Import map for externals (e.g. react, react-dom). Empty object if none. */
  getImportMap(): Record<string, string>;
  /** Build full HTML document. Receives the scripts block (import map + bundle) to embed. */
  getHtmlTemplate(scriptsBlock: string): string;
}
