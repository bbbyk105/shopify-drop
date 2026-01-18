"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface OutdoorClientProps {
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

export default function OutdoorClient({ products }: OutdoorClientProps) {
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
      {/* Full Screen Hero */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/outdoor.webp"
            alt="Outdoor"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
        </div>
        <div className="container relative mx-auto px-4 h-full flex items-center justify-center">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Outdoor
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Extend your living space outdoors. Create an oasis that invites
              relaxation and connection with nature.
            </p>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <main className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold">Outdoor Collection</h2>
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

          {/* Mosaic Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product, index) => {
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

              // 最初の商品を大きく表示
              const isLarge = index === 0;

              return (
                <Link
                  key={product.id}
                  href={`/products/${slug}`}
                  className={`group block ${
                    isLarge ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden rounded-lg bg-secondary/30 mb-3 ${
                      isLarge ? "aspect-[4/5]" : "aspect-square"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes={
                        isLarge
                          ? "(max-width: 768px) 100vw, 50vw"
                          : "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      }
                    />
                    {hasSale && (
                      <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}
                    {isShopifyProduct && product.variants.edges.length > 0 && (
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        {product.variants.edges.slice(0, 3).map(({ node }) => {
                          const colorOption = node.selectedOptions.find(
                            (opt) => opt.name.toLowerCase() === "color"
                          );
                          if (colorOption) {
                            const colorKey = colorOption.value.toLowerCase();
                            const colorValue = colorMap[colorKey] || "#808080";
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
                  <h3
                    className={`font-medium mb-1 group-hover:text-primary transition-colors ${
                      isLarge ? "text-lg" : "text-base"
                    }`}
                  >
                    {title}
                  </h3>
                  <p className={`font-bold ${isLarge ? "text-lg" : "text-base"}`}>
                    {formatPrice(price)}
                  </p>
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
