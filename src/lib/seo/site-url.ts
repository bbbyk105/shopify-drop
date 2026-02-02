/**
 * 本番ドメインは NEXT_PUBLIC_SITE_URL を唯一のソースとして扱う。
 * canonical / metadataBase / sitemap はすべてこれを参照。
 * dev fallback: http://localhost:3000
 */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) return url.replace(/\/$/, "");
  return "http://localhost:3000";
}
