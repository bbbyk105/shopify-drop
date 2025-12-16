"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/lib/shopify/types";

interface MineLightProductClientProps {
  product: Product;
  images: Array<{ url: string; altText?: string | null }>;
  firstVariant: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: { amount: string; currencyCode: string };
    compareAtPrice?: { amount: string; currencyCode: string } | null;
  };
  inventory: Record<string, number>;
}

export default function MineLightProductClient({
  product,
  images,
  firstVariant,
  inventory,
}: MineLightProductClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(firstVariant);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const { add } = useCart();

  const maxQuantity = inventory[selectedVariant.id] ?? 10;
  const isAvailable = selectedVariant.availableForSale && maxQuantity > 0;

  const handleAddToCart = async () => {
    if (!isAvailable) return;

    setIsAdding(true);
    try {
      await add(selectedVariant.id, quantity);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* 画像ギャラリー - Mine Light Style */}
      <div className="space-y-4">
        <div className="relative aspect-square bg-[#4A4A4A] border-8 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)]">
          <Image
            src={images[currentImageIndex]?.url || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-contain p-4"
            priority
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#5CB85C] hover:bg-[#4A9B4A] text-white font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#5CB85C] hover:bg-[#4A9B4A] text-white font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 border-2 border-black transition-all cursor-pointer ${
                    index === currentImageIndex
                      ? "bg-yellow-400 scale-125"
                      : "bg-white"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 商品情報 - Mine Light Style */}
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)] font-minecraft">
            {product.title.toUpperCase()}
          </h1>

          {/* 価格 */}
          <div className="flex items-baseline gap-3 mb-6">
            {selectedVariant.compareAtPrice && (
              <span className="text-2xl text-red-500 line-through drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                ${parseFloat(selectedVariant.compareAtPrice.amount).toFixed(2)}
              </span>
            )}
            <span className="text-4xl font-bold text-yellow-400 drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
              ${parseFloat(selectedVariant.price.amount).toFixed(2)}
            </span>
            {selectedVariant.compareAtPrice && (
              <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold border-2 border-black">
                SALE!
              </span>
            )}
          </div>

          {/* 在庫状況 */}
          <div className="mb-6">
            {maxQuantity > 5 ? (
              <div className="inline-flex items-center gap-2 bg-[#5CB85C] border-4 border-black px-4 py-2 text-white font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <Check className="h-5 w-5" />
                <span>IN STOCK</span>
              </div>
            ) : maxQuantity > 0 ? (
              <div className="inline-flex items-center gap-2 bg-orange-500 border-4 border-black px-4 py-2 text-white font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span>ONLY {maxQuantity} LEFT!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 bg-red-600 border-4 border-black px-4 py-2 text-white font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)]">
                <span>SOLD OUT</span>
              </div>
            )}
          </div>
        </div>

        {/* 説明文 */}
        <div className="bg-[#4A4A4A] border-4 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <div
            className="text-white prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>

        {/* バリアント選択 */}
        {product.variants.edges.length > 1 && (
          <div className="space-y-3">
            <label className="block text-white font-bold text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              SELECT OPTION:
            </label>
            <div className="flex flex-wrap gap-3">
              {product.variants.edges.map(({ node: variant }) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  disabled={!variant.availableForSale}
                  className={`px-6 py-3 font-bold border-4 border-black transition-all shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 ${
                    selectedVariant.id === variant.id
                      ? "bg-yellow-400 text-black cursor-pointer"
                      : variant.availableForSale
                      ? "bg-white text-black hover:bg-gray-200 cursor-pointer"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  {variant.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 数量選択 */}
        <div className="space-y-3">
          <label className="block text-white font-bold text-lg drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            QUANTITY:
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || !isAvailable}
              className="w-12 h-12 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-bold text-2xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              -
            </button>
            <span className="text-3xl font-bold text-white min-w-[3ch] text-center drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
              disabled={quantity >= maxQuantity || !isAvailable}
              className="w-12 h-12 bg-[#5CB85C] hover:bg-[#4A9B4A] disabled:bg-gray-600 text-white font-bold text-2xl border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              +
            </button>
          </div>
        </div>

        {/* カート追加ボタン */}
        <Button
          onClick={handleAddToCart}
          disabled={!isAvailable || isAdding || isAdded}
          size="lg"
          className="w-full h-16 text-xl font-bold bg-[#5CB85C] hover:bg-[#4A9B4A] disabled:bg-gray-600 text-white border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isAdded ? (
            <>
              <Check className="mr-2 h-6 w-6" />
              ADDED TO CART!
            </>
          ) : isAdding ? (
            "ADDING..."
          ) : !isAvailable ? (
            "SOLD OUT"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-6 w-6" />
              ADD TO CART
            </>
          )}
        </Button>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <TrustBadge text="FREE SHIPPING" />
          <TrustBadge text="30-DAY RETURNS" />
          <TrustBadge text="SECURE CHECKOUT" />
          <TrustBadge text="USB RECHARGEABLE" />
        </div>
      </div>
    </div>
  );
}

function TrustBadge({ text }: { text: string }) {
  return (
    <div className="bg-[#4A4A4A] border-2 border-black px-3 py-2 text-center">
      <span className="text-white text-xs font-bold">{text}</span>
    </div>
  );
}
