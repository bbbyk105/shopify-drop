"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface LightingClientProps {
  products: Product[];
}

type SortOption =
  | "featured"
  | "price-low"
  | "price-high"
  | "newest"
  | "name-az";

export default function LightingClient({ products }: LightingClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>("featured");

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

      case "newest":
        return productsCopy.reverse(); // 最新順（配列を逆順）

      case "featured":
      default:
        return productsCopy; // 元の順序を維持
    }
  }, [products, sortOption]);

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Header with Stats */}
      <div className="mb-12 border-b pb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <p className="text-muted-foreground text-sm mb-2">
              {sortedProducts.length} premium lighting solutions
            </p>
            <h2 className="text-2xl font-bold">Discover Your Perfect Light</h2>
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-secondary border border-border rounded-lg px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="featured">Sort by: Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Grid Layout - Different from New Arrivals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {sortedProducts.map((product) => (
          <div key={product.id}>
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
