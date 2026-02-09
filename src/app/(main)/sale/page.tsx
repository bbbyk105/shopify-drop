import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import SaleClient from "./SaleClient";
import { buildPageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMeta(
  "Sale - Evimeria Home",
  "Save on select furniture and home decor. Limited-time offers on contemporary and modern pieces.",
  "sale",
);

/** ISR: 600秒で再検証 */
export const revalidate = 600;

function isProductOnSale(
  product: ShopifyProduct | (typeof products)[0],
): boolean {
  const isShopify = "handle" in product;

  if (isShopify) {
    const p = product as ShopifyProduct;
    const price = parseFloat(p.priceRange.minVariantPrice.amount);
    const compareAt = p.compareAtPriceRange?.minVariantPrice
      ? parseFloat(p.compareAtPriceRange.minVariantPrice.amount)
      : null;
    return compareAt != null && compareAt > 0 && compareAt > price;
  }

  // ローカルのダミー商品はセール扱いにしない
  return false;
}

export default async function SalePage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;
  const saleProducts = allProducts.filter(isProductOnSale);

  return <SaleClient products={saleProducts} />;
}
