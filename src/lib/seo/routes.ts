/**
 * 公開URLのルート定義（sitemap / canonical 用）。
 * route group (main) は公開URLには出さない。
 * /rooms/* は固定スラッグ配列（将来CMS化時に差し替え可能）。
 */

/** 静的ページパス（先頭スラッシュなしで統一してもよいが、sitemapでは / 付与） */
export const STATIC_PATHS = [
  "",
  "products",
  "lighting",
  "clothing",
  "sale",
  "new-arrivals",
] as const;

/** ルームページのスラッグ一覧。将来CMS化時はここをAPI/設定から取得に差し替え */
export const ROOM_SLUGS = [
  "living-room",
  "bedroom",
  "dining-room-kitchen",
  "entryway",
  "home-office",
  "outdoor",
] as const;

export type RoomSlug = (typeof ROOM_SLUGS)[number];

/** ルームの公開URLパス（/rooms/xxx）を生成 */
export function getRoomPaths(): string[] {
  return ROOM_SLUGS.map((slug) => `rooms/${slug}`);
}
