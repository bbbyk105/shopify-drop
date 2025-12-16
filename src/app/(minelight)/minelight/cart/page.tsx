"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, Pickaxe, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

export default function MineLightCartPage() {
  const { cart, init, setQty, remove, loading } = useCart();

  useEffect(() => {
    init();
  }, [init]);

  if (loading && !cart) {
    return (
      <div className="relative min-h-[60vh]">
        <BackgroundPattern />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-xl mx-auto bg-[#4A4A4A] border-8 border-black text-white p-8 text-center shadow-[10px_10px_0px_rgba(0,0,0,1)]">
            <p className="font-minecraft text-xl drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              LOADING YOUR LOOT...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="relative min-h-[70vh]">
        <BackgroundPattern />
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-2xl mx-auto bg-[#4A4A4A] border-8 border-black p-10 text-center text-white shadow-[12px_12px_0px_rgba(0,0,0,1)] space-y-6">
            <div className="inline-flex items-center gap-3 bg-[#5CB85C] border-4 border-black px-5 py-2 shadow-[4px_4px_0px_rgba(0,0,0,1)] font-bold">
              <Pickaxe className="h-5 w-5" />
              <span className="font-minecraft tracking-wide">NO ITEMS FOUND</span>
            </div>
            <h1 className="text-3xl font-bold drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] font-minecraft">
              CHEST IS EMPTY
            </h1>
            <p className="text-gray-200">Add items to continue your adventure!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/minelight" className="flex-1 sm:flex-none">
                <Button className="w-full bg-[#5CB85C] hover:bg-[#4A9B4A] text-white font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                  View Mine Light
                </Button>
              </Link>
              <Link href="/" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  className="w-full bg-white text-black font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                >
                  Back to Main Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <BackgroundPattern />
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        {/* ヒーロー */}
        <div className="bg-[#4A4A4A] border-8 border-black p-6 md:p-8 shadow-[12px_12px_0px_rgba(0,0,0,1)] text-white space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#5CB85C] text-white px-4 py-2 border-4 border-black font-bold shadow-[4px_4px_0px_rgba(0,0,0,1)] font-minecraft">
              MINE LIGHT CART
            </span>
            <Badge icon={<Shield className="h-4 w-4" />} text="Secure Checkout" />
            <Badge text={`${cart.totalQuantity} items`} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] font-minecraft">
              YOUR LOOT CHEST
            </h1>
            <p className="text-gray-200">
              Your blocky chest is packed with loot. Adjust quantities and head to checkout.
            </p>
          </div>
        </div>

        {/* カート一覧 */}
        <div className="mt-8 space-y-5">
          {cart.lines.edges.map(({ node }) => (
            <div
              key={node.id}
              className="bg-[#3A3A3A] border-8 border-black shadow-[10px_10px_0px_rgba(0,0,0,1)] p-4 md:p-5"
            >
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* 画像 */}
                {node.merchandise.product.featuredImage && (
                  <div className="relative w-full md:w-40 aspect-square bg-[#2E2E2E] border-4 border-black overflow-hidden">
                    <Image
                      src={node.merchandise.product.featuredImage.url}
                      alt={
                        node.merchandise.product.featuredImage.altText ||
                        node.merchandise.product.title
                      }
                      fill
                      sizes="(max-width: 768px) 100vw, 160px"
                      className="object-contain p-3"
                    />
                  </div>
                )}

                {/* 情報 */}
                <div className="flex-1 space-y-3 text-white">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <Link
                        href={`/products/${node.merchandise.product.handle}`}
                        className="text-lg md:text-xl font-bold hover:text-yellow-400 transition-colors drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] line-clamp-2"
                      >
                        {node.merchandise.product.title}
                      </Link>
                      <p className="text-sm text-gray-200">
                        {node.merchandise.title}
                      </p>
                      <p className="text-base font-semibold text-yellow-300">
                        {node.merchandise.price.currencyCode} $
                        {parseFloat(node.merchandise.price.amount).toFixed(2)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(node.id)}
                      className="text-red-200 hover:text-white hover:bg-red-600/30 border-2 border-transparent hover:border-black rounded-none p-2"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* 数量 + 小計 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center bg-[#4A4A4A] border-4 border-black">
                      <button
                        onClick={() => {
                          if (node.quantity > 1) {
                            setQty(node.id, node.quantity - 1);
                          }
                        }}
                        disabled={node.quantity <= 1}
                        className="px-3 py-2 text-white hover:bg-[#2E2E2E] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border-r-4 border-black transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-bold font-minecraft text-yellow-300">
                        {node.quantity}
                      </span>
                      <button
                        onClick={() => setQty(node.id, node.quantity + 1)}
                        className="px-3 py-2 text-white hover:bg-[#2E2E2E] border-l-4 border-black transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-300">Subtotal</p>
                      <p className="text-2xl font-bold text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        {node.cost.totalAmount.currencyCode} $
                        {parseFloat(node.cost.totalAmount.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 合計 */}
        <div className="mt-10 bg-[#4A4A4A] border-8 border-black shadow-[12px_12px_0px_rgba(0,0,0,1)] p-6 md:p-8 text-white space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Stat label="Subtotal" value={`${cart.cost.subtotalAmount.currencyCode} $${parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}`} />
            <Stat label="Total" value={`${cart.cost.totalAmount.currencyCode} $${parseFloat(cart.cost.totalAmount.amount).toFixed(2)}`} accent />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/minelight" className="flex-1 order-2 sm:order-1">
              <Button className="w-full bg-[#5CB85C] hover:bg-[#4A9B4A] text-white font-bold text-lg border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all h-12">
                Continue Shopping
              </Button>
            </Link>
            <a href={cart.checkoutUrl} className="flex-1 order-1 sm:order-2">
              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all h-12">
                Proceed to Checkout
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function BackgroundPattern() {
  return (
    <div className="absolute inset-0 opacity-20 pointer-events-none">
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 12px,
              rgba(0, 0, 0, 0.15) 12px,
              rgba(0, 0, 0, 0.15) 24px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 12px,
              rgba(0, 0, 0, 0.15) 12px,
              rgba(0, 0, 0, 0.15) 24px
            )
          `,
          backgroundSize: "24px 24px",
        }}
      />
    </div>
  );
}

function Badge({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 bg-[#3A3A3A] border-4 border-black px-3 py-1 text-sm font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)] uppercase">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#3A3A3A] border-4 border-black p-4 shadow-[5px_5px_0px_rgba(0,0,0,1)]">
      <p className="text-sm text-gray-200">{label}</p>
      <p
        className={`text-2xl font-bold ${
          accent
            ? "text-yellow-300 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]"
            : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

