import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import SaleClient from "./SaleClient";

export const metadata: Metadata = {
  title: "Sale - Lumina Luxe",
  description: "Discover amazing deals on premium lighting and home decor.",
};

export default async function SalePage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(50);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;

  // セール商品をフィルター（compareAtPriceがある商品）
  const saleProducts = allProducts.filter((product) => {
    if ("priceRange" in product) {
      // Shopify商品の場合
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : null;

      // バリアントレベルでもチェック
      const hasVariantDiscount = product.variants.edges.some(({ node }) => {
        if (node.compareAtPrice) {
          const variantPrice = parseFloat(node.price.amount);
          const variantCompareAtPrice = parseFloat(node.compareAtPrice.amount);
          return variantCompareAtPrice > variantPrice;
        }
        return false;
      });

      return (
        (compareAtPrice !== null && compareAtPrice > price) || hasVariantDiscount
      );
    } else {
      // ローカル商品の場合（現在は全てセールとして扱う）
      return true;
    }
  });

  // セール商品がない場合は404を表示
  if (saleProducts.length === 0) {
    notFound();
  }

  return <SaleClient products={saleProducts} />;
}
