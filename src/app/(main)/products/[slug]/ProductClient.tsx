"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shared/AddToCartButton";
import AddToFavoritesButton from "@/components/shared/AddToFavoritesButton";
import { formatPrice } from "@/lib/utils";
import type { Product, Variant } from "@/lib/shopify/types";
import {
  ChevronRight,
  Truck,
  Shield,
  Star,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  // 価格計算
  const price = selectedVariant
    ? parseFloat(selectedVariant.price.amount)
    : parseFloat(product.priceRange.minVariantPrice.amount);

  // 割引価格の計算
  const compareAtPriceValue = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : product.compareAtPriceRange?.minVariantPrice
    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
    : null;

  // 割引があるかチェック
  const hasDiscount =
    compareAtPriceValue !== null &&
    compareAtPriceValue > 0 &&
    compareAtPriceValue > price;

  // 在庫数を取得
  const maxQuantity = selectedVariant ? inventory[selectedVariant.id] ?? 10 : 5;

  // バリエーションをグループ化（Seating、Material、Colorなど）
  const variantGroups: Record<string, Variant[]> = {};
  product.variants.edges.forEach(({ node }) => {
    const title = node.title;
    // バリエーションタイトルからグループを抽出（例: "Sofa / Leather / Charme Tan"）
    const parts = title.split(" / ");
    if (parts.length > 0) {
      const group = parts[0]; // 最初の部分をグループとして使用
      if (!variantGroups[group]) {
        variantGroups[group] = [];
      }
      variantGroups[group].push(node);
    }
  });

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(maxQuantity, newQuantity));
    setQuantity(validQuantity);
  };

  return (
    <div className="bg-background">
      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 mb-12 lg:mb-16">
        {/* Images - Left Side */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 group">
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
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* セールバッジ */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                SALE
              </div>
            )}

            {/* 在庫切れバッジ */}
            {!product.availableForSale && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center">
                  <span className="text-white font-bold text-3xl block mb-2">
                    Sold Out
                  </span>
                </div>
              </div>
            )}

            {/* 画像ナビゲーション */}
            {images.length > 1 && (
              <button
                onClick={() =>
                  setSelectedImage((prev) => (prev + 1) % images.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-foreground"
                      : "border-transparent hover:border-border"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
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
            <h1 className="text-3xl lg:text-4xl font-bold mb-2 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* 価格 */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {hasDiscount && compareAtPriceValue && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(compareAtPriceValue)}
                </span>
              )}
            </div>
            {hasDiscount && (
              <a href="#" className="text-sm text-muted-foreground hover:underline">
                or from ${Math.round(price / 12)}/mo with Affirm
              </a>
            )}
          </div>

          {/* 評価（星） */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < 4
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-none text-gray-300"
                  }`}
                />
              ))}
            </div>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              (2118)
            </a>
          </div>

          {/* バリエーション選択 */}
          {Object.keys(variantGroups).length > 0 && (
            <div className="space-y-4">
              {Object.entries(variantGroups).map(([groupName, variants]) => {
                const selectedInGroup = variants.find(
                  (v) => v.id === selectedVariant?.id
                );
                return (
                  <div key={groupName} className="space-y-2">
                    <label className="text-sm font-medium">
                      {groupName === "Sofa" || groupName === "LOVESAT"
                        ? "Seating:"
                        : groupName === "Leather" || groupName === "FABRIC"
                        ? "Featured Material:"
                        : "Color:"}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => {
                              setSelectedVariant(variant);
                              setQuantity(1);
                            }}
                            disabled={!variant.availableForSale}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              isSelected
                                ? "bg-red-50 text-foreground border-2 border-red-500"
                                : "bg-background border border-border text-muted-foreground hover:border-foreground"
                            } ${
                              !variant.availableForSale
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                          >
                            {variant.title.split(" / ").pop() || variant.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* カートに追加ボタン */}
          <div className="flex items-center gap-3">
            {product.availableForSale && selectedVariant && maxQuantity > 0 ? (
              <>
                <AddToCartButton
                  variantId={selectedVariant.id}
                  quantity={quantity}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 font-semibold uppercase"
                  productName={product.title}
                  productImage={images[selectedImage]?.url || images[0]?.url}
                />
                <AddToFavoritesButton
                  productId={product.id}
                  productName={product.title}
                  productImage={images[selectedImage]?.url || images[0]?.url}
                  variant="icon"
                  size="lg"
                  className="h-12 w-12"
                />
              </>
            ) : (
              <>
                <Button
                  disabled
                  size="lg"
                  className="flex-1 h-12 font-semibold uppercase"
                >
                  Sold Out
                </Button>
                <AddToFavoritesButton
                  productId={product.id}
                  productName={product.title}
                  productImage={images[selectedImage]?.url || images[0]?.url}
                  variant="icon"
                  size="lg"
                  className="h-12 w-12"
                />
              </>
            )}
          </div>

          {/* 配送情報 */}
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Truck className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Delivered to{" "}
                <a href="#" className="text-foreground hover:underline">
                  Los Angeles, CA
                </a>
                : Jan 20th - Feb 2nd
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <a href="#" className="text-muted-foreground hover:underline">
                30 day satisfaction guarantee.
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Accordion Section */}
      <div className="border-t pt-8">
        <Accordion type="single" collapsible className="w-full space-y-0">
          <AccordionItem value="description" className="border-b">
            <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
              <span>Description</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              {product.descriptionHtml ? (
                <div
                  className="prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>p]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                />
              ) : (
                <p>{product.description || "No description available."}</p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features" className="border-b">
            <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
              <span>Features</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              <ul className="list-disc pl-5 space-y-2">
                <li>Premium quality materials</li>
                <li>Expert craftsmanship</li>
                <li>Designer approved</li>
                <li>Easy to assemble</li>
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="specifications" className="border-b">
            <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
              <span>Specifications</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="font-medium">Material:</dt>
                  <dd className="text-muted-foreground">
                    {product.tags.find((t) =>
                      t.toLowerCase().includes("material")
                    ) || "Premium materials"}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Dimensions:</dt>
                  <dd className="text-muted-foreground">Check product details</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Weight:</dt>
                  <dd className="text-muted-foreground">Varies by variant</dd>
                </div>
              </dl>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="care" className="border-b">
            <AccordionTrigger className="text-base font-medium py-4 hover:no-underline">
              <span>Care & Assembly</span>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pb-4">
              <p className="mb-3">
                Follow these care instructions to maintain your product's quality:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Clean with a soft, damp cloth</li>
                <li>Avoid harsh chemicals</li>
                <li>Keep away from direct sunlight</li>
                <li>Assembly instructions included</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
