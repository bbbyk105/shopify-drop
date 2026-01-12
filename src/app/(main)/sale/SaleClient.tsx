"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

interface SaleClientProps {
  products: Product[];
}

export default function SaleClient({ products }: SaleClientProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // 割引率を計算
  const getDiscount = (product: Product): number => {
    if ("priceRange" in product) {
      // Shopify商品の場合
      const price = parseFloat(product.priceRange.minVariantPrice.amount);
      const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
        ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
        : null;

      if (compareAtPrice && compareAtPrice > price) {
        return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
      }

      // バリアントレベルでチェック
      for (const { node } of product.variants.edges) {
        if (node.compareAtPrice) {
          const variantPrice = parseFloat(node.price.amount);
          const variantCompareAtPrice = parseFloat(node.compareAtPrice.amount);
          if (variantCompareAtPrice > variantPrice) {
            return Math.round(
              ((variantCompareAtPrice - variantPrice) / variantCompareAtPrice) * 100
            );
          }
        }
      }
      return 0;
    } else {
      // ローカル商品の場合（デフォルト30%）
      return 30;
    }
  };

  const checkScrollPosition = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    checkScrollPosition();
    container.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const delta = direction === "left" ? -scrollAmount : scrollAmount;

    container.scrollBy({
      left: delta,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-red-900/20 to-orange-900/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              LIMITED TIME OFFER
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              End of Season Sale
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Up to 30% off on selected items. Elevate your space with premium
              lighting at unbeatable prices.
            </p>
            <div className="flex gap-4 text-center">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 min-w-20">
                <div className="text-3xl font-bold">02</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 min-w-20">
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 min-w-20">
                <div className="text-3xl font-bold">35</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Slider */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sale Items</h2>
            <p className="text-muted-foreground">
              {products.length} products on sale
            </p>
          </div>
          <select className="bg-secondary border border-border rounded-md px-4 py-2">
            <option>Sort by: Featured</option>
            <option>Discount: High to Low</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="relative">
          {/* Scroll Buttons (Desktop only) */}
          {products.length > 0 && canScrollLeft && (
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollByAmount("left")}
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border bg-background/90 shadow-sm hover:bg-background transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {products.length > 0 && canScrollRight && (
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollByAmount("right")}
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border bg-background/90 shadow-sm hover:bg-background transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          )}

          {/* Slider */}
          <div
            ref={scrollRef}
            className="flex gap-6 lg:gap-8 overflow-x-auto pb-2 md:pb-4 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent"
          >
            {products.map((product) => {
              const discount = getDiscount(product);
              return (
                <div
                  key={product.id}
                  className="snap-start shrink-0 w-[220px] sm:w-[260px] md:w-[280px] relative"
                >
                  {discount > 0 && (
                    <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      -{discount}%
                    </div>
                  )}
                  <ProductCard product={product} />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

