"use client";

import Link from "next/link";

export default function PromoBar() {
  return (
    <div className="w-full bg-secondary/80 text-foreground py-2.5 border-b border-border/40">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 sm:gap-3 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <span>Opening Best Sellers</span>
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded font-bold text-xs sm:text-sm">
            10% OFF
          </span>
          <span className="text-primary font-semibold">→ Shop Now</span>
        </Link>
      </div>
    </div>
  );
}
