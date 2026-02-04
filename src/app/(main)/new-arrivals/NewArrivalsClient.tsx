"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface NewArrivalsClientProps {
  products: Product[];
}

export default function NewArrivalsClient({
  products,
}: NewArrivalsClientProps) {
  return (
    <ProductsList
      products={products}
      title="New Arrivals"
      description="Explore our latest collection of contemporary lighting designs. Each piece is carefully curated to bring elegance and sophistication to your space."
      itemsPerPage={8}
      currentCategory="/new-arrivals"
      filterConfig={{
        showMaterial: true,
        showRoom: true,
      }}
    />
  );
}
