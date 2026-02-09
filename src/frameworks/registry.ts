import type { FrameworkAdapter } from "./types";
import { reactAdapter, vanillaAdapter } from "./adapters";

export function getAdapter(name: string): FrameworkAdapter {
  switch (name) {
    case "react":
      return reactAdapter;
    case "vanilla":
      return vanillaAdapter;
    default:
      throw new Error(
        `Unknown framework: '${name}'. Supported: react, vanilla.`
      );
  }
}

export function getSupportedFrameworks(): string[] {
  return ["react", "vanilla"];
}
