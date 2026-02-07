/**
 * TODO: Replace with product metafields or CMS.
 * - videoUrl / posterUrl: per-product or global lifestyle asset
 * - Bundle data: from metafields (e.g. product.metafields.bundles)
 */

export const PDP_LIFESTYLE_VIDEO = {
  /** Lived-in room video; if empty, section uses poster only */
  videoUrl: null as string | null,
  /** Fallback/poster image (required) */
  posterUrl: "/images/living_room.webp",
  caption: "A calm room, built around comfort.",
} as const;
