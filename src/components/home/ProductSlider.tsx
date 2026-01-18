"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import type { Product as LocalProduct } from "@/types";

interface ProductSliderProps {
  title?: string;
  products: Array<ShopifyProduct | LocalProduct>;
  variant?: "default" | "titleOnly";
}

export default function ProductSlider({
  products,
  variant = "default",
}: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  if (!products || products.length === 0) return null;

  return (
    <div className="relative">
      {/* Scroll Buttons (Desktop only) */}
      {canScrollLeft && (
        <button
          type="button"
          aria-label="Scroll left"
          onClick={() => scrollByAmount("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full border border-border bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {canScrollRight && (
        <button
          type="button"
          aria-label="Scroll right"
          onClick={() => scrollByAmount("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full border border-border bg-background/95 backdrop-blur-sm shadow-lg hover:bg-background transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 lg:gap-6 overflow-x-auto pb-2 md:pb-4 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="snap-start shrink-0 w-[168px] sm:w-[220px] md:w-[237px] lg:w-[203px]"
          >
            <ProductCard product={product} variant={variant} />
          </div>
        ))}
      </div>
    </div>
  );
}
