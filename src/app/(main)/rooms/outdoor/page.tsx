import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import OutdoorClient from "./OutdoorClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Outdoor - Evimeria Home",
  description: "Transform your outdoor spaces with our premium outdoor collection.",
};

export default async function OutdoorPage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;
  const outdoorProducts = filterProductsByRoom(allProducts, "outdoor");

  return <OutdoorClient products={outdoorProducts} />;
}
