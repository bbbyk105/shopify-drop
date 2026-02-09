import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFastShippingProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import FastShippingClient from "./FastShippingClient";
import { buildPageMeta } from "@/lib/seo/meta";

export const metadata: Metadata = buildPageMeta(
  "Fast Shipping - Evimeria Home",
  "Get your order in 1–3 days. Browse items with fast delivery available.",
  "fast-shipping",
);

/** ISR: 600秒で再検証 */
export const revalidate = 600;

export default async function FastShippingPage() {
  let fastShippingProducts: ShopifyProduct[] = [];
  try {
    fastShippingProducts = await getFastShippingProducts(100);
  } catch (error) {
    console.error("Failed to fetch fast shipping products:", error);
  }

  if (fastShippingProducts.length === 0) {
    notFound();
  }

  return <FastShippingClient products={fastShippingProducts} />;
}
