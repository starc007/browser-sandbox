import type { BuildSandboxOptions, BuildSandboxResult } from "./types";
import { getAdapter } from "./frameworks/registry";
import { runBuild } from "./core/build";
import { buildHtml } from "./core/html";
import { createBlobUrl } from "./core/blob";

/**
 * Build a sandbox from in-memory project files and return a Blob URL for iframe loading.
 * Runs entirely in the browser (no server). Uses esbuild-wasm for bundling.
 *
 * @example
 * const { url } = await buildSandbox({ files: { "src/main.tsx": "..." }, framework: "react" });
 * iframe.src = url;
 */
export async function buildSandbox(
  options: BuildSandboxOptions
): Promise<BuildSandboxResult> {
  const { files, framework } = options;

  const adapter = getAdapter(framework);
  const entryPath = adapter.getEntry(files);
  const importMap = adapter.getImportMap(files);
  const external = Object.keys(importMap);

  let bundle: string;
  try {
    const result = await runBuild(files, entryPath, external);
    bundle = result.bundle;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Build failed: ${message}`);
  }

  const html = buildHtml(adapter, importMap, bundle, files);
  const url = createBlobUrl(html);
  return { url };
}

export type {
  BuildSandboxOptions,
  BuildSandboxResult,
  FrameworkName,
} from "./types";
export { ensureEsbuildInit } from "./core/build";
