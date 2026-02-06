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
  // Shopifyから商品を取得（在庫ありの最新8件。多めに取得して在庫で絞ってから8件に）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(24);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;
  // 在庫ありに絞ってから先頭8件（ProductsListの「在庫あり」フィルターで1件消えないようにする）
  const inStockProducts = allProducts.filter(
    (p) => !("availableForSale" in p) || p.availableForSale !== false
  );
  const newProducts = inStockProducts.slice(0, 8);

  return <NewArrivalsClient products={newProducts} />;
}
