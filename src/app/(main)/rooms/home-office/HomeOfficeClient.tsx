"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Grid3x3, List, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface HomeOfficeClientProps {
  products: Product[];
}

type SortOption = "popularity" | "price-high" | "price-low" | "newest";
type ViewMode = "grid" | "list";

const ITEMS_PER_PAGE = 8;

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

export default function HomeOfficeClient({
  products,
}: HomeOfficeClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);

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

  // ページネーション計算
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedProducts = filteredAndSortedProducts.slice(startIndex, endIndex);

  // ソート変更時にページを1にリセット
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Minimal Hero */}
      <section className="border-b border-border/40">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Home Office
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Where productivity meets style. Design a workspace that inspires
              creativity and focus.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <main className="space-y-8">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Office Collection</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  aria-label="Grid view"
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <select
                value={sortOption}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Grid or List View */}
          {viewMode === "grid" ? (
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
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 mb-3">
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
                    <h3 className="text-base font-medium mb-1 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-base font-bold">{formatPrice(price)}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
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
                const description = isShopifyProduct
                  ? product.description
                  : product.description;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${slug}`}
                    className="group flex gap-6 p-4 border border-border rounded-lg hover:border-primary transition-colors"
                  >
                    <div className="relative w-32 h-32 shrink-0 overflow-hidden rounded-lg bg-secondary/30">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="128px"
                      />
                      {hasSale && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {title}
                      </h3>
                      {description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {description}
                        </p>
                      )}
                      <p className="text-lg font-bold">{formatPrice(price)}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-10 w-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // ページ数が多い場合は省略表示
                  if (totalPages > 7) {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-10 w-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="h-10 w-10"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="h-10 w-10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
