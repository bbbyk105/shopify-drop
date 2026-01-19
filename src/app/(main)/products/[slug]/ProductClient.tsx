"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shared/AddToCartButton";
import AddToFavoritesButton from "@/components/shared/AddToFavoritesButton";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product, Variant } from "@/lib/shopify/types";
import {
  ChevronLeft,
  ChevronRight,
  Truck,
  Shield,
  Star,
  Plus,
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
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [variantImageOverride, setVariantImageOverride] = useState<{
    url: string;
    altText?: string | null;
  } | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    firstVariant
  );
  const [quantity, setQuantity] = useState(1);

  // Removed unnecessary useEffect that sets `mounted` state

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
  const colorVariants: Variant[] = [];
  const processedVariantIds = new Set<string>();
  
  product.variants.edges.forEach(({ node }) => {
    const title = node.title;
    // selectedOptionsからColorを探す
    const colorOption = node.selectedOptions?.find(opt => 
      opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour'
    );
    
    // 色オプションがある場合は、Colorグループにのみ追加
    if (colorOption) {
      colorVariants.push(node);
      processedVariantIds.add(node.id);
      return; // 他のグループには追加しない
    }
    
    // バリエーションタイトルからグループを抽出（例: "Sofa / Leather / Charme Tan"）
    const parts = title.split(" / ");
    if (parts.length > 0) {
      const group = parts[0]; // 最初の部分をグループとして使用
      if (!variantGroups[group]) {
        variantGroups[group] = [];
      }
      variantGroups[group].push(node);
      processedVariantIds.add(node.id);
    }
  });
  
  // Colorバリエーションを別途管理（重複を避ける）
  if (colorVariants.length > 0) {
    variantGroups["Color"] = colorVariants;
  }

  const handleQuantityChange = (newQuantity: number) => {
    const validQuantity = Math.max(1, Math.min(maxQuantity, newQuantity));
    setQuantity(validQuantity);
  };

  return (
    <div className="bg-background">
      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 mb-12 lg:mb-16">
        {/* Images - Left Side */}
        <div className="space-y-4 w-full max-w-[760px] mx-auto lg:mx-0">
          {/* Main Image */}
          <div className="relative w-full aspect-[4/3] rounded-lg bg-secondary/30 group flex items-center justify-center overflow-hidden">
            <Image
              src={
                variantImageOverride?.url ||
                images[selectedImage]?.url ||
                product.featuredImage?.url ||
                "/placeholder.png"
              }
              alt={
                variantImageOverride?.altText ||
                images[selectedImage]?.altText ||
                product.title
              }
              fill
              className="object-contain"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
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
              <>
                <button
                  onClick={() => {
                    setVariantImageOverride(null);
                    setSelectedImage(
                      (prev) => (prev - 1 + images.length) % images.length
                    );
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={() => {
                    setVariantImageOverride(null);
                    setSelectedImage((prev) => (prev + 1) % images.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setVariantImageOverride(null);
                    setSelectedImage(index);
                  }}
                  className={`relative w-20 h-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index
                      ? "border-black"
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
            <span className="text-sm text-muted-foreground">4.3</span>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              (1212)
            </a>
          </div>

          {/* バリエーション選択 */}
          {product.variants.edges.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {product.variants.edges.map(({ node: variant }) => {
                const isSelected = selectedVariant?.id === variant.id;
                const colorOption = variant.selectedOptions?.find(
                  (opt) =>
                    opt.name.toLowerCase() === "color" ||
                    opt.name.toLowerCase() === "colour"
                );
                const buttonLabel =
                  colorOption?.value ||
                  variant.title.split(" / ").pop() ||
                  variant.title;

                return (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                      // バリアントに画像があれば、その画像を表示
                      if (variant.image?.url) {
                        // URLからクエリパラメータを除去して比較
                        const normalizeUrl = (url: string) => url.split("?")[0];
                        const variantImageUrl = normalizeUrl(variant.image.url);
                        const imageIndex = images.findIndex(
                          (img) => normalizeUrl(img.url) === variantImageUrl
                        );
                        if (imageIndex !== -1) {
                          setVariantImageOverride(null);
                          setSelectedImage(imageIndex);
                        } else {
                          // images配列に無い場合でも、バリアント画像を直接表示
                          setVariantImageOverride({
                            url: variant.image.url,
                            altText: variant.image.altText ?? null,
                          });
                        }
                      } else {
                        setVariantImageOverride(null);
                      }
                    }}
                    disabled={!variant.availableForSale}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                      isSelected
                        ? "bg-zinc-800 text-white border-zinc-800"
                        : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300",
                      !variant.availableForSale &&
                        "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {buttonLabel}
                  </button>
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
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white h-12 font-semibold uppercase"
                  productName={product.title}
                  productImage={images[selectedImage]?.url || images[0]?.url}
                >
                  ADD TO CART
                </AddToCartButton>
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
            <div className="text-sm">
              <span className="text-muted-foreground">
                Delivered to{" "}
                <a href="#" className="text-foreground hover:underline">
                  Los Angeles, CA
                </a>
                {" "}: Jan 21st - Feb 3rd
              </span>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">
                30 day satisfaction guarantee.{" "}
                <a href="#" className="text-foreground hover:underline">
                  satisfaction guarantee
                </a>
              </span>
            </div>
          </div>

          {/* Made to go with セクション */}
          <div className="pt-6 border-t">
            <h3 className="text-sm font-medium mb-4">Made to go with</h3>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 overflow-hidden rounded-lg border bg-secondary/30">
                <Image
                  src={images[0]?.url || product.featuredImage?.url || "/placeholder.png"}
                  alt="Related product"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{product.title.split(" - ")[0]} - Related Item</p>
                <p className="text-sm text-muted-foreground mt-1">{formatPrice(price * 0.5)}</p>
              </div>
              <button className="p-2 hover:bg-secondary rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Accordion Section */}
      {mounted && (
        <div className="border-t pt-8">
          <Accordion type="single" collapsible className="w-full space-y-0">
            <AccordionItem value="description" className="border-b">
              <AccordionTrigger className="text-base font-medium py-4 hover:no-underline group [&>svg]:hidden">
                <span>Description</span>
                <Plus className="w-4 h-4 text-muted-foreground group-data-[state=open]:hidden transition-transform ml-auto" />
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
              <AccordionTrigger className="text-base font-medium py-4 hover:no-underline group [&>svg]:hidden">
                <span>Features</span>
                <Plus className="w-4 h-4 text-muted-foreground group-data-[state=open]:hidden transition-transform ml-auto" />
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
              <AccordionTrigger className="text-base font-medium py-4 hover:no-underline group [&>svg]:hidden">
                <span>Specifications</span>
                <Plus className="w-4 h-4 text-muted-foreground group-data-[state=open]:hidden transition-transform ml-auto" />
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
                    <dd className="text-muted-foreground">
                      Check product details
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-medium">Weight:</dt>
                    <dd className="text-muted-foreground">Varies by variant</dd>
                  </div>
                </dl>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="care" className="border-b">
              <AccordionTrigger className="text-base font-medium py-4 hover:no-underline group [&>svg]:hidden">
                <span>Care & Assembly</span>
                <Plus className="w-4 h-4 text-muted-foreground group-data-[state=open]:hidden transition-transform ml-auto" />
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground pb-4">
                <p className="mb-3">
                  Follow these care instructions to maintain your product&apos;s
                  quality:
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
      )}
    </div>
  );
}
