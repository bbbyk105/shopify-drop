"use client";

import Image from "next/image";
import Link from "next/link";
import { Product as LocalProduct } from "@/types";
import { Product as ShopifyProduct } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import AddToFavoritesButton from "@/components/shared/AddToFavoritesButton";

interface ProductCardProps {
  product: LocalProduct | ShopifyProduct;
  variant?: "default" | "titleOnly";
}

interface VariantOption {
  optionName: string;
  optionValue: string;
  imageUrl: string;
  variantId: string;
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSecondImageOnHover, setShowSecondImageOnHover] = useState(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSwatchAreaHovered, setIsSwatchAreaHovered] = useState(false);

  // ホバー3秒経過で2枚目表示、マウスが離れたらタイマー解除
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  // ローカル商品とShopify商品の両方に対応
  const isShopifyProduct = "handle" in product;

  const slug = isShopifyProduct ? product.handle : product.slug;
  const title = isShopifyProduct ? product.title : product.name;
  const description = isShopifyProduct
    ? product.description
    : product.description;

  // バリエーションオプションを抽出（Shopify商品のみ）
  // Colorを優先、Colorがない場合は最初に見つかったオプションタイプを使用
  const variantOptions: VariantOption[] = [];
  let targetOptionName: string | null = null;

  if (isShopifyProduct) {
    // まずColorオプションを探す
    for (const { node } of product.variants.edges) {
      const colorOption = node.selectedOptions?.find(
        (opt) =>
          opt.name.toLowerCase() === "color" ||
          opt.name.toLowerCase() === "colour" ||
          opt.name.toLowerCase() === "カラー" ||
          opt.name.toLowerCase() === "色",
      );
      if (colorOption) {
        targetOptionName = colorOption.name;
        break;
      }
    }

    // Colorが見つからない場合は、最初のオプションタイプを使用
    if (!targetOptionName && product.variants.edges.length > 0) {
      const firstOption = product.variants.edges[0]?.node.selectedOptions?.[0];
      if (firstOption) {
        targetOptionName = firstOption.name;
      }
    }

    // 対象オプションタイプのバリエーションを抽出
    if (targetOptionName) {
      const optionMap = new Map<
        string,
        { imageUrl: string; variantId: string }
      >();

      product.variants.edges.forEach(({ node }) => {
        const option = node.selectedOptions?.find(
          (opt) => opt.name === targetOptionName,
        );

        if (option) {
          const optionValue = option.value;
          // まだこの値が登録されていない、または画像がある場合は更新
          if (!optionMap.has(optionValue) || node.image?.url) {
            optionMap.set(optionValue, {
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

      optionMap.forEach((value, optionValue) => {
        variantOptions.push({
          optionName: targetOptionName!,
          optionValue,
          imageUrl: value.imageUrl,
          variantId: value.variantId,
        });
      });
    }
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
    : product.images && product.images.length > 1
      ? product.images[1]
      : product.image;

  // 表示する画像を決定
  let displayImage = firstImage;
  const activeOption = hoveredOption ?? selectedOption;
  const suppressSecondImage =
    variantOptions.length > 0 &&
    (isSwatchAreaHovered || hoveredOption !== null || selectedOption !== null);

  // ホバーされたオプションの画像を優先表示
  if (hoveredOption && variantOptions.length > 0) {
    const hoveredVariant = variantOptions.find(
      (vo) => vo.optionValue === hoveredOption,
    );
    if (hoveredVariant) {
      displayImage = hoveredVariant.imageUrl;
    }
  }
  // 選択されたオプションの画像を表示
  else if (selectedOption && variantOptions.length > 0) {
    const selectedVariant = variantOptions.find(
      (vo) => vo.optionValue === selectedOption,
    );
    if (selectedVariant) {
      displayImage = selectedVariant.imageUrl;
    }
  }
  // ホバーして3秒経過したら2枚目の画像
  else if (
    !suppressSecondImage &&
    showSecondImageOnHover &&
    secondImage &&
    secondImage !== firstImage
  ) {
    displayImage = secondImage;
  }

  const price = isShopifyProduct
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : product.price;

  // お気に入り用の一意な productId（Shopify商品は GraphQL ID、ローカル商品は slug ベース）
  const productId = isShopifyProduct ? product.id : `local-${product.slug}`;

  // セール判定（Shopifyのみ。compareAtPrice > price のときセール）
  const realCompareAtPrice = isShopifyProduct
    ? (product as ShopifyProduct).compareAtPriceRange?.minVariantPrice
      ? parseFloat(
          (product as ShopifyProduct).compareAtPriceRange!.minVariantPrice
            .amount,
        )
      : null
    : null;
  const realIsOnSale =
    realCompareAtPrice != null &&
    realCompareAtPrice > 0 &&
    realCompareAtPrice > price;
  const compareAtPrice = realIsOnSale ? realCompareAtPrice : null;
  const isOnSale =
    compareAtPrice != null && compareAtPrice > price && realIsOnSale;
  const discountPercent =
    isOnSale && compareAtPrice
      ? Math.round((1 - price / compareAtPrice) * 100)
      : 0;

  const isTitleOnly = variant === "titleOnly";

  // 売り切れ判定（Shopify商品のみ。product.availableForSale=false または全バリアントが売り切れ）
  const isSoldOut =
    isShopifyProduct &&
    (() => {
      const p = product as ShopifyProduct;
      return (
        !p.availableForSale ||
        p.variants.edges.every(({ node }) => !node.availableForSale)
      );
    })();

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

  const imageBgColor =
    activeOption && targetOptionName?.toLowerCase().includes("color")
      ? hexToRgba(getColorValue(activeOption), 0.1)
      : undefined;

  return (
    <div className="group flex flex-col">
      <Link href={`/products/${slug}`} className="flex flex-col h-full">
        <div
          className="cursor-pointer flex flex-col h-full transition-all"
          onMouseEnter={() => {
            setIsHovered(true);
            if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = setTimeout(() => {
              setShowSecondImageOnHover(true);
              hoverTimerRef.current = null;
            }, 5000);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowSecondImageOnHover(false);
            if (hoverTimerRef.current) {
              clearTimeout(hoverTimerRef.current);
              hoverTimerRef.current = null;
            }
          }}
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
            {/* 売り切れバッジ */}
            {isSoldOut && (
              <div
                className="absolute top-2 left-2 z-10 rounded-md bg-foreground/90 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-background"
                aria-hidden
              >
                Sold Out
              </div>
            )}
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
            {/* バリエーションオプションスウォッチ */}
            {variantOptions.length > 0 && (
              <div
                className="mb-3 min-h-8 shrink-0 overflow-x-auto pt-1"
                onMouseEnter={() => setIsSwatchAreaHovered(true)}
                onMouseLeave={() => setIsSwatchAreaHovered(false)}
                onClick={(e) => {
                  // スウォッチエリアのクリックで商品詳細ページへの遷移を防ぐ
                  e.stopPropagation();
                }}
              >
                <div className="flex gap-2 items-center justify-start px-1">
                  {variantOptions.map((variantOption) => {
                    const isSelected =
                      selectedOption === variantOption.optionValue;
                    const isHovered =
                      hoveredOption === variantOption.optionValue;
                    const isColorOption =
                      targetOptionName?.toLowerCase().includes("color") ||
                      targetOptionName?.toLowerCase().includes("colour") ||
                      targetOptionName?.toLowerCase().includes("カラー") ||
                      targetOptionName?.toLowerCase().includes("色");

                    return (
                      <button
                        key={variantOption.variantId}
                        className={`relative w-6 h-6 rounded-full border-2 transition-all shrink-0 overflow-hidden ${
                          isSelected
                            ? "border-red-500 scale-110 ring-2 ring-red-500 ring-offset-1"
                            : isHovered
                              ? "border-foreground scale-110"
                              : "border-border hover:border-foreground/50"
                        }`}
                        onMouseEnter={() =>
                          setHoveredOption(variantOption.optionValue)
                        }
                        onMouseLeave={() => setHoveredOption(null)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          // オプション値を選択
                          setSelectedOption(variantOption.optionValue);
                        }}
                        title={variantOption.optionValue}
                      >
                        {/* 色オプションの場合は背景色を設定、それ以外は画像のみ */}
                        {isColorOption && (
                          <span
                            aria-hidden
                            className="absolute inset-0"
                            style={{
                              backgroundColor: getColorValue(
                                variantOption.optionValue,
                              ),
                            }}
                          />
                        )}
                        <Image
                          src={variantOption.imageUrl}
                          alt={variantOption.optionValue}
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
            <div className="flex flex-wrap items-baseline gap-x-1 mt-auto shrink-0">
              {isOnSale ? (
                <>
                  <span className="text-base text-gray-400 line-through font-normal">
                    {formatPrice(compareAtPrice!)}
                  </span>
                  <span className="text-lg font-semibold text-red-600">
                    {formatPrice(price)}
                  </span>
                  {discountPercent > 0 && (
                    <span className="text-red-500 text-xs ml-1">
                      ({discountPercent}% OFF)
                    </span>
                  )}
                  <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full ml-2">
                    Opening Sale
                  </span>
                </>
              ) : (
                <p className="text-base md:text-lg font-bold">
                  {formatPrice(price)}
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
