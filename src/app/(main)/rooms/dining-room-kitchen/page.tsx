import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import DiningRoomKitchenClient from "./DiningRoomKitchenClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";
import { buildPageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMeta(
  "Dining Room & Kitchen - Evimeria Home",
  "Elevate your dining and kitchen spaces with our premium collection.",
  "rooms/dining-room-kitchen",
);

export default async function DiningRoomKitchenPage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;
  const diningProducts = filterProductsByRoom(
    allProducts,
    "dining-room-kitchen",
  );

  return <DiningRoomKitchenClient products={diningProducts} />;
}
