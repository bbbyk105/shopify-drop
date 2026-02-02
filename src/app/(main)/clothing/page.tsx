import { Metadata } from "next";
import { products } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import ClothingClient from "./ClothingClient";
import { filterProductsByClothing } from "@/lib/utils/room-filters";
import { buildPageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMeta(
  "Clothing Collection - Evimeria Home",
  "Browse our complete collection of premium clothing and apparel.",
  "clothing",
);

/** ISR: 600秒で再検証。カテゴリ一覧。 */
export const revalidate = 600;

export default async function ClothingPage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    // Storefront APIの`first`は最大250。新規商品が取得上限外になるのを防ぐため増やす
    shopifyProducts = await getAllProducts(250);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;

  // "Clothing"タグでフィルタリング
  const clothingProducts = filterProductsByClothing(allProducts);

  return <ClothingClient products={clothingProducts} />;
}
