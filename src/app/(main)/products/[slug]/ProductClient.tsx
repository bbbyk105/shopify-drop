"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/shared/AddToCartButton";
import AddToFavoritesButton from "@/components/shared/AddToFavoritesButton";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Product, Variant } from "@/lib/shopify/types";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  X,
  Plus,
  Minus,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  normalizeSelectedOptions,
  findVariantBySelectedOptions,
  isOptionValueSelectable,
  applyOptionChangeWithReset,
} from "@/lib/variants";

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
  relatedProducts?: Product[];
}

// Option名の揺れ対応: 実際のproduct.optionsから検出
const COLOR_NAME_CANDIDATES = ["Color", "Colour", "カラー", "色"];
const SIZE_NAME_CANDIDATES = ["Size", "サイズ"];

// 共通ユーティリティ関数
const getOptionValue = (variant: Variant, optionName: string): string | undefined => {
  return variant.selectedOptions?.find((opt) => opt.name === optionName)?.value;
};

const isPurchasable = (variant: Variant, inventory: Record<string, number>): boolean => {
  if (!variant.availableForSale) return false;
  // inventoryが取得できた場合は、在庫数もチェック（undefinedは0扱いしない）
  const inv = inventory[variant.id];
  if (inv !== undefined) {
    return inv > 0;
  }
  // inventoryが取得できない場合は availableForSale のみで判定
  return true;
};

export default function ProductClient({
  product,
  images,
  firstVariant,
  inventory,
  relatedProducts = [],
}: ProductClientProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [variantImageOverride, setVariantImageOverride] = useState<{
    url: string;
    altText?: string | null;
  } | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  // スワイプジェスチャー用のrefとstate
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // クライアントマウント後に詳細（Accordion）を表示
  useEffect(() => {
    setMounted(true);
  }, []);

  // Option名の検出（Color/Sizeの揺れ対応）
  const detectedColorName = useMemo(() => {
    // 実際のvariantsから存在するColor名を検出
    for (const variant of product.variants.edges.map(e => e.node)) {
      const colorOption = variant.selectedOptions?.find(opt => 
        COLOR_NAME_CANDIDATES.some(candidate => 
          opt.name.toLowerCase() === candidate.toLowerCase()
        )
      );
      if (colorOption) return colorOption.name; // 実名を返す
    }
    return null;
  }, [product.variants.edges]);

  const detectedSizeName = useMemo(() => {
    for (const variant of product.variants.edges.map(e => e.node)) {
      const sizeOption = variant.selectedOptions?.find(opt => 
        SIZE_NAME_CANDIDATES.some(candidate => 
          opt.name.toLowerCase() === candidate.toLowerCase()
        )
      );
      if (sizeOption) return sizeOption.name;
    }
    return null;
  }, [product.variants.edges]);

  // オプションタイプとその値を抽出
  const optionTypesMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    product.variants.edges.forEach(({ node }) => {
      node.selectedOptions?.forEach((opt) => {
        const optionType = opt.name;
        if (!map.has(optionType)) {
          map.set(optionType, new Set());
        }
        map.get(optionType)!.add(opt.value);
      });
    });
    return map;
  }, [product.variants.edges]);

  // options配列を構築（normalizeSelectedOptions用）
  const productOptions = useMemo(() => {
    return Array.from(optionTypesMap.entries()).map(([name, values]) => ({
      name,
      values: Array.from(values),
    }));
  }, [optionTypesMap]);

  // 単一variant商品（Default Title）かどうかを判定
  const isSingleVariantProduct = useMemo(() => {
    // optionsが空、または options.length === 1 && options[0].values.length === 1 の場合
    if (productOptions.length === 0) {
      return product.variants.edges.length === 1;
    }
    return (
      productOptions.length === 1 &&
      productOptions[0].values.length === 1 &&
      product.variants.edges.length === 1
    );
  }, [productOptions, product.variants.edges.length]);

  // optionTypes の順序を固定: Color+Size商品の場合は [Color, Size, ...rest] の順
  const optionTypes = useMemo(() => {
    const allTypes = Array.from(optionTypesMap.keys());
    
    if (detectedColorName && detectedSizeName) {
      // Color+Size商品の場合、順序を固定
      const ordered: string[] = [];
      const rest: string[] = [];
      
      // Colorを最初に
      if (allTypes.includes(detectedColorName)) {
        ordered.push(detectedColorName);
      }
      
      // Sizeを2番目に
      if (allTypes.includes(detectedSizeName)) {
        ordered.push(detectedSizeName);
      }
      
      // 残りを追加
      allTypes.forEach(type => {
        if (type !== detectedColorName && type !== detectedSizeName) {
          rest.push(type);
        }
      });
      
      return [...ordered, ...rest];
    }
    
    // Color+Size商品でない場合は元の順序
    return allTypes;
  }, [optionTypesMap, detectedColorName, detectedSizeName]);

  const hasMultipleOptionTypes = optionTypes.length >= 2;
  const isColorSizeProduct = detectedColorName !== null && detectedSizeName !== null && hasMultipleOptionTypes;

  // Primary / Secondary の定義
  const primaryOptionName = optionTypes[0] || null;
  const secondaryOptionName = optionTypes[1] || null;

  // State管理: selectedOptions（すべてnullで初期化）
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | null>>(
    () => normalizeSelectedOptions(productOptions)
  );

  // secondaryリセット通知の表示フラグ
  const [secondaryResetNotice, setSecondaryResetNotice] = useState(false);

  // すべてのvariantsを配列として取得
  const allVariants = useMemo(() => {
    return product.variants.edges.map(({ node }) => node);
  }, [product.variants.edges]);

  // Derived state: selectedVariantはselectedOptionsから計算
  const selectedVariant = useMemo(() => {
    // 単一variant商品の場合は常にfirstVariantを返す
    if (isSingleVariantProduct) {
      return firstVariant;
    }
    
    return findVariantBySelectedOptions(allVariants, selectedOptions);
  }, [selectedOptions, allVariants, isSingleVariantProduct, firstVariant]);

  // すべてのオプションが選択されているか
  const allChosen = useMemo(() => {
    if (isSingleVariantProduct) return true;
    return Object.values(selectedOptions).every((value) => value !== null);
  }, [selectedOptions, isSingleVariantProduct]);

  // 価格計算
  const price = useMemo(() => {
    if (selectedVariant) {
      return parseFloat(selectedVariant.price.amount);
    }
    return parseFloat(product.priceRange.minVariantPrice.amount);
  }, [selectedVariant, product.priceRange.minVariantPrice.amount]);

  // 割引価格の計算
  const compareAtPriceValue = useMemo(() => {
    if (selectedVariant?.compareAtPrice) {
      return parseFloat(selectedVariant.compareAtPrice.amount);
    }
    if (product.compareAtPriceRange?.minVariantPrice) {
      return parseFloat(product.compareAtPriceRange.minVariantPrice.amount);
    }
    return null;
  }, [selectedVariant, product.compareAtPriceRange]);

  const hasDiscount = useMemo(() => {
    return compareAtPriceValue !== null && compareAtPriceValue > 0 && compareAtPriceValue > price;
  }, [compareAtPriceValue, price]);

  // 在庫数の取得（inventoryがundefinedの場合はnullを返す）
  const maxQuantity = useMemo(() => {
    if (!selectedVariant) return null;
    const inv = inventory[selectedVariant.id];
    return inv !== undefined ? inv : null;
  }, [selectedVariant, inventory]);

  // 全バリアントが売り切れかチェック
  const productAllSoldOut = useMemo(() => {
    return product.variants.edges.every(({ node }) => !node.availableForSale);
  }, [product.variants.edges]);

  // URL正規化関数
  const normalizeUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}${urlObj.pathname}`;
    } catch {
      return url.split("?")[0].split("#")[0];
    }
  };

  // 画像を切り替える関数
  const switchToVariantImage = (variant: Variant) => {
    if (variant.image?.url) {
      const variantImageUrl = normalizeUrl(variant.image.url);
      const imageIndex = images.findIndex((img) => {
        const normalizedImgUrl = normalizeUrl(img.url);
        return normalizedImgUrl === variantImageUrl;
      });
      
      if (imageIndex !== -1) {
        setVariantImageOverride(null);
        setSelectedImage(imageIndex);
      } else {
        setVariantImageOverride({
          url: variant.image.url,
          altText: variant.image.altText ?? null,
        });
      }
    } else {
      setVariantImageOverride(null);
    }
  };

  // オプション値をソートする関数
  const sortOptionValues = (values: string[]): string[] => {
    const allNumeric = values.every((value) => {
      const trimmed = value.trim();
      return /^-?\d+(\.\d+)?$/.test(trimmed);
    });

    if (allNumeric && values.length > 0) {
      return [...values].sort((a, b) => {
        const numA = parseFloat(a.trim());
        const numB = parseFloat(b.trim());
        return numA - numB;
      });
    } else {
      return [...values].sort((a, b) => a.localeCompare(b));
    }
  };


  // 選択されたColor/Sizeを取得（nullを許容）
  const selectedColor = detectedColorName ? selectedOptions[detectedColorName] : null;
  const selectedSize = detectedSizeName ? selectedOptions[detectedSizeName] : null;

  // useEffect: 画像切り替えのみ（stateの自動リセットはしない）
  useEffect(() => {
    if (selectedVariant && selectedVariant.image?.url) {
      switchToVariantImage(selectedVariant);
    }
  }, [selectedVariant?.id]);

  // すべての選択を解除するハンドラ
  const handleClearAllSelections = () => {
    setSelectedOptions(normalizeSelectedOptions(productOptions));
    setQuantity(1);
    setSecondaryResetNotice(false);
  };

  // 選択があるかどうかを判定
  const hasAnySelection = useMemo(() => {
    return Object.values(selectedOptions).some((value) => value !== null);
  }, [selectedOptions]);

  // オプション選択ハンドラ
  const handleOptionSelect = (optionType: string, value: string) => {
    const currentValue = selectedOptions[optionType];
    
    // 同じ値がクリックされた場合は解除（nullに戻す）
    if (currentValue === value) {
      const newSelectedOptions: Record<string, string | null> = {
        ...selectedOptions,
        [optionType]: null,
      };
      
      // 選択したオプション以降をクリア
      const currentIndex = optionTypes.indexOf(optionType);
      if (currentIndex !== -1) {
        optionTypes.slice(currentIndex + 1).forEach((type) => {
          newSelectedOptions[type] = null;
        });
      }
      
      setSelectedOptions(newSelectedOptions);
      setQuantity(1);
      setSecondaryResetNotice(false);
      return;
    }
    
    // 新しい選択を適用（primary変更時のsecondaryリセット処理を含む）
    // オプションが2つ以上ある場合、primary変更時にsecondaryをチェック
    if (hasMultipleOptionTypes && primaryOptionName && secondaryOptionName) {
      const result = applyOptionChangeWithReset({
        selectedOptions,
        variants: allVariants,
        primaryName: primaryOptionName,
        secondaryName: secondaryOptionName,
        changedName: optionType,
        nextValue: value,
      });
      
      // 選択したオプション以降をクリア（primary変更時以外も含む）
      const currentIndex = optionTypes.indexOf(optionType);
      if (currentIndex !== -1) {
        optionTypes.slice(currentIndex + 1).forEach((type) => {
          if (type !== secondaryOptionName || !result.didResetSecondary) {
            result.nextSelectedOptions[type] = null;
          }
        });
      }
      
      setSelectedOptions(result.nextSelectedOptions);
      setSecondaryResetNotice(result.didResetSecondary);
    } else {
      // primary/secondaryが定義されていない場合は通常変更
      const newSelectedOptions: Record<string, string | null> = {
        ...selectedOptions,
        [optionType]: value,
      };
      
      // 選択したオプション以降をクリア
      const currentIndex = optionTypes.indexOf(optionType);
      if (currentIndex !== -1) {
        optionTypes.slice(currentIndex + 1).forEach((type) => {
          newSelectedOptions[type] = null;
        });
      }
      
      setSelectedOptions(newSelectedOptions);
      setSecondaryResetNotice(false);
    }
    
    setQuantity(1);
  };

  // CTAボタンの状態を決定
  const ctaState = useMemo(() => {
    // 単一variant商品の場合は常にADD TO CART（在庫チェック付き）
    if (isSingleVariantProduct) {
      if (selectedVariant && isPurchasable(selectedVariant, inventory)) {
        return { type: "add_to_cart" as const, disabled: false };
      } else if (selectedVariant && !selectedVariant.availableForSale) {
        return { type: "sold_out" as const, disabled: true };
      } else {
        return { type: "unavailable" as const, disabled: true };
      }
    }

    // 全オプションが選択されていない場合
    if (!allChosen) {
      return { type: "select_options" as const, disabled: true };
    }

    // 全オプションが選択されている場合
    if (!selectedVariant) {
      // variantが存在しない
      return { type: "unavailable" as const, disabled: true };
    }

    if (!selectedVariant.availableForSale) {
      // availableForSale=false
      return { type: "sold_out" as const, disabled: true };
    }

    if (isPurchasable(selectedVariant, inventory)) {
      // availableForSale=true かつ在庫あり
      return { type: "add_to_cart" as const, disabled: false };
    } else {
      // 在庫なし
      return { type: "sold_out" as const, disabled: true };
    }
  }, [allChosen, selectedVariant, inventory, isSingleVariantProduct]);

  // 配送日付レンジを計算
  const getDeliveryDateRange = (): string => {
    const minDays = product.deliveryMin?.value ? Number(product.deliveryMin.value) : null;
    const maxDays = product.deliveryMax?.value ? Number(product.deliveryMax.value) : null;

    const isValidMin = minDays !== null && !isNaN(minDays) && minDays >= 0;
    const isValidMax = maxDays !== null && !isNaN(maxDays) && maxDays >= 0;

    if (!isValidMin || !isValidMax) {
      return "Shipping time varies";
    }

    let finalMin = minDays;
    let finalMax = maxDays;
    if (finalMax < finalMin) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    const today = new Date();
    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    );

    const minDate = new Date(todayUTC + finalMin * 24 * 60 * 60 * 1000);
    const maxDate = new Date(todayUTC + finalMax * 24 * 60 * 60 * 1000);

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    };

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  // 配送日数を取得
  const getDeliveryDays = (): string | null => {
    const minDays = product.deliveryMin?.value ? Number(product.deliveryMin.value) : null;
    const maxDays = product.deliveryMax?.value ? Number(product.deliveryMax.value) : null;

    const isValidMin = minDays !== null && !isNaN(minDays) && minDays >= 0;
    const isValidMax = maxDays !== null && !isNaN(maxDays) && maxDays >= 0;

    if (!isValidMin || !isValidMax) {
      return null;
    }

    let finalMin = minDays;
    let finalMax = maxDays;
    if (finalMax < finalMin) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    if (finalMin === finalMax) {
      return `${finalMin} day${finalMin !== 1 ? "s" : ""}`;
    } else {
      return `${finalMin}-${finalMax} days`;
    }
  };

  // バリアント変更時に数量をリセット（在庫を超えないように）
  useEffect(() => {
    if (selectedVariant && maxQuantity !== null) {
      if (quantity > maxQuantity) {
        setQuantity(Math.max(1, maxQuantity));
      }
    }
  }, [selectedVariant?.id, maxQuantity]);

  // スワイプジェスチャーハンドラー（モバイルのみ）
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && images.length > 1) {
      // 左にスワイプ = 次の画像
      setVariantImageOverride(null);
      setSelectedImage((prev) => (prev + 1) % images.length);
    } else if (isRightSwipe && images.length > 1) {
      // 右にスワイプ = 前の画像
      setVariantImageOverride(null);
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div className="bg-background">
      {/* Product Section */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-8 xl:gap-12 mb-12 xl:mb-16">
        {/* Images - Left Side */}
        <div className="space-y-4 w-full max-w-[760px] mx-auto xl:mx-0">
          {/* Main Image */}
          <div
            ref={imageContainerRef}
            className="relative w-full aspect-4/3 rounded-lg bg-secondary/30 group flex items-center justify-center overflow-hidden touch-pan-y xl:touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
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
              className="object-contain select-none"
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              draggable={false}
            />

            {/* セールバッジ */}
            {hasDiscount && (
              <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-full">
                SALE
              </div>
            )}

            {/* 在庫切れバッジ */}
            {productAllSoldOut && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                <div className="text-center">
                  <span className="text-white font-bold text-3xl block mb-2">
                    Sold Out
                  </span>
                </div>
              </div>
            )}

            {/* 画像ナビゲーション - デスクトップのみ表示 */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    setVariantImageOverride(null);
                    setSelectedImage(
                      (prev) => (prev - 1 + images.length) % images.length
                    );
                  }}
                  className="hidden xl:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <button
                  onClick={() => {
                    setVariantImageOverride(null);
                    setSelectedImage((prev) => (prev + 1) % images.length);
                  }}
                  className="hidden xl:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-all z-10"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </>
            )}
            
            {/* モバイル用の画像インジケーター */}
            {images.length > 1 && (
              <div className="xl:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setVariantImageOverride(null);
                      setSelectedImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      selectedImage === index
                        ? "bg-white w-6"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnail Gallery - デスクトップのみ表示 */}
          {images.length > 1 && (
            <div className="hidden xl:flex gap-3 overflow-x-auto pb-2">
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
        <div className="space-y-6 w-full max-w-[760px] mx-auto xl:mx-0">
          {/* タイトル */}
          <div>
            <h1 className="text-3xl xl:text-4xl font-bold mb-2 leading-tight">
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
          {!isSingleVariantProduct && product.variants.edges.length > 1 && (
            <div className="space-y-4">
              {/* 選択解除ボタン */}
              {hasAnySelection && (
                <div className="flex justify-end">
                  <button
                    onClick={handleClearAllSelections}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear all selections"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear selections</span>
                  </button>
                </div>
              )}
              {optionTypes.map((optionType, index) => {
                // 前のオプションが選択されていない場合は表示しない（順次選択）
                const previousOptionsSelected = optionTypes
                  .slice(0, index)
                  .every((type) => selectedOptions[type] !== null);

                if (!previousOptionsSelected && index > 0) {
                  return null;
                }

                const isSecondary = optionType === secondaryOptionName;
                const isSelected = selectedOptions[optionType] !== null;

                return (
                  <div key={optionType}>
                    <label className="block text-sm font-medium mb-2">
                      {optionType}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sortOptionValues(
                        Array.from(optionTypesMap.get(optionType) || [])
                      ).map((value) => {
                        const isValueSelected = selectedOptions[optionType] === value;
                        const isSelectable = isOptionValueSelectable(
                          allVariants,
                          selectedOptions,
                          optionType,
                          value
                        );

                        return (
                          <button
                            key={value}
                            onClick={() => handleOptionSelect(optionType, value)}
                            disabled={!isSelectable}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                              isValueSelected
                                ? "bg-zinc-800 text-white border-zinc-800"
                                : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300",
                              !isSelectable && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                    {/* Secondaryリセット通知 */}
                    {isSecondary && secondaryResetNotice && (
                      <p className="text-xs text-amber-600 mt-2">
                        Selected option isn't available for this selection. Please choose again.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 数量選択とカートに追加ボタン */}
          <div className="space-y-3">
            {/* 数量選択 */}
            {ctaState.type === "add_to_cart" && selectedVariant && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Quantity</label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => {
                        if (quantity > 1) {
                          setQuantity(quantity - 1);
                        }
                      }}
                      disabled={quantity <= 1}
                      className="p-2 hover:bg-secondary cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-12 text-center text-base font-medium">
                      {quantity}
                    </span>

                    {(() => {
                      const canIncrease =
                        maxQuantity === null || quantity < maxQuantity;

                      return (
                        <button
                          onClick={() => {
                            if (canIncrease) {
                              const newQty = quantity + 1;
                              if (maxQuantity === null || newQty <= maxQuantity) {
                                setQuantity(newQty);
                              }
                            }
                          }}
                          disabled={!canIncrease}
                          className="p-2 hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Increase quantity"
                          title={
                            maxQuantity !== null && quantity >= maxQuantity
                              ? `Stock: ${maxQuantity}`
                              : "Increase quantity"
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      );
                    })()}
                  </div>
                  {/* 在庫情報の表示 */}
                  {maxQuantity !== null && (
                    <p className="text-xs text-muted-foreground">
                      Stock: {maxQuantity}
                      {quantity >= maxQuantity && (
                        <span className="text-destructive ml-1">
                          (Max stock)
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* カートに追加ボタン */}
            <div className="flex items-center gap-3">
              {ctaState.type === "add_to_cart" && selectedVariant ? (
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
                    disabled={ctaState.disabled}
                    size="lg"
                    className="flex-1 h-12 font-semibold uppercase"
                  >
                    {ctaState.type === "select_options"
                      ? "SELECT OPTIONS"
                      : ctaState.type === "unavailable"
                      ? "UNAVAILABLE"
                      : ctaState.type === "sold_out"
                      ? "SOLD OUT"
                      : "SELECT OPTIONS"}
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
          </div>

          {/* 配送情報 */}
          <div className="space-y-3 pt-4 border-t">
            <div className="text-sm">
              <div className="text-muted-foreground">
                <span>Within the US: {getDeliveryDateRange()}</span>
                {getDeliveryDays() && (
                  <span className="block text-xs mt-1 opacity-75">
                    ({getDeliveryDays()})
                  </span>
                )}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-muted-foreground">
                7-day returns accepted.
              </span>
            </div>
          </div>

          {/* 商品説明（右下） */}
          <div className="pt-2 border-t">
            {mounted ? (
              <Accordion
                type="single"
                collapsible
                defaultValue="right-description"
                className="w-full space-y-0"
              >
                <AccordionItem value="right-description" className="border-b-0">
                  <AccordionTrigger className="text-sm font-medium py-4 hover:no-underline">
                    <span>Description</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    {product.descriptionHtml ? (
                      <div
                        className="rte text-sm text-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_p:last-child]:mb-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1:first-child]:mt-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2:first-child]:mt-0 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3:first-child]:mt-0 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3 [&_h4:first-child]:mt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_a:hover]:opacity-80 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_strong]:font-bold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_hr]:my-6 [&_hr]:border-t [&_hr]:border-border"
                        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                      />
                    ) : (
                      <p className="text-sm text-foreground leading-relaxed">
                        {product.description || "No description available."}
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="space-y-0">
                <div className="text-sm font-medium py-4">
                  <span>Description</span>
                </div>
                <div className="pb-4">
                  {product.descriptionHtml ? (
                    <div
                      className="rte text-sm text-foreground [&_p]:mb-4 [&_p]:leading-relaxed [&_p:last-child]:mb-0 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h1:first-child]:mt-0 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2:first-child]:mt-0 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3:first-child]:mt-0 [&_h4]:text-base [&_h4]:font-semibold [&_h4]:mb-2 [&_h4]:mt-3 [&_h4:first-child]:mt-0 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-2 [&_li]:mb-1 [&_a]:text-primary [&_a]:underline [&_a:hover]:opacity-80 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4 [&_strong]:font-bold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_hr]:my-6 [&_hr]:border-t [&_hr]:border-border"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  ) : (
                    <p className="text-sm text-foreground leading-relaxed">
                      {product.description || "No description available."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Made to go with セクション */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium mb-4">Made to go with</h3>
              {relatedProducts.map((relatedProduct) => {
                const relatedPrice = parseFloat(
                  relatedProduct.priceRange.minVariantPrice.amount
                );
                const relatedImage =
                  relatedProduct.featuredImage?.url ||
                  relatedProduct.images.edges[0]?.node.url ||
                  "/placeholder.png";

                return (
                  <div key={relatedProduct.id} className="flex items-center gap-4">
                    <Link
                      href={`/products/${relatedProduct.handle}`}
                      className="relative w-20 h-20 overflow-hidden rounded-lg border bg-secondary/30 hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={relatedImage}
                        alt={relatedProduct.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        href={`/products/${relatedProduct.handle}`}
                        className="text-sm font-medium hover:underline block"
                      >
                        {relatedProduct.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(relatedPrice)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
