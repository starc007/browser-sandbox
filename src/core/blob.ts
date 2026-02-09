/**
 * Create a Blob URL from an HTML string for iframe loading.
 */
export function createBlobUrl(html: string): string {
  const blob = new Blob([html], { type: "text/html" });
  return URL.createObjectURL(blob);
}
