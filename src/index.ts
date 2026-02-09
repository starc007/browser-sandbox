import type { BuildSandboxOptions, BuildSandboxResult } from "./types";
import { getAdapter } from "./frameworks/registry";
import { runBuild } from "./core/build";
import { buildHtml } from "./core/html";
import { createBlobUrl } from "./core/blob";
import { formatError } from "./core/format-error";
import { normalizePath } from "./core/virtual-fs";

/**
 * Build a sandbox from in-memory project files and return a Blob URL for iframe loading.
 * Runs entirely in the browser (no server). Uses esbuild-wasm for bundling.
 * On failure, returns { url: "", error: "human-readable message" } instead of throwing.
 *
 * @example
 * const { url, error } = await buildSandbox({ files: { "src/main.tsx": "..." }, framework: "react" });
 * if (error) console.error(error);
 * else iframe.src = url;
 */
export async function buildSandbox(
  options: BuildSandboxOptions
): Promise<BuildSandboxResult> {
  try {
    const { files, framework } = options;

    const adapter = getAdapter(framework);
    const entryPath = adapter.getEntry(files);

    let html: string;
    if (entryPath === "") {
      const indexKey = Object.keys(files).find((p) => normalizePath(p) === "index.html");
      const indexContent = indexKey ? files[indexKey] : undefined;
      if (!indexContent) throw new Error("index.html not found.");
      html = indexContent;
    } else {
      const importMap = adapter.getImportMap(files);
      const external = [...new Set(Object.keys(importMap).filter((k) => !k.endsWith("/")))];
      let bundle: string;
      try {
        const result = await runBuild(files, entryPath, external);
        bundle = result.bundle;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`Build failed: ${message}`);
      }
      html = buildHtml(adapter, importMap, bundle, files);
    }

    const url = createBlobUrl(html);
    return { url };
  } catch (err) {
    return { url: "", error: formatError(err) };
  }
}

export type {
  BuildSandboxOptions,
  BuildSandboxResult,
  FrameworkName,
} from "./types";
export { ensureEsbuildInit } from "./core/build";
