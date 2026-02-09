import type { Plugin } from "esbuild-wasm";
import { normalizePath, getFile, createFileMap } from "./virtual-fs";

type FileMap = ReturnType<typeof createFileMap>;

/**
 * esbuild plugin that resolves and loads all modules from an in-memory file map.
 */
export function virtualFsPlugin(files: FileMap): Plugin {
  return {
    name: "virtual-fs",
    setup(build) {
      build.onResolve({ filter: /.*/ }, (args) => {
        const dir =
          args.resolveDir ||
          (args.importer && args.path.startsWith(".")
            ? args.importer.replace(/\/[^/]*$/, "") || "."
            : ".");
        let path: string;
        if (args.path.startsWith(".") || args.path.startsWith("/")) {
          path = resolvePath(dir, args.path);
        } else {
          // External (e.g. react, react-dom) - let esbuild handle or mark external
          return null;
        }
        const normalized = normalizePath(path);
        if (files.has(normalized)) {
          return { path: normalized, namespace: "virtual" };
        }
        // Try with extension (e.g. ./App -> ./App.tsx)
        const hasExt = /\.(tsx?|jsx?|mjs|cjs)$/.test(normalized);
        if (!hasExt) {
          for (const ext of [".tsx", ".ts", ".jsx", ".js"]) {
            const withExt = normalized + ext;
            if (files.has(withExt)) {
              return { path: withExt, namespace: "virtual" };
            }
          }
        }
        // Try directory index
        for (const suffix of ["/index.tsx", "/index.ts", "/index.jsx", "/index.js"]) {
          const withIndex = normalized + suffix;
          if (files.has(withIndex)) {
            return { path: withIndex, namespace: "virtual" };
          }
        }
        return null;
      });

      build.onLoad({ filter: /.*/, namespace: "virtual" }, (args) => {
        const content = getFile(files, args.path);
        if (content === null) {
          return { contents: "", loader: "js" };
        }
        const ext = (args.path.split(".").pop() ?? "js").toLowerCase();
        const loader =
          ext === "tsx"
            ? "tsx"
            : ext === "ts"
              ? "ts"
              : ext === "jsx"
                ? "jsx"
                : ext === "css"
                  ? "css"
                  : "js";
        return { contents: content, loader };
      });
    },
  };
}

/** Resolve a path relative to a directory (browser-safe, no Node path). */
function resolvePath(dir: string, request: string): string {
  const base = dir.replace(/\\/g, "/");
  const req = request.replace(/\\/g, "/");
  if (req.startsWith("/")) return req.slice(1);
  const parts = [...base.split("/").filter(Boolean), ...req.split("/")];
  const out: string[] = [];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") {
      out.pop();
      continue;
    }
    out.push(p);
  }
  return out.join("/");
}
