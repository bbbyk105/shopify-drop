import { Metadata } from "next";
import { products } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import LightingClient from "./LightingClient";

export const metadata: Metadata = {
  title: "Lighting Collection - Lumina Luxe",
  description: "Browse our complete collection of premium lighting solutions.",
};

export default async function LightingPage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(50);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts: ShopifyProduct[] | typeof products =
    shopifyProducts.length > 0 ? shopifyProducts : products;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Lighting Collection
            </h1>
            <p className="text-xl text-muted-foreground">
              Illuminate your world with our curated selection of contemporary
              and classic lighting designs.
            </p>
          </div>
        </div>
      </section>

      <LightingClient products={allProducts} />
    </div>
  );
}
