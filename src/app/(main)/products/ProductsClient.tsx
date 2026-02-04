"use client";

import ProductsList from "@/components/ProductsList";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface ProductsClientProps {
  products: Product[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  return (
    <ProductsList
      products={products}
      title="All Products"
      description="Browse all of Evimeria's Contemporary, Mid Century & Modern Furniture."
      itemsPerPage={20}
      currentCategory="/products"
      filterConfig={{
        showProduct: true,
        showRoom: true,
        showMaterial: true,
      }}
    />
  );
}
