/**
 * Turn thrown errors into short, human-readable messages for the SDK result.
 */
export function formatError(err: unknown): string {
  const raw = err instanceof Error ? err.message : String(err);

  if (raw.includes("Unknown framework") || raw.includes("Unsupported framework"))
    return `Unsupported framework. Choose "react" or "vanilla".`;

  if (raw.includes("Entry file not found") && raw.includes("Expected one of:"))
    return `No entry file found. For React, add one of: src/main.jsx, src/main.tsx, main.jsx, or main.tsx. For Vanilla, add index.html.`;

  if (raw.includes("Entry file not found") && raw.includes("Vanilla"))
    return `No index.html found. For Vanilla, your project must include an index.html file.`;

  if (raw.includes("Entry script not found in files"))
    return `The script referenced in index.html is missing from your files. Add that file or fix the script src.`;

  if (raw.includes("index.html not found"))
    return `index.html is missing from your project files.`;

  if (raw.includes("Could not resolve") || raw.includes("resolve"))
    return `A file or module could not be found. Check that all imported files are included in your project.`;

  if (raw.includes("Build failed"))
    return raw.replace(/^Build failed:\s*/i, "").trim() || "The build failed. Check your code for syntax or import errors.";

  if (raw.includes("ERROR:") && raw.includes(":")) {
    const match = raw.match(/(?:ERROR:\s*)?([^:\n]+:\s*.+?)(?:\n|$)/);
    const line = match ? match[1].trim() : raw;
    return line.length > 200 ? line.slice(0, 197) + "…" : line;
  }

  if (raw.length > 300)
    return raw.slice(0, 297).trim() + "…";

  return raw.trim() || "Something went wrong. Please try again.";
}
