"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface LivingRoomClientProps {
  products: Product[];
}

export default function LivingRoomClient({ products }: LivingRoomClientProps) {
  return (
    <ProductsList
      products={products}
      title="Living Room"
      description="Create a space that reflects your style and welcomes everyone home."
      itemsPerPage={8}
      currentCategory="/rooms/living-room"
      filterConfig={{
        showColor: true,
        showMaterial: true,
      }}
    />
  );
}
