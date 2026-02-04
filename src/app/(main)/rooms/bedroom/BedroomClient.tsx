"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface BedroomClientProps {
  products: Product[];
}

export default function BedroomClient({ products }: BedroomClientProps) {
  return (
    <ProductsList
      products={products}
      title="Bedroom"
      description="Your personal sanctuary. Design a space where comfort meets style."
      itemsPerPage={8}
      currentCategory="/rooms/bedroom"
      filterConfig={{
        showMaterial: true,
      }}
    />
  );
}
