"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Check, ShoppingCart, Plus } from "lucide-react";
import { useCartAddedDrawer } from "@/hooks/useCartAddedDrawer";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shared/AddToCartButton";
import { cn } from "@/lib/utils";

const CLOSE_DURATION_MS = 300;
const MOBILE_BREAKPOINT = 768;

export default function CartAddedDrawer() {
  const { isOpen, product, relatedProducts, close } = useCartAddedDrawer();
  const [isClosing, setIsClosing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimeoutRef.current = setTimeout(() => {
      close();
      setIsClosing(false);
      closeTimeoutRef.current = null;
    }, CLOSE_DURATION_MS);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  if (!isOpen || !product) return null;

  const panelAnimation = isMobile
    ? isClosing
      ? "animate-[slide-out-to-bottom_0.3s_ease-in]"
      : "animate-[slide-in-from-bottom_0.3s_ease-out]"
    : isClosing
      ? "animate-[slide-out-to-right_0.3s_ease-in]"
      : "animate-[slide-in-from-right_0.3s_ease-out]";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex",
        isMobile ? "items-end justify-center" : "justify-end",
      )}
      aria-modal="true"
      role="dialog"
      aria-label="Added to cart"
    >
      {/* Backdrop - darker on mobile */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity",
          isMobile ? "bg-black/50" : "bg-black/40",
        )}
        onClick={handleBackdropClick}
      />

      {/* Panel - 80% height on mobile, right side on desktop */}
      <div
        className={cn(
          "relative z-10 flex w-full flex-col bg-white shadow-xl",
          isMobile
            ? "h-[80vh] rounded-t-xl"
            : "h-full sm:max-w-md sm:min-w-[380px]",
          panelAnimation,
        )}
      >
        {/* Close button */}
        <div className="flex shrink-0 items-center justify-end p-4 pb-0">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-4 pb-6">
          {/* Added product confirmation */}
          <div className="flex gap-4 pb-4">
            <div className="relative shrink-0 overflow-visible">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100 sm:h-16 sm:w-16">
                <Image
                  src={product.productImage}
                  alt={product.productName}
                  width={80}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
              <span
                className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-sm"
                aria-hidden
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-slate-900 truncate">
                {product.productName}
              </p>
              {product.variantTitle && (
                <p className="text-sm text-slate-600 truncate">
                  {product.variantTitle}
                </p>
              )}
              <p className="mt-1 text-sm text-slate-500">
                {product.productName} has been added to your cart.
              </p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          {/* Recommended products */}
          {relatedProducts.length > 0 && (
            <>
              <hr className="border-slate-200" />
              <h3 className="py-4 text-sm font-bold text-slate-900">
                Recommended for you
              </h3>
              <ul className="space-y-4">
                {relatedProducts.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Link
                      href={`/products/${item.handle}`}
                      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-slate-100"
                      onClick={handleClose}
                    >
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.handle}`}
                        onClick={handleClose}
                        className="font-medium text-slate-900 line-clamp-2 hover:underline"
                      >
                        {item.title}
                      </Link>
                      {item.variantTitle && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {item.variantTitle}
                        </p>
                      )}
                      <p className="mt-0.5 font-semibold text-slate-900">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <AddToCartButton
                        variantId={item.variantId}
                        quantity={1}
                        productName={item.title}
                        productImage={item.imageUrl}
                        variantTitle={item.variantTitle}
                        price={item.price}
                        relatedProducts={[]}
                        iconOnly
                        openDrawerOnAdd={false}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 p-0"
                      >
                        <Plus className="h-5 w-5" aria-hidden />
                      </AddToCartButton>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div className="shrink-0 border-t border-slate-200 p-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Continue Shopping
            </Button>
            <Button
              asChild
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Link href="/cart" onClick={handleClose}>
                View Cart
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
