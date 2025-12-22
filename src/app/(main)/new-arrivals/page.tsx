import { Metadata } from "next";
import { products } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import NewArrivalsClient from "./NewArrivalsClient";

export const metadata: Metadata = {
  title: "New Arrivals - Lumina Luxe",
  description:
    "Discover our latest collection of elegant lighting solutions and home decor.",
};

export default async function NewArrivalsPage() {
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
  
  // New Arrivals: 最新商品として表示（取得順を新しい順とみなす）
  const newProducts = allProducts;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              New Arrivals
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our latest collection of contemporary lighting designs.
              Each piece is carefully curated to bring elegance and
              sophistication to your space.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <NewArrivalsClient products={newProducts} />
    </div>
  );
}
