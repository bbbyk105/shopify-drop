"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface HomeOfficeClientProps {
  products: Product[];
}

export default function HomeOfficeClient({ products }: HomeOfficeClientProps) {
  return (
    <ProductsList
      products={products}
      title="Home Office"
      description="Where productivity meets style. Design a workspace that inspires creativity and focus."
      itemsPerPage={8}
      currentCategory="/rooms/home-office"
      filterConfig={{
        showColor: true,
        showMaterial: true,
      }}
    />
  );
}
