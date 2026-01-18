"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface EntrywayClientProps {
  products: Product[];
}

type SortOption = "popularity" | "price-high" | "price-low" | "newest";

const ITEMS_PER_LOAD = 20;

const colorMap: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  gray: "#808080",
  grey: "#808080",
  brown: "#8B4513",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  navy: "#000080",
  cream: "#FFFDD0",
};

export default function EntrywayClient({ products }: EntrywayClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [showCount, setShowCount] = useState(ITEMS_PER_LOAD);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    switch (sortOption) {
      case "price-high":
        return filtered.sort((a, b) => {
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
      case "price-low":
        return filtered.sort((a, b) => {
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
      case "newest":
        return filtered;
      case "popularity":
      default:
        return filtered;
    }
  }, [products, sortOption]);

  const displayedProducts = filteredAndSortedProducts.slice(0, showCount);
  const hasMore = showCount < filteredAndSortedProducts.length;

  return (
    <div className="bg-background min-h-screen">
      {/* Compact Hero with Card Style */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Entryway
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  First impressions matter. Create an inviting entryway that sets
                  the tone for your entire home.
                </p>
              </div>
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-secondary/30">
                <Image
                  src="/images/entryway.webp"
                  alt="Entryway"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <main className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Entryway Collection</h2>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="popularity">Sort by: Popularity</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          {/* Card Style Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProducts.map((product) => {
              const isShopifyProduct = "handle" in product;
              const price = isShopifyProduct
                ? parseFloat(product.priceRange.minVariantPrice.amount)
                : product.price;
              const compareAtPrice = isShopifyProduct
                ? product.compareAtPriceRange?.minVariantPrice
                  ? parseFloat(
                      product.compareAtPriceRange.minVariantPrice.amount
                    )
                  : null
                : null;
              const hasSale = compareAtPrice && compareAtPrice > price;
              const image = isShopifyProduct
                ? product.featuredImage?.url ||
                  product.images.edges[0]?.node.url ||
                  "/placeholder.png"
                : product.image;
              const title = isShopifyProduct ? product.title : product.name;
              const slug = isShopifyProduct ? product.handle : product.slug;

              return (
                <Link
                  key={product.id}
                  href={`/products/${slug}`}
                  className="group block"
                >
                  <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 mb-4">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {hasSale && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                      {isShopifyProduct &&
                        product.variants.edges.length > 0 && (
                          <div className="absolute bottom-2 left-2 flex gap-1">
                            {product.variants.edges
                              .slice(0, 3)
                              .map(({ node }) => {
                                const colorOption = node.selectedOptions.find(
                                  (opt) => opt.name.toLowerCase() === "color"
                                );
                                if (colorOption) {
                                  const colorKey =
                                    colorOption.value.toLowerCase();
                                  const colorValue =
                                    colorMap[colorKey] || "#808080";
                                  return (
                                    <div
                                      key={node.id}
                                      className="w-4 h-4 rounded-full border border-white shadow-sm"
                                      style={{ backgroundColor: colorValue }}
                                    />
                                  );
                                }
                                return null;
                              })}
                          </div>
                        )}
                    </div>
                    <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-lg font-bold">{formatPrice(price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {hasMore && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground mb-4">
                Showing {displayedProducts.length} of{" "}
                {filteredAndSortedProducts.length}
              </p>
              <Button
                onClick={() => setShowCount((prev) => prev + ITEMS_PER_LOAD)}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
              >
                SEE MORE
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
