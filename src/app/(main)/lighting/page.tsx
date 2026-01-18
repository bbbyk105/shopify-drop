import { Metadata } from "next";
import { products } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import LightingClient from "./LightingClient";
import { filterProductsByLighting } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Lighting Collection - Lumina Luxe",
  description: "Browse our complete collection of premium lighting solutions.",
};

export default async function LightingPage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;

  // "Lighting"タグでフィルタリング
  const lightingProducts = filterProductsByLighting(allProducts);

  return <LightingClient products={lightingProducts} />;
}
