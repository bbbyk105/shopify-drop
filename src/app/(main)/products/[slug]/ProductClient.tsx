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

  // State管理: selectedOptionsのみを保持（最小化）
  // 修正1: lazy initializer にする
  const getInitialSelectedOptions = (): Record<string, string> => {
    // Color+Size商品の場合は必ず未選択から開始
    if (isColorSizeProduct) {
      return {};
    }
    
    // 非2階層商品は従来通り初期選択OK
    // 購入可能な最初のvariantを探す
    const firstAvailableVariant = product.variants.edges.find(
      ({ node }) => node.availableForSale
    )?.node || firstVariant;

    if (firstAvailableVariant && hasMultipleOptionTypes) {
      const initialOptions: Record<string, string> = {};
      firstAvailableVariant.selectedOptions?.forEach((opt) => {
        initialOptions[opt.name] = opt.value;
      });
      return initialOptions;
    }
    return {};
  };

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => getInitialSelectedOptions()
  );

  // 初期化補正を「一度だけ」にするガード
  const didNormalizeInitial = useRef(false);

  // 修正2: isColorSizeProduct が true になった時に、selectedOptions が紛れ込んでいたら {} に矯正する（1回補正）
  useEffect(() => {
    if (!isColorSizeProduct) return;
    if (didNormalizeInitial.current) return;

    // 初期状態で「勝手にselectedが入ってしまっている」ケースだけを1回だけ補正
    if (Object.keys(selectedOptions).length > 0) {
      setSelectedOptions({});
      setQuantity(1);
    }

    didNormalizeInitial.current = true;
  }, [isColorSizeProduct]);

  // Derived state: selectedVariantはselectedOptionsから計算
  const selectedVariant = useMemo(() => {
    if (Object.keys(selectedOptions).length === 0) {
      // 2階層商品で未選択の場合は undefined
      if (hasMultipleOptionTypes) return undefined;
      // 単一オプション商品の場合は firstVariant を返す
      return firstVariant;
    }
    
    return product.variants.edges.find(({ node }) => {
      return Object.entries(selectedOptions).every(([optionType, optionValue]) => {
        const variantOption = node.selectedOptions?.find((opt) => opt.name === optionType);
        return variantOption?.value === optionValue;
      });
    })?.node;
  }, [selectedOptions, product.variants.edges, hasMultipleOptionTypes, firstVariant]);

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

  // 利用可能な値を取得（availableForSaleを基本に）
  const getAvailableValuesForOption = (
    optionType: string,
    currentSelections: Record<string, string>
  ): Set<string> => {
    const availableValues = new Set<string>();
    
    product.variants.edges.forEach(({ node }) => {
      const matchesOtherSelections = Object.entries(currentSelections)
        .filter(([type]) => type !== optionType)
        .every(([type, value]) => {
          const variantOption = node.selectedOptions?.find((opt) => opt.name === type);
          return variantOption?.value === value;
        });

      if (matchesOtherSelections && node.availableForSale) {
        const option = node.selectedOptions?.find((opt) => opt.name === optionType);
        if (option) {
          availableValues.add(option.value);
        }
      }
    });

    return availableValues;
  };

  // Color+Size商品用: 指定されたColorで利用可能なSizeを取得
  const getAvailableSizesForColor = (color: string): Set<string> => {
    if (!detectedColorName || !detectedSizeName) return new Set();
    
    const availableSizes = new Set<string>();
    product.variants.edges.forEach(({ node }) => {
      const colorValue = getOptionValue(node, detectedColorName);
      if (colorValue === color && node.availableForSale) {
        const sizeValue = getOptionValue(node, detectedSizeName);
        if (sizeValue) {
          availableSizes.add(sizeValue);
        }
      }
    });
    return availableSizes;
  };

  // Color+Size商品用: 指定されたColorに購入可能variantが1つでもあるか
  const hasAnyAvailableVariantForColor = (color: string): boolean => {
    if (!detectedColorName) return false;
    
    return product.variants.edges.some(({ node }) => {
      const colorValue = getOptionValue(node, detectedColorName);
      return colorValue === color && node.availableForSale;
    });
  };

  // 選択されたColor/Sizeを取得
  const selectedColor = detectedColorName ? selectedOptions[detectedColorName] : undefined;
  const selectedSize = detectedSizeName ? selectedOptions[detectedSizeName] : undefined;

  // useEffect: 画像切り替えのみ（stateの自動リセットはしない）
  useEffect(() => {
    if (selectedVariant && selectedVariant.image?.url) {
      switchToVariantImage(selectedVariant);
    }
  }, [selectedVariant?.id]);

  // オプション選択ハンドラ（色変更でサイズリセットはここで行う）
  // 修正3: 同じ値をクリックしたら解除できるようにする
  const handleOptionSelect = (optionType: string, value: string) => {
    const newSelectedOptions: Record<string, string> = { ...selectedOptions };
    const currentValue = selectedOptions[optionType];
    
    // 同じ値がクリックされた場合は解除
    if (currentValue === value) {
      delete newSelectedOptions[optionType];
      
      // 選択したオプション以降をクリア
      const currentIndex = optionTypes.indexOf(optionType);
      if (currentIndex !== -1) {
        optionTypes.slice(currentIndex).forEach((type) => {
          delete newSelectedOptions[type];
        });
      }
      
      // Color解除時はSizeも当然消える（Color+Size商品の場合）
      if (isColorSizeProduct && optionType === detectedColorName && detectedSizeName) {
        delete newSelectedOptions[detectedSizeName];
      }
      
      setSelectedOptions(newSelectedOptions);
      setQuantity(1);
      return;
    }
    
    // 新しい選択を設定
    newSelectedOptions[optionType] = value;
    
    // Color+Size商品の場合、Color変更時にSizeをリセット
    if (isColorSizeProduct && optionType === detectedColorName && selectedColor !== value) {
      if (detectedSizeName) {
        delete newSelectedOptions[detectedSizeName];
      }
    }
    
    // 選択したオプション以降をクリア
    const currentIndex = optionTypes.indexOf(optionType);
    if (currentIndex !== -1) {
      optionTypes.slice(currentIndex + 1).forEach((type) => {
        delete newSelectedOptions[type];
      });
    }
    
    setSelectedOptions(newSelectedOptions);
    setQuantity(1);
  };

  // CTAボタンの状態を決定
  const getCTAState = () => {
    if (productAllSoldOut) {
      return { type: "sold_out" as const, message: "Sold Out" };
    }

    if (isColorSizeProduct) {
      if (!selectedColor) {
        return { type: "select_option" as const, message: "Select a color" };
      }
      if (!selectedSize) {
        return { type: "select_option" as const, message: "Select a size" };
      }
      if (selectedVariant) {
        if (isPurchasable(selectedVariant, inventory)) {
          return { type: "add_to_cart" as const };
        } else {
          return { type: "sold_out" as const, message: "Sold Out" };
        }
      }
      return { type: "select_option" as const, message: "Select options" };
    } else {
      // 単一オプション/variant商品
      if (!selectedVariant) {
        return { type: "select_option" as const, message: "Select options" };
      }
      if (isPurchasable(selectedVariant, inventory)) {
        return { type: "add_to_cart" as const };
      } else {
        return { type: "sold_out" as const, message: "Sold Out" };
      }
    }
  };

  const ctaState = getCTAState();

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

  const handleQuantityChange = (newQuantity: number) => {
    const maxQty = maxQuantity ?? 10;
    const validQuantity = Math.max(1, Math.min(maxQty, newQuantity));
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
            {productAllSoldOut && (
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
            <div className="space-y-4">
              {isColorSizeProduct ? (
                /* Color+Size商品の専用UI */
                <>
                  {/* Color選択 */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {detectedColorName}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {sortOptionValues(
                        Array.from(optionTypesMap.get(detectedColorName!) || [])
                      ).map((colorValue) => {
                        const isSelected = selectedColor === colorValue;
                        const hasAvailable = hasAnyAvailableVariantForColor(colorValue);
                        const isDisabled = !hasAvailable;

                        return (
                          <button
                            key={colorValue}
                            onClick={() => handleOptionSelect(detectedColorName!, colorValue)}
                            disabled={isDisabled}
                            className={cn(
                              "px-4 py-2 rounded-full text-sm font-medium transition-all border relative",
                              isSelected
                                ? "bg-zinc-800 text-white border-zinc-800"
                                : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300",
                              isDisabled && "opacity-50 cursor-not-allowed"
                            )}
                          >
                            {colorValue}
                            {isDisabled && (
                              <span className="ml-1 text-xs">(Sold out)</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Size選択 */}
                  {selectedColor ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {detectedSizeName}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const availableSizes = getAvailableSizesForColor(selectedColor);

                          if (availableSizes.size === 0) {
                            return (
                              <p className="text-sm text-muted-foreground">
                                No sizes available for this color
                              </p>
                            );
                          }

                          // 修正3: 選べるものだけ表示（availableSizes を直接 map）
                          return sortOptionValues(Array.from(availableSizes)).map((sizeValue) => {
                            const isSelected = selectedSize === sizeValue;

                            return (
                              <button
                                key={sizeValue}
                                onClick={() => handleOptionSelect(detectedSizeName!, sizeValue)}
                                className={cn(
                                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                  isSelected
                                    ? "bg-zinc-800 text-white border-zinc-800"
                                    : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300"
                                )}
                              >
                                {sizeValue}
                              </button>
                            );
                          });
                        })()}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {detectedSizeName}
                      </label>
                      <p className="text-sm text-muted-foreground">
                        Select a color to see sizes
                      </p>
                    </div>
                  )}
                </>
              ) : hasMultipleOptionTypes ? (
                /* 2階層商品（Color+Size以外） */
                <>
                  {optionTypes.map((optionType, index) => {
                    const previousOptionsSelected = optionTypes
                      .slice(0, index)
                      .every((type) => selectedOptions[type] !== undefined);

                    if (!previousOptionsSelected && index > 0) {
                      return null;
                    }

                    const availableValues = getAvailableValuesForOption(
                      optionType,
                      selectedOptions
                    );

                    return (
                      <div key={optionType}>
                        <label className="block text-sm font-medium mb-2">
                          {optionType}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {sortOptionValues(
                            Array.from(optionTypesMap.get(optionType) || [])
                          ).map((value) => {
                            const isSelected = selectedOptions[optionType] === value;
                            const isAvailable = availableValues.has(value);

                            return (
                              <button
                                key={value}
                                onClick={() => handleOptionSelect(optionType, value)}
                                disabled={!isAvailable}
                                className={cn(
                                  "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                                  isSelected
                                    ? "bg-zinc-800 text-white border-zinc-800"
                                    : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300",
                                  !isAvailable && "opacity-50 cursor-not-allowed"
                                )}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                /* 1つのオプションタイプのみ、またはその他のバリエーション */
                <div className="flex flex-wrap gap-2">
                  {[...product.variants.edges]
                    .map(({ node: variant }) => {
                      const firstOption = variant.selectedOptions?.[0];
                      const buttonLabel =
                        firstOption?.value ||
                        variant.title.split(" / ").pop() ||
                        variant.title;
                      return { variant, buttonLabel };
                    })
                    .sort((a, b) => {
                      const aNum = parseFloat(a.buttonLabel.trim());
                      const bNum = parseFloat(b.buttonLabel.trim());
                      const aIsNumeric = !isNaN(aNum) && /^-?\d+(\.\d+)?$/.test(a.buttonLabel.trim());
                      const bIsNumeric = !isNaN(bNum) && /^-?\d+(\.\d+)?$/.test(b.buttonLabel.trim());
                      
                      if (aIsNumeric && bIsNumeric) {
                        return aNum - bNum;
                      } else {
                        return a.buttonLabel.localeCompare(b.buttonLabel);
                      }
                    })
                    .map(({ variant, buttonLabel }) => {
                      const isSelected = selectedVariant?.id === variant.id;

                      return (
                        <button
                          key={variant.id}
                          onClick={() => {
                            setSelectedOptions(
                              variant.selectedOptions?.reduce(
                                (acc, opt) => {
                                  acc[opt.name] = opt.value;
                                  return acc;
                                },
                                {} as Record<string, string>
                              ) || {}
                            );
                            setQuantity(1);
                            if (variant.image?.url) {
                              switchToVariantImage(variant);
                            }
                          }}
                          // 修正4: disabled 判定を isPurchasable に統一
                          disabled={!isPurchasable(variant, inventory)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all border",
                            isSelected
                              ? "bg-zinc-800 text-white border-zinc-800"
                              : "bg-zinc-100 border-zinc-200 text-zinc-800 hover:bg-zinc-200 hover:border-zinc-300",
                            !isPurchasable(variant, inventory) &&
                              "opacity-50 cursor-not-allowed"
                          )}
                        >
                          {buttonLabel}
                        </button>
                      );
                    })}
                </div>
              )}
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
                  disabled
                  size="lg"
                  className="flex-1 h-12 font-semibold uppercase"
                >
                  {ctaState.message || "Select options"}
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
