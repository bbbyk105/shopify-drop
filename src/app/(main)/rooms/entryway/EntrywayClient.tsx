"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface EntrywayClientProps {
  products: Product[];
}

export default function EntrywayClient({ products }: EntrywayClientProps) {
  return (
    <ProductsList
      products={products}
      title="Entryway"
      description="First impressions matter. Create an inviting entryway that sets the tone for your entire home."
      itemsPerPage={8}
      currentCategory="/rooms/entryway"
      filterConfig={{
        showColor: true,
        showMaterial: true,
      }}
    />
  );
}
