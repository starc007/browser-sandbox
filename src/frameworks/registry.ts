import type { FrameworkAdapter } from "./types";
import { reactAdapter, vanillaAdapter } from "./adapters";

const adapters: Record<string, FrameworkAdapter> = {
  react: reactAdapter,
  vanilla: vanillaAdapter,
};

export function getAdapter(name: string): FrameworkAdapter {
  const adapter = adapters[name];
  if (!adapter) {
    const supported = Object.keys(adapters).join(", ");
    throw new Error(`Unknown framework: '${name}'. Supported: ${supported}.`);
  }
  return adapter;
}

export function getSupportedFrameworks(): string[] {
  return Object.keys(adapters);
}
