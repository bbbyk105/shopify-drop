"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface NewArrivalsClientProps {
  products: Product[];
}

type SortOption = "latest" | "price-low" | "price-high" | "name-az";

export default function NewArrivalsClient({ products }: NewArrivalsClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>("latest");

  const sortedProducts = useMemo(() => {
    const productsCopy = [...products];

    switch (sortOption) {
      case "price-low":
        return productsCopy.sort((a, b) => {
          const priceA =
            "priceRange" in a
              ? parseFloat(a.priceRange.minVariantPrice.amount)
              : a.price;
          const priceB =
            "priceRange" in b
              ? parseFloat(b.priceRange.minVariantPrice.amount)
              : b.price;
          return priceA - priceB;
        });

      case "price-high":
        return productsCopy.sort((a, b) => {
          const priceA =
            "priceRange" in a
              ? parseFloat(a.priceRange.minVariantPrice.amount)
              : a.price;
          const priceB =
            "priceRange" in b
              ? parseFloat(b.priceRange.minVariantPrice.amount)
              : b.price;
          return priceB - priceA;
        });

      case "name-az":
        return productsCopy.sort((a, b) => {
          const nameA = "title" in a ? a.title : a.name;
          const nameB = "title" in b ? b.title : b.name;
          return nameA.localeCompare(nameB);
        });

      case "latest":
      default:
        return productsCopy; // 元の順序を維持
    }
  }, [products, sortOption]);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <p className="text-muted-foreground">
          Showing {sortedProducts.length} products
        </p>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as SortOption)}
          className="bg-secondary border border-border rounded-md px-4 py-2"
        >
          <option value="latest">Sort by: Latest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name-az">Name: A to Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

