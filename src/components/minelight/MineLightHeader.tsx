"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Home, LocateFixed, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function MineLightHeader() {
  const [open, setOpen] = useState(false);
  const { cart } = useCart();

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

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden pb-4">
            <div className="mt-3 space-y-3">
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
