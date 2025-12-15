"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingCart, Home, LocateFixed, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

type MineLightMenuProduct = {
  id: string;
  title: string;
  handle: string;
  price: string | null;
  currency: string;
  imageUrl: string | null;
};

export default function MineLightHeader() {
  const [open, setOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<MineLightMenuProduct[]>(
    []
  );
  const { cart } = useCart();

  // メニュー開閉に応じて背後のスクロールを制御
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  // メニュー用おすすめ商品を取得（メニューが開いた時だけフェッチ）
  useEffect(() => {
    if (!open || recommendations.length > 0) return;

    let cancelled = false;

    const fetchRecommendations = async () => {
      try {
        const res = await fetch("/api/minelight/recommendations");
        if (!res.ok) return;
        const data = (await res.json()) as { products?: MineLightMenuProduct[] };
        if (!cancelled && data.products) {
          setRecommendations(data.products);
        }
      } catch (error) {
        console.error("Failed to load MineLight menu recommendations", error);
      }
    };

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [open, recommendations.length]);

  const itemCount =
    cart?.lines.edges.reduce((total, edge) => total + edge.node.quantity, 0) ||
    0;

  return (
    <header className="sticky top-0 z-50 bg-[#4A4A4A] border-b-8 border-black">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/minelight"
            className="text-2xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-minecraft hover:text-yellow-400 transition-colors"
          >
            MINE LIGHT SHOP
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-3">
            <nav className="hidden sm:flex items-center gap-4">
              <Link
                href="/minelight"
                className="flex items-center gap-2 bg-[#5CB85C] hover:bg-[#4A9B4A] text-white px-4 py-2 font-bold border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">HOME</span>
              </Link>

              <Link
                href="/minelight/tracking"
                className="flex items-center gap-2 bg-white text-black px-4 py-2 font-bold border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <LocateFixed className="h-5 w-5" />
                <span className="hidden sm:inline text-xs font-minecraft">
                  TRACKING
                </span>
              </Link>

              <Link
                href="/minelight/cart"
                className="relative flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 font-bold border-4 border-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline">CART</span>
                {itemCount > 0 && (
                  <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center border-2 border-black">
                    {itemCount}
                  </span>
                )}
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="sm:hidden inline-flex items-center justify-center rounded-md border-4 border-black bg-white p-2 text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu (overlay) */}
        {open && (
          <div className="sm:hidden fixed inset-0 z-9999 bg-black">
            {/* クリックで閉じるためのバックドロップ */}
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 w-full h-full cursor-pointer"
            />

            {/* メニュー本体 */}
            <div className="relative z-50 mt-16 px-4">
              {/* 閉じるボタン */}
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center rounded-md border-4 border-black bg-white p-2 text-black shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <Link
                  href="/minelight"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 bg-[#5CB85C] hover:bg-[#4A9B4A] text-white px-4 py-3 font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Home className="h-5 w-5" />
                  <span>HOME</span>
                </Link>

                <Link
                  href="/minelight/tracking"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 bg-white text-black px-4 py-3 font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <LocateFixed className="h-5 w-5" />
                  <span className="text-xs font-minecraft">TRACKING</span>
                </Link>

                <Link
                  href="/minelight/cart"
                  onClick={() => setOpen(false)}
                  className="relative flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>CART</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center border-2 border-black">
                      {itemCount}
                    </span>
                  )}
                </Link>

                {/* Recommended products (actual Mine Light items) */}
                {recommendations.length > 0 && (
                  <div className="mt-6 bg-[#3A3A3A] border-4 border-black p-4 space-y-4">
                    <div>
                      <p className="text-xs font-minecraft text-gray-300 uppercase">
                        Recommended Items
                      </p>
                      <p className="text-lg font-bold text-white">
                        Popular Mine Light items
                      </p>
                    </div>

                    <div className="space-y-3">
                      {recommendations.map((product, index) => {
                        const formattedPrice =
                          product.price != null
                            ? `$${Number(product.price).toFixed(2)}`
                            : null;

                        return (
                          <Link
                            key={product.id}
                            href={`/minelight/products/${product.handle}`}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 border-4 border-black px-4 py-3 text-left shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all ${
                              index === 0
                                ? "bg-[#5CB85C] hover:bg-[#4A9B4A]"
                                : "bg-yellow-400 hover:bg-yellow-500"
                            }`}
                          >
                            {product.imageUrl && (
                              <div className="relative w-14 h-14 border-2 border-black bg-[#4A4A4A] overflow-hidden">
                                <Image
                                  src={product.imageUrl}
                                  alt={product.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-xs font-minecraft text-black">
                                Pick {index + 1}
                              </p>
                              <p className="text-sm font-bold text-black line-clamp-2">
                                {product.title}
                              </p>
                              {formattedPrice && (
                                <p className="text-sm font-bold text-red-700 mt-1 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
                                  {formattedPrice}
                                </p>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}


