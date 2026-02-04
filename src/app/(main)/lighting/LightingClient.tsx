"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface LightingClientProps {
  products: Product[];
}

export default function LightingClient({ products }: LightingClientProps) {
  return (
    <ProductsList
      products={products}
      title="Lighting Collection"
      description="Browse our complete collection of premium lighting solutions."
      titleLevel="h2"
      itemsPerPage={8}
      currentCategory="/lighting"
      filterConfig={{
        showMaterial: true,
        showRoom: true,
      }}
    />
  );
}
