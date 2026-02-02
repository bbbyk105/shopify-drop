import { Metadata } from "next";
import { products } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import NewArrivalsClient from "./NewArrivalsClient";
import { buildPageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMeta(
  "New Arrivals - Evimeria Home",
  "Discover our latest collection of elegant lighting solutions and home decor.",
  "new-arrivals",
);

/** ISR: 600秒で再検証。カテゴリ一覧。 */
export const revalidate = 600;

export default async function NewArrivalsPage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(50);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;

  // New Arrivals: 新しい商品から左から順に表示
  // ShopifyのAPIは新しい順（CREATED_AT DESC）で返すため、そのまま使用
  // 配列の最初が最新商品、最後が最古商品
  const newProducts = allProducts;

  return <NewArrivalsClient products={newProducts} />;
}
