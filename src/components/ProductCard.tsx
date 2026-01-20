"use client";

import Image from "next/image";
import Link from "next/link";
import { Product as LocalProduct } from "@/types";
import { Product as ShopifyProduct } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import AddToFavoritesButton from "@/components/shared/AddToFavoritesButton";

interface ProductCardProps {
  product: LocalProduct | ShopifyProduct;
  variant?: "default" | "titleOnly";
}

interface ColorVariant {
  color: string;
  imageUrl: string;
  variantId: string;
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [isSwatchAreaHovered, setIsSwatchAreaHovered] = useState(false);

  // ローカル商品とShopify商品の両方に対応
  const isShopifyProduct = "handle" in product;

  const slug = isShopifyProduct ? product.handle : product.slug;
  const title = isShopifyProduct ? product.title : product.name;
  const description = isShopifyProduct
    ? product.description
    : product.description;
  
  // カラーバリエーションを抽出（Shopify商品のみ）
  const colorVariants: ColorVariant[] = [];
  if (isShopifyProduct) {
    const colorMap = new Map<string, { imageUrl: string; variantId: string }>();
    
    product.variants.edges.forEach(({ node }) => {
      const colorOption = node.selectedOptions?.find(
        (opt) =>
          opt.name.toLowerCase() === "color" ||
          opt.name.toLowerCase() === "colour"
      );
      
      if (colorOption) {
        const color = colorOption.value;
        // まだこの色が登録されていない、または画像がある場合は更新
        if (!colorMap.has(color) || node.image?.url) {
          colorMap.set(color, {
            imageUrl:
              node.image?.url ||
              product.featuredImage?.url ||
              product.images.edges[0]?.node.url ||
              "/placeholder.png",
            variantId: node.id,
          });
        }
      }
    });
    
    colorMap.forEach((value, color) => {
      colorVariants.push({
        color,
        imageUrl: value.imageUrl,
        variantId: value.variantId,
      });
    });
  }
  
  // 1枚目の画像
  const firstImage = isShopifyProduct
    ? product.featuredImage?.url ||
      product.images.edges[0]?.node.url ||
      "/placeholder.png"
    : product.image;
  
  // 2枚目の画像（ホバー時に表示）
  const secondImage = isShopifyProduct
    ? product.images.edges[1]?.node.url ||
      product.images.edges[0]?.node.url ||
      "/placeholder.png"
    : (product.images && product.images.length > 1 ? product.images[1] : product.image);
  
  // 表示する画像を決定
  let displayImage = firstImage;
  const activeColor = hoveredColor ?? selectedColor;
  const suppressSecondImage =
    colorVariants.length > 0 &&
    (isSwatchAreaHovered || hoveredColor !== null || selectedColor !== null);

  // ホバーされた色の画像を優先表示
  if (hoveredColor && colorVariants.length > 0) {
    const hoveredVariant = colorVariants.find((cv) => cv.color === hoveredColor);
    if (hoveredVariant) {
      displayImage = hoveredVariant.imageUrl;
    }
  } 
  // 選択された色の画像を表示
  else if (selectedColor && colorVariants.length > 0) {
    const selectedVariant = colorVariants.find((cv) => cv.color === selectedColor);
    if (selectedVariant) {
      displayImage = selectedVariant.imageUrl;
    }
  } 
  // 通常のホバー時は2枚目の画像
  else if (!suppressSecondImage && isHovered && secondImage && secondImage !== firstImage) {
    displayImage = secondImage;
  }
  
  const price = isShopifyProduct
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : product.price;

  const isTitleOnly = variant === "titleOnly";

  const productId = isShopifyProduct ? product.id : `local-${product.slug}`;

  // 色名から実際の色の値を取得（簡易版）
  const getColorValue = (colorName: string): string => {
    const raw = (colorName || "").trim();
    const normalized = raw.toLowerCase().trim();

    // すでにCSSカラー値っぽい場合はそのまま使う
    // - #RGB / #RRGGBB / #RRGGBBAA
    // - rgb()/rgba()
    // - hsl()/hsla()
    if (
      /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(raw) ||
      /^(rgb|rgba|hsl|hsla)\(/i.test(raw)
    ) {
      return raw;
    }

    const colorMap: Record<string, string> = {
      black: "#000000",
      white: "#FFFFFF",
      ash: "#B0B0B0",
      "dark heather": "#4A4A4A",
      "dark heather grey": "#4A4A4A",
      grey: "#808080",
      gray: "#808080",
      red: "#FF0000",
      blue: "#0000FF",
      green: "#008000",
      yellow: "#FFFF00",
      pink: "#FFC0CB",
      purple: "#800080",
      orange: "#FFA500",
      brown: "#A52A2A",
      navy: "#000080",
      beige: "#F5F5DC",
      tan: "#D2B48C",
    };

    // 既知の色名はマップを優先
    if (colorMap[normalized]) return colorMap[normalized];

    // 未知の色名は、文字列から安定した色を生成（毎回同じ色になる）
    // これで /products のスウォッチが全部グレーになるのを防ぐ
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0;
    }
    const hue = hash % 360;
    const saturation = 45 + (hash % 25); // 45-69%
    const lightness = 45 + ((hash >> 8) % 15); // 45-59%
    return `hsl(${hue} ${saturation}% ${lightness}%)`;
  };

  const hexToRgba = (hex: string, alpha: number): string => {
    const sanitized = hex.replace("#", "").trim();
    if (sanitized.length !== 6) return `rgba(0,0,0,${alpha})`;
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const imageBgColor = activeColor
    ? hexToRgba(getColorValue(activeColor), 0.10)
    : undefined;

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${slug}`} className="flex flex-col h-full">
        <div
          className="cursor-pointer flex flex-col h-full transition-all"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 mb-3 shadow-sm group-hover:shadow-md transition-all shrink-0"
            style={imageBgColor ? { backgroundColor: imageBgColor } : undefined}
          >
            {/* メイン画像 */}
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-contain transition-opacity duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div
              className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* お気に入りボタン */}
            <div
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <AddToFavoritesButton
                productId={productId}
                productName={title}
                productImage={firstImage}
                variant="icon"
                size="sm"
                className="bg-background/80 hover:bg-background"
              />
            </div>
          </div>
          <div className="flex flex-col flex-1 min-h-0">
            <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors leading-tight line-clamp-2 mb-2 shrink-0">
              {title}
            </h3>
            {/* カラーバリエーションスウォッチ */}
            {colorVariants.length > 0 && (
              <div 
                className="mb-3 min-h-8 shrink-0 overflow-x-auto"
                onMouseEnter={() => setIsSwatchAreaHovered(true)}
                onMouseLeave={() => setIsSwatchAreaHovered(false)}
                onClick={(e) => {
                  // スウォッチエリアのクリックで商品詳細ページへの遷移を防ぐ
                  e.stopPropagation();
                }}
              >
                <div className="flex gap-2 items-center justify-start px-1">
                  {colorVariants.map((colorVariant) => {
                    const isSelected = selectedColor === colorVariant.color;
                    const isHovered = hoveredColor === colorVariant.color;
                    
                    return (
                      <button
                        key={colorVariant.variantId}
                        className={`relative w-6 h-6 rounded-full border-2 transition-all shrink-0 overflow-hidden ${
                          isSelected
                            ? "border-red-500 scale-110 ring-2 ring-red-500 ring-offset-1"
                            : isHovered
                            ? "border-foreground scale-110"
                            : "border-border hover:border-foreground/50"
                        }`}
                        onMouseEnter={() => setHoveredColor(colorVariant.color)}
                        onMouseLeave={() => setHoveredColor(null)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // 色を選択
                          setSelectedColor(colorVariant.color);
                        }}
                        title={colorVariant.color}
                      >
                        {/* 色名→色コード推測だとズレるため、バリエーション画像をスウォッチとして表示 */}
                        {/* 画像が読み込めない場合のフォールバック背景（背面） */}
                        <span
                          aria-hidden
                          className="absolute inset-0"
                          style={{ backgroundColor: getColorValue(colorVariant.color) }}
                        />
                        <Image
                          src={colorVariant.imageUrl}
                          alt={colorVariant.color}
                          fill
                          className="object-cover z-10"
                          sizes="24px"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <p className="text-base md:text-lg font-bold mt-auto shrink-0">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
