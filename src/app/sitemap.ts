import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/site-url";
import { STATIC_PATHS, getRoomPaths } from "@/lib/seo/routes";
import { getAllProducts } from "@/lib/shopify/queries/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  // 静的ページ: /, /products, /lighting, /clothing, /sale, /new-arrivals
  for (const path of STATIC_PATHS) {
    const url = path === "" ? `${base}/` : `${base}/${path}`;
    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: path === "" ? "weekly" : "weekly",
      priority: path === "" ? 1 : 0.9,
    });
  }

  // /rooms/* 固定スラッグ
  const roomPaths = getRoomPaths();
  for (const path of roomPaths) {
    entries.push({
      url: `${base}/${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // 商品ページ: Shopify の handle を重複排除して列挙
  let productHandles: string[] = [];
  try {
    const products = await getAllProducts(250);
    const handles = products.map((p) => p.handle).filter(Boolean);
    productHandles = [...new Set(handles)];
  } catch (e) {
    console.error("Sitemap: failed to fetch products", e);
  }

  for (const handle of productHandles) {
    entries.push({
      url: `${base}/products/${handle}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  return entries;
}
