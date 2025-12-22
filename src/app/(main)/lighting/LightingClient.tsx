"use client";

import { useState, useMemo } from "react";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/lib/utils";
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

      {/* Featured Product (First Product - Larger) */}
      {sortedProducts.length > 0 && (
        <div className="mb-16">
          <div className="bg-linear-to-br from-primary/5 via-secondary/30 to-primary/5 rounded-3xl p-8 md:p-12 border border-primary/10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
                  Featured Lighting
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-4">
                  {("title" in sortedProducts[0]
                    ? sortedProducts[0].title
                    : sortedProducts[0].name) || "Premium Lighting"}
                </h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {("description" in sortedProducts[0]
                    ? sortedProducts[0].description
                    : sortedProducts[0].description) ||
                    "Illuminate your space with style"}
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold">
                    {formatPrice(
                      "priceRange" in sortedProducts[0]
                        ? parseFloat(
                            sortedProducts[0].priceRange.minVariantPrice.amount
                          )
                        : sortedProducts[0].price
                    )}
                  </span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <ProductCard product={sortedProducts[0]} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Layout - Different from New Arrivals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {sortedProducts.slice(1).map((product, index) => (
          <div
            key={product.id}
            className={`${
              index % 3 === 0 && index < 3 ? "md:col-span-2 lg:col-span-1" : ""
            }`}
          >
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <ProductCard product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
