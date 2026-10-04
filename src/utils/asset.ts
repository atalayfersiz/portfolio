export function getAssetPath(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (basePath && url.startsWith("/") && !url.startsWith(basePath)) {
    return `${basePath}${url}`;
  }
  return url;
}
