import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import BedroomClient from "./BedroomClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Bedroom - Evimeria Home",
  description: "Create your perfect bedroom sanctuary with our curated collection.",
};

export default async function BedroomPage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;
  const bedroomProducts = filterProductsByRoom(allProducts, "bedroom");

  return <BedroomClient products={bedroomProducts} />;
}
