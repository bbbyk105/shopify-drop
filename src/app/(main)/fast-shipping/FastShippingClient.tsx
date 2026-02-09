"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface FastShippingClientProps {
  products: Product[];
}

export default function FastShippingClient({
  products,
}: FastShippingClientProps) {
  return (
    <ProductsList
      products={products}
      title="Fast Shipping"
      description="Items that arrive in 1–3 days. Get your order delivered quickly."
      itemsPerPage={20}
      currentCategory="/fast-shipping"
      filterConfig={{
        showProduct: true,
        showRoom: true,
        showMaterial: true,
      }}
    />
  );
}
