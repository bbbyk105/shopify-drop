"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface DiningRoomKitchenClientProps {
  products: Product[];
}

export default function DiningRoomKitchenClient({
  products,
}: DiningRoomKitchenClientProps) {
  return (
    <ProductsList
      products={products}
      title="Dining Room & Kitchen"
      description="Where meals become memories. Design a space that brings people together."
      itemsPerPage={8}
      currentCategory="/rooms/dining-room-kitchen"
      filterConfig={{
        showMaterial: true,
      }}
    />
  );
}
