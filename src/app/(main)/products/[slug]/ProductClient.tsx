"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shared/AddToCartButton";
import type { Product, Variant } from "@/lib/shopify/types";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

interface ProductClientProps {
  product: Product;
  images: Array<{
    id: string;
    url: string;
    altText?: string | null;
    width?: number;
    height?: number;
  }>;
  firstVariant: Variant | undefined;
  inventory: Record<string, number>;
}

export default function ProductClient({
  product,
  images,
  firstVariant,
  inventory,
}: ProductClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    firstVariant
  );
  const [quantity, setQuantity] = useState(1);

  const price = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  const compareAtPrice = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;

  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // 在庫数を取得
  const maxQuantity = selectedVariant ? inventory[selectedVariant.id] ?? 10 : 5;

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(maxQuantity, newQuantity));
    setQuantity(validQuantity);
  };

  return (
    <>
      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-12 lg:mb-16">
        {/* Images - Left Side */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/30 group">
            <Image
              src={
                images[selectedImage]?.url ||
                product.featuredImage?.url ||
                "/placeholder.png"
              }
              alt={images[selectedImage]?.altText || product.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* セールバッジ */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-linear-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-xl backdrop-blur-sm">
                SAVE {discountPercentage}%
              </div>
            )}

            {/* 在庫切れバッジ */}
            {!product.availableForSale && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center">
                  <span className="text-white font-bold text-3xl block mb-2">
                    Sold Out
                  </span>
                  <span className="text-white/80 text-sm">Check back soon</span>
                </div>
              </div>
            )}

            {/* 画像ナビゲーション */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2.5 shadow-xl transition-all hover:scale-110 active:scale-95 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-black" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full p-2.5 shadow-xl transition-all hover:scale-110 active:scale-95 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-black" />
                </button>

                {/* 画像インジケーター */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        selectedImage === index
                          ? "bg-white w-6"
                          : "bg-white/50 hover:bg-white/75"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 shrink-0 overflow-hidden rounded-xl bg-secondary border-2 transition-all ${
                    selectedImage === index
                      ? "border-primary ring-2 ring-primary/30 scale-105"
                      : "border-transparent hover:border-primary/50 hover:scale-105"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - Right Side */}
        <div className="space-y-6">
          {/* タイトル */}
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              {product.title}
            </h1>

            {/* タグ表示 */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-medium bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 価格 */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl md:text-4xl font-bold">
                ${price.toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="text-xl text-muted-foreground line-through">
                  ${compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                <span>💰</span>
                You save ${(compareAtPrice - price).toFixed(2)}
              </div>
            )}
          </div>

          {/* 在庫状況 */}
          {product.availableForSale && (
            <div className="flex items-center gap-2 text-sm">
              {maxQuantity > 5 ? (
                <span className="flex items-center gap-1.5 text-green-600 font-medium">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  In Stock
                </span>
              ) : maxQuantity > 0 ? (
                <span className="flex items-center gap-1.5 text-orange-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  Only {maxQuantity} left in stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-600 font-medium">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  Sold Out
                </span>
              )}
            </div>
          )}

          {/* 説明 */}
          <div className="prose prose-sm max-w-none bg-secondary/30 p-4 rounded-xl">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed m-0">
              {product.description}
            </p>
          </div>

          {/* バリエーション選択 */}
          {product.variants.edges.length > 1 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Select Variant
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.variants.edges.map(({ node }) => (
                  <button
                    key={node.id}
                    onClick={() => {
                      setSelectedVariant(node);
                      setQuantity(1); // バリアント変更時に数量をリセット
                    }}
                    disabled={!node.availableForSale}
                    className={`relative px-4 py-3 border-2 rounded-xl transition-all font-medium text-sm ${
                      selectedVariant?.id === node.id
                        ? "border-primary bg-primary/10 shadow-md scale-105"
                        : "border-border hover:border-primary hover:bg-secondary/50"
                    } ${
                      !node.availableForSale
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105 active:scale-95"
                    }`}
                  >
                    <div className="font-semibold">{node.title}</div>
                    {!node.availableForSale && (
                      <div className="text-xs text-red-500 mt-1">Sold Out</div>
                    )}
                    {selectedVariant?.id === node.id && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 数量選択 */}
          {product.availableForSale && maxQuantity > 0 && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 rounded-xl overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="px-4 py-3 hover:bg-secondary transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={maxQuantity}
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(parseInt(e.target.value) || 1)
                    }
                    className="w-16 text-center font-semibold focus:outline-none"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="px-4 py-3 hover:bg-secondary transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={quantity >= maxQuantity}
                  >
                    +
                  </button>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="font-bold text-foreground">
                      ${(price * quantity).toFixed(2)}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Max: {maxQuantity} {maxQuantity === 1 ? "item" : "items"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* カートに追加ボタン */}
          {product.availableForSale && selectedVariant && maxQuantity > 0 ? (
            <AddToCartButton
              variantId={selectedVariant.id}
              quantity={quantity}
              className="w-full text-base h-14 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
            />
          ) : (
            <Button
              disabled
              size="lg"
              className="w-full text-base h-14 font-bold"
            >
              Sold Out
            </Button>
          )}

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/30">
              <Truck className="w-6 h-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/30">
              <Shield className="w-6 h-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-secondary/30">
              <RotateCcw className="w-6 h-6 mb-2 text-primary" />
              <span className="text-xs font-medium">Easy Returns</span>
            </div>
          </div>

          {/* Product Details (HTML) */}
          {product.descriptionHtml && (
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-xl font-bold">Product Details</h2>
              <div
                className="prose prose-sm max-w-none text-muted-foreground [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>p]:leading-relaxed [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mt-4"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      <section className="border-t pt-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          You May Also Like
        </h2>
        <div className="text-center text-muted-foreground py-12 bg-linear-to-br from-secondary/30 to-secondary/10 rounded-2xl border-2 border-dashed border-secondary">
          <p className="text-lg font-medium">Related products coming soon...</p>
          <p className="text-sm mt-2">Check back later for recommendations</p>
        </div>
      </section>
    </>
  );
}
