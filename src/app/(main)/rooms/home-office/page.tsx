import { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import HomeOfficeClient from "./HomeOfficeClient";
import { filterProductsByRoom } from "@/lib/utils/room-filters";

export const metadata: Metadata = {
  title: "Home Office - Evimeria Home",
  description: "Design a productive and inspiring home office space.",
};

export default async function HomeOfficePage() {
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(100);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  const allProducts =
    shopifyProducts.length > 0 ? shopifyProducts : products;
  const officeProducts = filterProductsByRoom(allProducts, "home-office");

  return <HomeOfficeClient products={officeProducts} />;
}
