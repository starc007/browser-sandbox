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
): Promise<{ bundle: string; css?: string }> {
  await ensureEsbuildInit();
  const fileMap = createFileMap(files);

  const entryContent = fileMap.get(entryPath);
  if (!entryContent) {
    throw new Error(`Entry file not found: ${entryPath}`);
  }
  const resolveDir = entryPath.includes("/")
    ? entryPath.replace(/\/[^/]*$/, "")
    : ".";
  const sourcefile = entryPath.includes("/")
    ? entryPath.split("/").pop()
    : entryPath;
  const loader =
    entryPath.endsWith(".tsx") || entryPath.endsWith(".jsx")
      ? entryPath.endsWith(".tsx")
        ? "tsx"
        : "jsx"
      : entryPath.endsWith(".ts")
      ? "ts"
      : "js";

  const result = await esbuild.build({
    stdin: {
      contents: entryContent,
      sourcefile,
      resolveDir,
      loader,
    },
    bundle: true,
    format: "esm",
    write: false,
    outdir: ".",
    external,
    jsx: "automatic",
    plugins: [virtualFsPlugin(fileMap)],
  });

  const outputs = result.outputFiles ?? [];
  let bundle = "";
  let css: string | undefined;

  const norm = (p: string) => p.replace(/\\/g, "/").toLowerCase();

  for (const out of outputs) {
    const path = norm(out.path || "");
    const text = out.text;
    if (path.endsWith(".css") || looksLikeCss(text)) {
      css = text;
    } else if (path.endsWith(".js") || !looksLikeCss(text)) {
      bundle = text;
    }
  }

  if (!bundle) {
    const err = result.errors?.[0];
    throw new Error(err?.text ?? "Build failed: no output.");
  }
  return { bundle, css };
}

function looksLikeCss(text: string): boolean {
  const sample = text.trim().slice(0, 500);
  if (!sample.length) return false;
  // JS indicators — do not treat as CSS
  if (
    /\b(const|let|var|function)\s+\w|=>\s*\{|document\.|window\.|getElementById|addEventListener|\.insertAdjacentHTML|createChart|\.setData\(|createRoot|React\.|from\s+["']react|\b(import|export)\s+[\s\('"{}]/.test(
      sample
    )
  )
    return false;
  // CSS @-rules
  if (/^@(import|media|keyframes|charset|font-face)\s/i.test(sample))
    return true;
  // CSS selector { property: — avoid matching JS object literals (e.g. "const x = { key:")
  // Real CSS has selectors like #id, .class, or tag before {; JS has "= {" or ", key:"
  if (/[#\.][\w\-]+\s*\{|^[\w\-]+\s*\{\s*[a-z\-]+:\s*/.test(sample))
    return true;
  return false;
}
