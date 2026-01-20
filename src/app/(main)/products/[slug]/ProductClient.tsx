"use client";

import { useState, useEffect } from "react";
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
  relatedProducts?: Product[];
}

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
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    firstVariant
  );
  const [quantity, setQuantity] = useState(1);

  // クライアントマウント後に詳細（Accordion）を表示
  useEffect(() => {
    setMounted(true);
  }, []);

  // バリエーションからオプションタイプとその値を動的に抽出
  type OptionType = string;
  type OptionValue = string;
  const optionTypesMap = new Map<OptionType, Set<OptionValue>>();

  product.variants.edges.forEach(({ node }) => {
    node.selectedOptions?.forEach((opt) => {
      const optionType = opt.name; // 元の大文字小文字を保持
      if (!optionTypesMap.has(optionType)) {
        optionTypesMap.set(optionType, new Set());
      }
      optionTypesMap.get(optionType)!.add(opt.value);
    });
  });

  const optionTypes = Array.from(optionTypesMap.keys());
  const hasMultipleOptionTypes = optionTypes.length >= 2;

  // 初期選択状態を計算（useStateの初期値として使用）
  const getInitialSelectedOptions = (): Record<string, string> => {
    if (firstVariant && hasMultipleOptionTypes) {
      const initialOptions: Record<string, string> = {};
      firstVariant.selectedOptions?.forEach((opt) => {
        initialOptions[opt.name] = opt.value;
      });
      return initialOptions;
    }
    return {};
  };

  // オプションタイプごとの選択状態を管理（例: { "Color": "Black", "Size": "M" }）
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    getInitialSelectedOptions
  );

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

  // 選択されたオプションの組み合わせに基づいてバリエーションを決定
  const findVariantByOptions = (
    options: Record<string, string>
  ): Variant | undefined => {
    if (Object.keys(options).length === 0) return undefined;
    
    return product.variants.edges.find(({ node }) => {
      // 全ての選択されたオプションが一致するバリエーションを探す
      return Object.entries(options).every(([optionType, optionValue]) => {
        const variantOption = node.selectedOptions?.find(
          (opt) => opt.name === optionType
        );
        return variantOption?.value === optionValue;
      });
    })?.node;
  };

  // 選択されたオプションに基づいて利用可能な値をフィルタリング
  const getAvailableValuesForOption = (
    optionType: string,
    currentSelections: Record<string, string>
  ): Set<string> => {
    const availableValues = new Set<string>();
    
    product.variants.edges.forEach(({ node }) => {
      // 他の選択されたオプションと一致するバリエーションのみを考慮
      const matchesOtherSelections = Object.entries(currentSelections)
        .filter(([type]) => type !== optionType)
        .every(([optionType, optionValue]) => {
          const variantOption = node.selectedOptions?.find(
            (opt) => opt.name === optionType
          );
          return variantOption?.value === optionValue;
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
      
      // images配列内で一致する画像を探す
      const imageIndex = images.findIndex((img) => {
        const normalizedImgUrl = normalizeUrl(img.url);
        return normalizedImgUrl === variantImageUrl;
      });
      
      if (imageIndex !== -1) {
        // images配列内に見つかった場合
        setVariantImageOverride(null);
        setSelectedImage(imageIndex);
      } else {
        // images配列内に見つからない場合、直接表示
        setVariantImageOverride({
          url: variant.image.url,
          altText: variant.image.altText ?? null,
        });
      }
    } else {
      setVariantImageOverride(null);
    }
  };

  // オプションが選択されたらバリエーションを更新
  useEffect(() => {
    if (hasMultipleOptionTypes && optionTypes.length > 0) {
      const selectedOptionsEntries = Object.entries(selectedOptions);
      
      if (selectedOptionsEntries.length > 0) {
        // 完全一致するバリエーションを探す
        const exactMatch = product.variants.edges.find(({ node }) => {
          return selectedOptionsEntries.every(([optionType, optionValue]) => {
            const variantOption = node.selectedOptions?.find(
              (opt) => opt.name === optionType
            );
            return variantOption?.value === optionValue;
          });
        })?.node;

        if (exactMatch) {
          // 完全一致するバリエーションが見つかった場合
          if (exactMatch.id !== selectedVariant?.id) {
            setSelectedVariant(exactMatch);
            setQuantity(1);
            // 画像を切り替え
            switchToVariantImage(exactMatch);
          }
        } else {
          // 完全一致しない場合、選択されているオプションに一致する最初のバリエーションを探す
          // これにより、色だけ選択した時点で画像を切り替えることができる
          const partialMatch = product.variants.edges.find(({ node }) => {
            return selectedOptionsEntries.some(([optionType, optionValue]) => {
              const variantOption = node.selectedOptions?.find(
                (opt) => opt.name === optionType
              );
              return variantOption?.value === optionValue && node.availableForSale;
            });
          })?.node;

          if (partialMatch && partialMatch.image?.url) {
            // バリエーションは更新せず、画像だけ切り替え
            switchToVariantImage(partialMatch);
          }
        }
      }
    }
  }, [
    hasMultipleOptionTypes,
    selectedOptions,
    selectedVariant?.id,
    images,
    optionTypes,
    product.variants.edges,
  ]);

  // 配送日付レンジを計算
  const getDeliveryDateRange = (): string => {
    const minDays = product.deliveryMin?.value
      ? Number(product.deliveryMin.value)
      : null;
    const maxDays = product.deliveryMax?.value
      ? Number(product.deliveryMax.value)
      : null;

    // 両方の値が有効な数値かチェック
    const isValidMin =
      minDays !== null && !isNaN(minDays) && minDays >= 0;
    const isValidMax =
      maxDays !== null && !isNaN(maxDays) && maxDays >= 0;

    if (!isValidMin || !isValidMax) {
      return "Shipping time varies";
    }

    // minとmaxを正規化（max < minの場合は入れ替え）
    let finalMin = minDays;
    let finalMax = maxDays;
    if (finalMax < finalMin) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    // UTC基準で今日の日付を取得（時刻を00:00:00に設定）
    const today = new Date();
    const todayUTC = Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    );

    // 日付を計算
    const minDate = new Date(
      todayUTC + finalMin * 24 * 60 * 60 * 1000
    );
    const maxDate = new Date(
      todayUTC + finalMax * 24 * 60 * 60 * 1000
    );

    // en-US形式で日付をフォーマット（例: Jan 21 - Feb 3）
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date);
    };

    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  // 配送日数を取得（例: "5-7 days"）
  const getDeliveryDays = (): string | null => {
    const minDays = product.deliveryMin?.value
      ? Number(product.deliveryMin.value)
      : null;
    const maxDays = product.deliveryMax?.value
      ? Number(product.deliveryMax.value)
      : null;

    // 両方の値が有効な数値かチェック
    const isValidMin =
      minDays !== null && !isNaN(minDays) && minDays >= 0;
    const isValidMax =
      maxDays !== null && !isNaN(maxDays) && maxDays >= 0;

    if (!isValidMin || !isValidMax) {
      return null;
    }

    // minとmaxを正規化（max < minの場合は入れ替え）
    let finalMin = minDays;
    let finalMax = maxDays;
    if (finalMax < finalMin) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    // 同じ値の場合は "5 days"、異なる場合は "5-7 days"
    if (finalMin === finalMax) {
      return `${finalMin} day${finalMin !== 1 ? "s" : ""}`;
    } else {
      return `${finalMin}-${finalMax} days`;
    }
  };

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
            <div className="space-y-4">
              {hasMultipleOptionTypes ? (
                /* 2つ以上のオプションタイプがある場合は2段階選択 */
                <>
                  {optionTypes.map((optionType, index) => {
                    // 前のオプションタイプが全て選択されているかチェック
                    const previousOptionsSelected = optionTypes
                      .slice(0, index)
                      .every((type) => selectedOptions[type] !== undefined);

                    // このオプションタイプの利用可能な値を取得
                    const availableValues = getAvailableValuesForOption(
                      optionType,
                      selectedOptions
                    );

                    if (!previousOptionsSelected && index > 0) {
                      return null; // 前のオプションが選択されていない場合は表示しない
                    }

                    return (
                      <div key={optionType}>
                        <label className="block text-sm font-medium mb-2">
                          {optionType}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(optionTypesMap.get(optionType) || []).map(
                            (value) => {
                              const isSelected = selectedOptions[optionType] === value;
                              const isAvailable = availableValues.has(value);

                              return (
                                <button
                                  key={value}
                                  onClick={() => {
                                    // このオプションタイプ以降の選択をクリア
                                    const newSelectedOptions: Record<string, string> = {
                                      ...selectedOptions,
                                    };
                                    // 現在のオプションタイプまでの選択を保持
                                    optionTypes.slice(0, index).forEach((type) => {
                                      if (selectedOptions[type]) {
                                        newSelectedOptions[type] = selectedOptions[type];
                                      }
                                    });
                                    // 新しい選択を追加
                                    newSelectedOptions[optionType] = value;
                                    // 以降のオプションタイプの選択をクリア
                                    optionTypes.slice(index + 1).forEach((type) => {
                                      delete newSelectedOptions[type];
                                    });
                                    setSelectedOptions(newSelectedOptions);

                                    // 選択されたオプションに基づいて画像を切り替え
                                    // 完全一致するバリエーションを探す
                                    const exactMatch = product.variants.edges.find(({ node }) => {
                                      return Object.entries(newSelectedOptions).every(([optType, optValue]) => {
                                        const variantOption = node.selectedOptions?.find(
                                          (opt) => opt.name === optType
                                        );
                                        return variantOption?.value === optValue;
                                      });
                                    })?.node;

                                    if (exactMatch && exactMatch.image?.url) {
                                      // 完全一致するバリエーションの画像を表示
                                      switchToVariantImage(exactMatch);
                                    } else {
                                      // 完全一致しない場合、選択されたオプションに一致する最初のバリエーションを探す
                                      const partialMatch = product.variants.edges.find(({ node }) => {
                                        return Object.entries(newSelectedOptions).some(([optType, optValue]) => {
                                          const variantOption = node.selectedOptions?.find(
                                            (opt) => opt.name === optType
                                          );
                                          return variantOption?.value === optValue && node.availableForSale;
                                        });
                                      })?.node;

                                      if (partialMatch && partialMatch.image?.url) {
                                        // 部分一致するバリエーションの画像を表示
                                        switchToVariantImage(partialMatch);
                                      }
                                    }
                                  }}
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
                            }
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                /* 1つのオプションタイプのみ、またはその他のバリエーション */
                <div className="flex flex-wrap gap-2">
                  {product.variants.edges.map(({ node: variant }) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    // 最初のオプションの値を表示（色があれば色、なければ最初のオプション）
                    const firstOption = variant.selectedOptions?.[0];
                    const buttonLabel =
                      firstOption?.value ||
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
                            const normalizeUrl = (url: string) => {
                              // URLを正規化（クエリパラメータとハッシュを除去）
                              try {
                                const urlObj = new URL(url);
                                return `${urlObj.origin}${urlObj.pathname}`;
                              } catch {
                                return url.split("?")[0].split("#")[0];
                              }
                            };
                            
                            const variantImageUrl = normalizeUrl(variant.image.url);
                            const imageIndex = images.findIndex((img) => {
                              const normalizedImgUrl = normalizeUrl(img.url);
                              return normalizedImgUrl === variantImageUrl;
                            });
                            
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
              <div className="text-muted-foreground">
                <span>
                  Within the US: {getDeliveryDateRange()}
                </span>
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
                <AccordionContent className="text-sm text-muted-foreground pb-4">
                  {product.descriptionHtml ? (
                    <div
                      className="prose prose-sm max-w-none text-muted-foreground [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-2 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-2 [&>p]:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                    />
                  ) : (
                    <p>{product.description || "No description available."}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
