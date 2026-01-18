import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import LivingRoomClient from "./LivingRoomClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Living Room - Evimeria Home",
  description: "Discover elegant furniture and decor for your living room.",
};

export default async function LivingRoomPage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;
  const livingRoomProducts = filterProductsByRoom(allProducts, "living-room");

  return <LivingRoomClient products={livingRoomProducts} />;
}
