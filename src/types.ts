/** Supported framework identifiers. */
export type FrameworkName = "react" | "vanilla";

/** Options for building a sandbox from in-memory files. */
export interface BuildSandboxOptions {
  /** Project files as path -> content. Vite-style (e.g. "src/main.tsx", "index.html"). */
  files: Record<string, string>;
  /** Framework preset for entry, externals, and HTML template. */
  framework: FrameworkName;
}

/** Result of a successful sandbox build. */
export interface BuildSandboxResult {
  /** Blob URL to load in an iframe (e.g. iframe.src = url). */
  url: string;
}
