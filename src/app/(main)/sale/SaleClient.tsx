"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface SaleClientProps {
  products: Product[];
}

export default function SaleClient({ products }: SaleClientProps) {
  return (
    <ProductsList
      products={products}
      title="Sale"
      description="Limited-time offers. Save 20% to 50% on select furniture and home decor."
      itemsPerPage={20}
      currentCategory="/sale"
      filterConfig={{
        showProduct: true,
        showRoom: true,
        showMaterial: true,
      }}
    />
  );
}
