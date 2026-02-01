import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import HomeOfficeClient from "./HomeOfficeClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";
import { buildPageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMeta(
  "Home Office - Evimeria Home",
  "Design a productive and inspiring home office space.",
  "rooms/home-office",
);

/** ISR: 600秒で再検証。カテゴリ一覧。 */
export const revalidate = 600;

export default async function HomeOfficePage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;
  const officeProducts = filterProductsByRoom(allProducts, "home-office");

  return <HomeOfficeClient products={officeProducts} />;
}
