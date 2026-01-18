"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { cart, init, setQty, remove, loading } = useCart();

  useEffect(() => {
    init();
  }, [init]);

  if (loading && !cart) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-16">
          <div className="text-center">Loading cart...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!cart || cart.totalQuantity === 0) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some products to get started!
            </p>
            <Link href="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto px-4 py-6 md:py-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {/* ヘッダー */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
          </p>
        </div>

        {/* カート内商品一覧 */}
        <div className="space-y-4">
          {cart.lines.edges.map(({ node }) => (
            <div
              key={node.id}
              className="flex gap-3 md:gap-4 p-3 md:p-4 border rounded-lg bg-card"
            >
              {/* 商品画像 - 常に小さく表示 */}
              {node.merchandise.product.featuredImage && (
                <div className="relative w-20 h-20 md:w-24 md:h-24 shrink-0">
                  <Image
                    src={node.merchandise.product.featuredImage.url}
                    alt={
                      node.merchandise.product.featuredImage.altText ||
                      node.merchandise.product.title
                    }
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 80px, 96px"
                  />
                </div>
              )}

              {/* 商品情報エリア */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                {/* 上部: 商品名と価格 */}
                <div>
                  <Link
                    href={`/products/${node.merchandise.product.handle}`}
                    className="font-semibold hover:underline line-clamp-2 text-sm md:text-base"
                  >
                    {node.merchandise.product.title}
                  </Link>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    {node.merchandise.title}
                  </p>

                  {/* 単価 */}
                  <p className="text-sm font-medium mt-2">
                    {node.merchandise.price.currencyCode} $
                    {parseFloat(node.merchandise.price.amount).toFixed(2)}
                  </p>
                </div>

                {/* 下部: 数量コントロールと小計 */}
                <div className="flex items-center justify-between mt-3">
                  {/* 数量コントロール */}
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => {
                        if (node.quantity > 1) {
                          setQty(node.id, node.quantity - 1);
                        }
                      }}
                      disabled={node.quantity <= 1}
                      className="p-1.5 md:p-2 hover:bg-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>

                    <span className="w-8 md:w-10 text-center text-sm md:text-base font-medium">
                      {node.quantity}
                    </span>

                    <button
                      onClick={() => setQty(node.id, node.quantity + 1)}
                      className="p-1.5 md:p-2 hover:bg-secondary transition-colors cursor-pointer"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                  </div>

                  {/* 小計 */}
                  <div className="text-right">
                    <p className="font-bold text-sm md:text-base">
                      {node.cost.totalAmount.currencyCode} $
                      {parseFloat(node.cost.totalAmount.amount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* 削除ボタン */}
              <div className="flex items-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Are you sure you want to remove "${node.merchandise.product.title}" from your cart?`
                      )
                    ) {
                      remove(node.id);
                    }
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* 合計・チェックアウト */}
        <div className="border-t pt-6 space-y-4">
          <div className="space-y-2">
            {/* SubtotalとTotalが異なる場合のみSubtotalを表示 */}
            {cart.cost.subtotalAmount.amount !== cart.cost.totalAmount.amount && (
              <div className="flex justify-between text-base md:text-lg">
                <span className="font-semibold">Subtotal:</span>
                <span className="font-bold">
                  {cart.cost.subtotalAmount.currencyCode} $
                  {parseFloat(cart.cost.subtotalAmount.amount).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-lg md:text-xl">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">
                {cart.cost.totalAmount.currencyCode} $
                {parseFloat(cart.cost.totalAmount.amount).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Link href="/" className="flex-1 order-2 sm:order-1">
              <Button variant="outline" className="w-full h-11 md:h-12">
                Continue Shopping
              </Button>
            </Link>
            <a href={cart.checkoutUrl} className="flex-1 order-1 sm:order-2">
              <Button className="w-full h-11 md:h-12 bg-green-600 hover:bg-green-700 text-base font-semibold">
                Proceed to Checkout
              </Button>
            </a>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </main>
  );
}
