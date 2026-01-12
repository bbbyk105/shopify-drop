import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";

/**
 * セール商品があるかどうかをチェック
 */
export async function hasSaleProducts(): Promise<boolean> {
  try {
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

    return saleProducts.length > 0;
  } catch (error) {
    console.error("Error checking sale products:", error);
    // エラー時はローカル商品がある場合はtrueを返す
    return products.length > 0;
  }
}

