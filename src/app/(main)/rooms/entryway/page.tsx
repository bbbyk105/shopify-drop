import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import EntrywayClient from "./EntrywayClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Entryway - Evimeria Home",
  description: "Make a lasting first impression with our entryway collection.",
};

export default async function EntrywayPage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;
  const entrywayProducts = filterProductsByRoom(allProducts, "entryway");

  return <EntrywayClient products={entrywayProducts} />;
}
