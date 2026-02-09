"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PROMO_DISMISSED_KEY = "promo-bar-dismissed";

export default function PromoBar() {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROMO_DISMISSED_KEY);
    if (stored === "true") setIsDismissed(true);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem(PROMO_DISMISSED_KEY, "true");
  };

  if (isDismissed) return null;

  return (
    <div className="w-full bg-primary text-primary-foreground py-2.5 relative">
      <div className="container mx-auto px-4">
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 sm:gap-3 text-sm font-medium hover:opacity-90 transition-opacity text-white outline-none ring-0 focus:outline-none focus:ring-0"
        >
          <span>Opening Best Sellers</span>
          <span className="bg-white/20 text-white px-2 py-0.5 rounded font-bold text-xs sm:text-sm border-0 ring-0 outline-none">
            50% OFF
          </span>
          <span className="text-white font-semibold">→ Shop Now</span>
        </Link>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-white/90 hover:text-white hover:bg-white/20 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
        onClick={handleDismiss}
        aria-label="閉じる"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
