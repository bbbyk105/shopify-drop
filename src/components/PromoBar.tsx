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
    <div className="w-full bg-primary text-primary-foreground py-2.5 relative overflow-x-hidden">
      <div className="container mx-auto px-4 pr-12 sm:pr-4">
        <Link
          href="/fast-shipping"
          className="flex min-w-0 max-w-full flex-col items-center justify-center gap-1 text-center text-xs font-medium text-white outline-none ring-0 transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 sm:flex-row sm:gap-3 sm:text-sm"
        >
          <span className="uppercase tracking-[0.18em] text-[0.68rem] font-semibold bg-white/10 px-2 py-0.5 rounded-full border border-white/25">
            Fast Shipping
          </span>
          <span className="hidden sm:inline text-white/95">
            Selected items ship within <span className="font-semibold">24 hours</span> with <span className="font-semibold">no extra fee</span>.
          </span>
          <span className="sm:hidden text-white/95">
            Selected items ship in <span className="font-semibold">24 hours</span>, <span className="font-semibold">no extra fee</span>.
          </span>
          <span className="text-white font-semibold">
            View eligible items →
          </span>
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
