import * as esbuild from "esbuild-wasm";
import { createFileMap } from "./virtual-fs";
import { virtualFsPlugin } from "./esbuild-plugin";

const DEFAULT_WASM_URL = "https://unpkg.com/esbuild-wasm@0.24.2/esbuild.wasm";

let initPromise: Promise<void> | null = null;

/**
 * Ensure esbuild-wasm is initialized (call once before first build).
 */
export async function ensureEsbuildInit(wasmURL?: string): Promise<void> {
  if (initPromise) return initPromise;
  initPromise = esbuild.initialize({
    wasmURL: wasmURL ?? DEFAULT_WASM_URL,
    worker: typeof Worker !== "undefined",
  });
  await initPromise;
}

/**
 * Bundle the entry file with virtual FS. Externals are not bundled; use import map in HTML.
 */
export async function runBuild(
  files: Record<string, string>,
  entryPath: string,
  external: string[] = []
): Promise<{ bundle: string }> {
  await ensureEsbuildInit();
  const fileMap = createFileMap(files);

  const entryContent = fileMap.get(entryPath);
  if (!entryContent) {
    throw new Error(`Entry file not found: ${entryPath}`);
  }
  const resolveDir = entryPath.includes("/") ? entryPath.replace(/\/[^/]*$/, "") : ".";

  const result = await esbuild.build({
    stdin: {
      contents: entryContent,
      sourcefile: entryPath,
      resolveDir,
      loader: entryPath.endsWith(".tsx") ? "tsx" : entryPath.endsWith(".ts") ? "ts" : "js",
    },
    bundle: true,
    format: "esm",
    write: false,
    external,
    plugins: [virtualFsPlugin(fileMap)],
  });

  const out = result.outputFiles?.[0];
  if (!out?.text) {
    const err = result.errors?.[0];
    throw new Error(err?.text ?? "Build failed: no output.");
  }
  return { bundle: out.text };
}
