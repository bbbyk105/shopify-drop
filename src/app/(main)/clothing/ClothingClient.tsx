"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface ClothingClientProps {
  products: Product[];
}

export default function ClothingClient({ products }: ClothingClientProps) {
  return (
    <ProductsList
      products={products}
      title="Clothing & Apparel"
      description="Discover our curated collection of premium clothing and apparel. From comfortable everyday wear to stylish statement pieces, find the perfect items to express your personal style."
      itemsPerPage={8}
      currentCategory="/clothing"
      filterConfig={{
        showColor: true,
        showSize: true,
        showType: true,
        showStyle: true,
        showMaterial: true,
      }}
    />
  );
}
