"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface OutdoorClientProps {
  products: Product[];
}

export default function OutdoorClient({ products }: OutdoorClientProps) {
  return (
    <ProductsList
      products={products}
      title="Outdoor"
      description="Transform your outdoor space into an extension of your home with our curated collection of outdoor furniture and decor."
      itemsPerPage={8}
      currentCategory="/rooms/outdoor"
      filterConfig={{
        showColor: true,
        showMaterial: true,
      }}
    />
  );
}
