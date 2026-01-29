import type { Metadata } from "next";
import { getSiteUrl } from "./site-url";

/**
 * 共通: canonical URL を生成（クエリなし）。
 * 将来 searchParams でフィルターを出す場合は、noindex / canonical 戦略をここで分岐可能。
 */
export function buildCanonical(path: string): string {
  const base = getSiteUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalizedPath}`;
}

/**
 * 商品ページ用メタデータ生成（title / description / canonical）
 */
export function buildProductMeta(
  title: string,
  description: string | null,
  slug: string,
): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}/products/${slug}`;
  const desc = description?.trim() || undefined;
  return {
    title: `${title} | Evimeria Home`,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: title,
      description: desc ?? undefined,
      url: canonical,
    },
    twitter: {
      title: title,
      description: desc ?? undefined,
    },
  };
}

/**
 * 一覧・カテゴリ・ルームページ用メタデータ（現状 searchParams なしのため単純設定）
 */
export function buildPageMeta(
  title: string,
  description: string,
  path: string,
): Metadata {
  const canonical = buildCanonical(path);
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      title,
      description,
    },
  };
}
