import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import DiningRoomKitchenClient from "./DiningRoomKitchenClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Dining Room & Kitchen - Evimeria Home",
  description: "Elevate your dining and kitchen spaces with our premium collection.",
};

export default async function DiningRoomKitchenPage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;
  const diningProducts = filterProductsByRoom(
    allProducts,
    "dining-room-kitchen"
  );

  return <DiningRoomKitchenClient products={diningProducts} />;
}
