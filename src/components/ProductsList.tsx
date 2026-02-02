"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronRight as ChevronRightIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";
import ProductCard from "@/components/ProductCard";

type Product = ShopifyProduct | LocalProduct;

interface ProductsListProps {
  products: Product[];
  title: string;
  description?: string;
  /** ページ上部に h1 がある場合は "h2" を指定（h1 重複防止） */
  titleLevel?: "h1" | "h2";
  itemsPerPage?: number;
  currentCategory?: string;
  filterConfig?: {
    showProduct?: boolean;
    showRoom?: boolean;
    showColor?: boolean;
    showMaterial?: boolean;
    showSize?: boolean;
    showType?: boolean;
    showStyle?: boolean;
    customFilters?: Array<{
      key: string;
      label: string;
      options: string[];
      getCount: (option: string) => number;
    }>;
  };
}

type SortOption = "popularity" | "price-high" | "price-low" | "newest";

const ITEMS_PER_PAGE_DEFAULT = 20;

// カラーマップ
const colorMap: Record<string, string> = {
  white: "#FFFFFF",
  black: "#000000",
  gray: "#808080",
  grey: "#808080",
  brown: "#8B4513",
  red: "#FF0000",
  blue: "#0000FF",
  green: "#008000",
  yellow: "#FFFF00",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  navy: "#000080",
  cream: "#FFFDD0",
};

export default function ProductsList({
  products,
  title,
  description,
  titleLevel = "h1",
  itemsPerPage = ITEMS_PER_PAGE_DEFAULT,
  currentCategory,
  filterConfig = {},
}: ProductsListProps) {
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({
    sort: false,
    product: false,
    price: false,
    room: false,
    color: false,
    material: false,
    size: false,
    type: false,
    style: false,
  });

  // モバイル画面でフィルターを初期状態で閉じる
  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint (1024px)
      if (isMobile) {
        setExpandedFilters({
          sort: false,
          product: false,
          price: false,
          room: false,
          color: false,
          material: false,
          size: false,
          type: false,
          style: false,
        });
      }
    };

    // 初回チェック
    checkMobile();

    // リサイズ時にチェック
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // カテゴリスクロール位置を復元
  useEffect(() => {
    const container = document.getElementById("category-scroll-container");
    if (container) {
      const savedPosition = sessionStorage.getItem("categoryScrollPosition");
      if (savedPosition) {
        container.scrollLeft = parseInt(savedPosition, 10);
      }
    }
  }, [currentCategory]);

  // フィルターパネルが開いている時は背景のスクロールを無効化
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFilterOpen]);

  // フィルター状態
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(true);

  // カスタムフィルター状態
  const [customFilterStates, setCustomFilterStates] = useState<
    Record<string, string[]>
  >({});

  // 商品からカテゴリー、ルーム、カラー、マテリアル、サイズ、タイプ、スタイルを抽出
  const categories = useMemo(() => {
    if (!filterConfig.showProduct) return [];
    const cats = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            !lower.includes("room") &&
            !lower.includes("color") &&
            !lower.includes("material") &&
            !lower.includes("sale") &&
            !lower.includes("bestseller") &&
            !lower.includes("size") &&
            !lower.includes("type") &&
            !lower.includes("style")
          ) {
            cats.add(tag);
          }
        });
      }
    });
    return Array.from(cats).sort();
  }, [products, filterConfig.showProduct]);

  const rooms = useMemo(() => {
    if (!filterConfig.showRoom) return [];
    const roomSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            lower.includes("room") ||
            lower.includes("bedroom") ||
            lower.includes("living")
          ) {
            roomSet.add(tag);
          }
        });
      }
    });
    return Array.from(roomSet).sort();
  }, [products, filterConfig.showRoom]);

  const colors = useMemo(() => {
    if (!filterConfig.showColor) return [];
    const colorSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            [
              "white",
              "black",
              "gray",
              "grey",
              "brown",
              "red",
              "blue",
              "green",
              "yellow",
              "beige",
              "tan",
              "navy",
              "cream",
            ].includes(lower)
          ) {
            colorSet.add(tag);
          }
        });
      }
      // バリアントからもカラーを抽出
      if ("variants" in product && product.variants?.edges) {
        product.variants.edges.forEach(({ node }) => {
          const colorOption = node.selectedOptions?.find(
            (opt) => opt.name.toLowerCase() === "color"
          );
          if (colorOption) {
            colorSet.add(colorOption.value);
          }
        });
      }
    });
    return Array.from(colorSet).sort();
  }, [products, filterConfig.showColor]);

  const materials = useMemo(() => {
    if (!filterConfig.showMaterial) return [];
    const materialSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            lower.includes("leather") ||
            lower.includes("fabric") ||
            lower.includes("wood") ||
            lower.includes("metal") ||
            lower.includes("glass") ||
            lower.includes("cotton") ||
            lower.includes("polyester") ||
            lower.includes("silk")
          ) {
            materialSet.add(tag);
          }
        });
      }
    });
    return Array.from(materialSet).sort();
  }, [products, filterConfig.showMaterial]);

  const sizes = useMemo(() => {
    if (!filterConfig.showSize) return [];
    const sizeSet = new Set<string>();
    products.forEach((product) => {
      if ("variants" in product && product.variants?.edges) {
        product.variants.edges.forEach(({ node }) => {
          const sizeOption = node.selectedOptions?.find(
            (opt) => opt.name.toLowerCase() === "size"
          );
          if (sizeOption) {
            sizeSet.add(sizeOption.value);
          }
        });
      }
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (["xs", "s", "m", "l", "xl", "xxl", "xxxl"].includes(lower)) {
            sizeSet.add(tag);
          }
        });
      }
    });
    return Array.from(sizeSet).sort();
  }, [products, filterConfig.showSize]);

  const types = useMemo(() => {
    if (!filterConfig.showType) return [];
    const typeSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            lower.includes("tshirt") ||
            lower.includes("t-shirt") ||
            lower.includes("shirt") ||
            lower.includes("pants") ||
            lower.includes("jeans") ||
            lower.includes("dress") ||
            lower.includes("jacket") ||
            lower.includes("hoodie") ||
            lower.includes("sweater")
          ) {
            typeSet.add(tag);
          }
        });
      }
    });
    return Array.from(typeSet).sort();
  }, [products, filterConfig.showType]);

  const styles = useMemo(() => {
    if (!filterConfig.showStyle) return [];
    const styleSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            lower.includes("casual") ||
            lower.includes("formal") ||
            lower.includes("sporty") ||
            lower.includes("vintage") ||
            lower.includes("modern") ||
            lower.includes("classic")
          ) {
            styleSet.add(tag);
          }
        });
      }
    });
    return Array.from(styleSet).sort();
  }, [products, filterConfig.showStyle]);

  // フィルタリングとソート
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // 商品カテゴリーフィルター
    if (selectedProducts.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedProducts.some((cat) => product.tags.includes(cat));
        }
        return false;
      });
    }

    // ルームフィルター
    if (selectedRooms.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedRooms.some((room) => product.tags.includes(room));
        }
        return false;
      });
    }

    // カラーフィルター
    if (selectedColors.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          if (selectedColors.some((color) => product.tags.includes(color)))
            return true;
        }
        if ("variants" in product && product.variants?.edges) {
          return product.variants.edges.some(({ node }) => {
            const colorOption = node.selectedOptions?.find(
              (opt) => opt.name.toLowerCase() === "color"
            );
            return colorOption && selectedColors.includes(colorOption.value);
          });
        }
        return false;
      });
    }

    // マテリアルフィルター
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedMaterials.some((material) =>
            product.tags.includes(material)
          );
        }
        return false;
      });
    }

    // サイズフィルター
    if (selectedSizes.length > 0) {
      filtered = filtered.filter((product) => {
        if ("variants" in product && product.variants?.edges) {
          return product.variants.edges.some(({ node }) => {
            const sizeOption = node.selectedOptions?.find(
              (opt) => opt.name.toLowerCase() === "size"
            );
            return sizeOption && selectedSizes.includes(sizeOption.value);
          });
        }
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedSizes.some((size) => product.tags.includes(size));
        }
        return false;
      });
    }

    // タイプフィルター
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedTypes.some((type) => product.tags.includes(type));
        }
        return false;
      });
    }

    // スタイルフィルター
    if (selectedStyles.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedStyles.some((style) => product.tags.includes(style));
        }
        return false;
      });
    }

    // カスタムフィルター
    if (filterConfig.customFilters) {
      filterConfig.customFilters.forEach((customFilter) => {
        const selected = customFilterStates[customFilter.key] || [];
        if (selected.length > 0) {
          filtered = filtered.filter((product) => {
            if ("tags" in product && Array.isArray(product.tags)) {
              return selected.some((option) => product.tags.includes(option));
            }
            return false;
          });
        }
      });
    }

    // 価格フィルター
    filtered = filtered.filter((product) => {
      const price =
        "priceRange" in product
          ? parseFloat(product.priceRange.minVariantPrice.amount)
          : product.price;
      return price >= minPrice && price <= maxPrice;
    });

    // セールフィルター
    if (onSale) {
      filtered = filtered.filter((product) => {
        if ("priceRange" in product) {
          const price = parseFloat(product.priceRange.minVariantPrice.amount);
          const compareAtPrice = product.compareAtPriceRange?.minVariantPrice
            ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
            : null;
          if (compareAtPrice && compareAtPrice > price) return true;

          return product.variants.edges.some(({ node }) => {
            if (node.compareAtPrice) {
              const variantPrice = parseFloat(node.price.amount);
              const variantCompareAtPrice = parseFloat(
                node.compareAtPrice.amount
              );
              return variantCompareAtPrice > variantPrice;
            }
            return false;
          });
        }
        return false;
      });
    }

    // 在庫フィルター
    if (inStock) {
      filtered = filtered.filter((product) => {
        if ("availableForSale" in product) {
          return product.availableForSale !== false;
        }
        return true;
      });
    }

    // ソート
    switch (sortOption) {
      case "price-high":
        return filtered.sort((a, b) => {
          const priceA =
            "priceRange" in a
              ? parseFloat(a.priceRange.minVariantPrice.amount)
              : a.price;
          const priceB =
            "priceRange" in b
              ? parseFloat(b.priceRange.minVariantPrice.amount)
              : b.price;
          return priceB - priceA;
        });
      case "price-low":
        return filtered.sort((a, b) => {
          const priceA =
            "priceRange" in a
              ? parseFloat(a.priceRange.minVariantPrice.amount)
              : a.price;
          const priceB =
            "priceRange" in b
              ? parseFloat(b.priceRange.minVariantPrice.amount)
              : b.price;
          return priceA - priceB;
        });
      case "newest":
        return filtered;
      case "popularity":
      default:
        return filtered;
    }
  }, [
    products,
    sortOption,
    selectedProducts,
    selectedRooms,
    selectedColors,
    selectedMaterials,
    selectedSizes,
    selectedTypes,
    selectedStyles,
    minPrice,
    maxPrice,
    onSale,
    inStock,
    customFilterStates,
    filterConfig.customFilters,
  ]);

  // ページネーション計算
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = filteredAndSortedProducts.slice(
    startIndex,
    endIndex
  );

  // ソート変更時にページを1にリセット
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setCurrentPage(1);
  };

  // ページネーション時にページトップにスクロール
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const toggleFilter = (filterName: string) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const toggleProduct = (product: string) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
    setCurrentPage(1);
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
    setCurrentPage(1);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
    setCurrentPage(1);
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
    setCurrentPage(1);
  };

  const toggleCustomFilter = (key: string, option: string) => {
    setCustomFilterStates((prev) => {
      const current = prev[key] || [];
      return {
        ...prev,
        [key]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
    setCurrentPage(1);
  };

  // カテゴリーフィルター用のデータ（画像付き）
  const categoryFilters = useMemo(
    () => [
      {
        name: "All Products",
        href: "/products",
        image: "/images/all_products.webp",
      },
      {
        name: "New Arrivals",
        href: "/new-arrivals",
        image: "/images/newarrivals.webp",
      },
      { name: "Lighting", href: "/lighting", image: "/images/lightning.webp" },
      { name: "Clothing", href: "/clothing", image: "/images/clothing.webp" },
      {
        name: "Living Room",
        href: "/rooms/living-room",
        image: "/images/living_room.webp",
      },
      {
        name: "Bedroom",
        href: "/rooms/bedroom",
        image: "/images/bed_room.webp",
      },
      {
        name: "Dining Room & Kitchen",
        href: "/rooms/dining-room-kitchen",
        image: "/images/dining.webp",
      },
      {
        name: "Outdoor",
        href: "/rooms/outdoor",
        image: "/images/outdoor.webp",
      },
      {
        name: "Home Office",
        href: "/rooms/home-office",
        image: "/images/home_office.webp",
      },
      {
        name: "Entryway",
        href: "/rooms/entryway",
        image: "/images/entryway.webp",
      },
    ],
    []
  );

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Page Title & Description */}
        <div className="mb-8">
          {titleLevel === "h2" ? (
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{title}</h2>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          )}
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Category Filter - カード形式 */}
        <div className="mb-8">
          <div
            className="overflow-x-auto -mx-4 px-4 scrollbar-hide"
            id="category-scroll-container"
          >
            <div className="flex gap-3 min-w-max py-2">
              {categoryFilters.map((category) => {
                const isActive = currentCategory === category.href;
                if (category.image) {
                  // 画像付きカード形式（1枚目の画像スタイル）
                  return (
                    <Link
                      key={category.href}
                      href={category.href}
                      scroll={false}
                      onClick={(e) => {
                        // カテゴリ選択時に水平スクロール位置を保持
                        const container = document.getElementById(
                          "category-scroll-container"
                        );
                        if (container) {
                          const scrollLeft = container.scrollLeft;
                          // スクロール位置をsessionStorageに保存
                          sessionStorage.setItem(
                            "categoryScrollPosition",
                            scrollLeft.toString()
                          );
                        }
                      }}
                      className={`relative flex items-center gap-3 min-w-[200px] rounded-2xl overflow-hidden transition-all duration-200 ${
                        isActive
                          ? "ring-2 ring-zinc-900 dark:ring-zinc-100 shadow-lg"
                          : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:shadow-md active:scale-[0.98]"
                      }`}
                    >
                      <div className="relative w-20 h-20 shrink-0 bg-zinc-100 dark:bg-zinc-700 overflow-hidden rounded-l-2xl">
                        {category.image && category.image.startsWith("http") ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                            unoptimized={category.image.startsWith("http")}
                          />
                        ) : null}
                      </div>
                      <span
                        className={`text-sm font-semibold pr-4 ${
                          isActive
                            ? "text-zinc-900 dark:text-white"
                            : "text-zinc-700 dark:text-zinc-200"
                        }`}
                      >
                        {category.name}
                      </span>
                    </Link>
                  );
                } else {
                  // 画像なしの場合は丸いボタン形式（3枚目の画像スタイル）
                  return (
                    <Link
                      key={category.href}
                      href={category.href}
                      scroll={false}
                      onClick={(e) => {
                        // カテゴリ選択時に水平スクロール位置を保持
                        const container = document.getElementById(
                          "category-scroll-container"
                        );
                        if (container) {
                          const scrollLeft = container.scrollLeft;
                          // スクロール位置をsessionStorageに保存
                          sessionStorage.setItem(
                            "categoryScrollPosition",
                            scrollLeft.toString()
                          );
                        }
                      }}
                      className={`relative px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/20"
                          : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 hover:shadow-sm active:scale-[0.98]"
                      }`}
                    >
                      {category.name}
                    </Link>
                  );
                }
              })}
            </div>
          </div>
        </div>

        {/* Filter Button - モバイルのみ */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm text-muted-foreground">
            {filteredAndSortedProducts.length} items
          </p>
          <Button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm shadow-md"
          >
            FILTERS
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Side Panel - モバイル用 */}
        {isFilterOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            {/* Side Panel */}
            <aside
              className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto translate-x-0`}
            >
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-xl font-semibold">Sort & Filter</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filteredAndSortedProducts.length} items
                  </p>
                </div>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="lg:hidden p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="hidden lg:block px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                >
                  DONE
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Sort By */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("sort")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Sort By</span>
                    {expandedFilters.sort ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.sort && (
                    <div className="space-y-2">
                      {(
                        [
                          "popularity",
                          "price-high",
                          "price-low",
                          "newest",
                        ] as SortOption[]
                      ).map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="sort"
                            value={option}
                            checked={sortOption === option}
                            onChange={() => handleSortChange(option)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm">
                            {option === "popularity"
                              ? "Popularity"
                              : option === "price-high"
                              ? "High - Low Price"
                              : option === "price-low"
                              ? "Low - High Price"
                              : "Newest"}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Category */}
                {filterConfig.showProduct && categories.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("product")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Product</span>
                      {expandedFilters.product ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.product && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {categories.map((cat) => {
                          const count = products.filter(
                            (p) =>
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(cat)
                          ).length;
                          return (
                            <label
                              key={cat}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedProducts.includes(cat)}
                                onChange={() => toggleProduct(cat)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {cat} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("price")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Price</span>
                    {expandedFilters.price ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.price && (
                    <div className="space-y-3">
                      <div className="relative h-2">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>
                        <div
                          className="absolute top-0 h-2 bg-gray-400 rounded-full"
                          style={{
                            left: `${(minPrice / 10000) * 100}%`,
                            width: `${((maxPrice - minPrice) / 10000) * 100}%`,
                          }}
                        ></div>
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={minPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val <= maxPrice) setMinPrice(val);
                          }}
                          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                          style={{ background: "transparent" }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="10000"
                          value={maxPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            if (val >= minPrice) setMaxPrice(val);
                          }}
                          className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                          style={{ background: "transparent" }}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                            $
                          </span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={minPrice === 0 ? "" : minPrice.toString()}
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              if (value === "") {
                                setMinPrice(0);
                              } else {
                                const num = Number(value);
                                if (num <= maxPrice && num <= 10000) {
                                  setMinPrice(num);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setMinPrice(0);
                              }
                            }}
                            placeholder="0"
                            className="pl-7 w-full"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">-</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                            $
                          </span>
                          <Input
                            type="text"
                            inputMode="numeric"
                            value={
                              maxPrice === 10000 ? "" : maxPrice.toString()
                            }
                            onChange={(e) => {
                              const value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                              if (value === "") {
                                setMaxPrice(10000);
                              } else {
                                const num = Number(value);
                                if (num >= minPrice && num <= 10000) {
                                  setMaxPrice(num);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              if (e.target.value === "") {
                                setMaxPrice(10000);
                              }
                            }}
                            placeholder="8000"
                            className="pl-7 w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Room */}
                {filterConfig.showRoom && rooms.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("room")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Room</span>
                      {expandedFilters.room ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.room && (
                      <div className="space-y-2">
                        {rooms.map((room) => {
                          const count = products.filter(
                            (p) =>
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(room)
                          ).length;
                          return (
                            <label
                              key={room}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedRooms.includes(room)}
                                onChange={() => toggleRoom(room)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {room} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Color */}
                {filterConfig.showColor && colors.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("color")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Color</span>
                      {expandedFilters.color ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.color && (
                      <div className="space-y-2">
                        {colors.map((color) => {
                          const count = products.filter((p) => {
                            if (
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(color)
                            ) {
                              return true;
                            }
                            if ("variants" in p && p.variants?.edges) {
                              return p.variants.edges.some(({ node }) => {
                                const colorOption = node.selectedOptions?.find(
                                  (opt) => opt.name.toLowerCase() === "color"
                                );
                                return (
                                  colorOption && colorOption.value === color
                                );
                              });
                            }
                            return false;
                          }).length;
                          const colorKey = color.toLowerCase();
                          const colorValue = colorMap[colorKey] || "#808080";
                          return (
                            <label
                              key={color}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedColors.includes(color)}
                                onChange={() => toggleColor(color)}
                                className="w-4 h-4"
                              />
                              <div
                                className="w-4 h-4 rounded-full border border-border"
                                style={{ backgroundColor: colorValue }}
                              />
                              <span className="text-sm">
                                {color} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Material */}
                {filterConfig.showMaterial && materials.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("material")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Material</span>
                      {expandedFilters.material ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.material && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {materials.map((material) => {
                          const count = products.filter(
                            (p) =>
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(material)
                          ).length;
                          return (
                            <label
                              key={material}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedMaterials.includes(material)}
                                onChange={() => toggleMaterial(material)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {material} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Size (for clothing) */}
                {filterConfig.showSize && sizes.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("size")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Size</span>
                      {expandedFilters.size ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.size && (
                      <div className="space-y-2">
                        {sizes.map((size) => {
                          const count = products.filter((p) => {
                            if ("variants" in p && p.variants?.edges) {
                              return p.variants.edges.some(({ node }) => {
                                const sizeOption = node.selectedOptions?.find(
                                  (opt) => opt.name.toLowerCase() === "size"
                                );
                                return sizeOption && sizeOption.value === size;
                              });
                            }
                            if (
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(size)
                            ) {
                              return true;
                            }
                            return false;
                          }).length;
                          return (
                            <label
                              key={size}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedSizes.includes(size)}
                                onChange={() => toggleSize(size)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {size} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Type (for clothing) */}
                {filterConfig.showType && types.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("type")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Type</span>
                      {expandedFilters.type ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.type && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {types.map((type) => {
                          const count = products.filter(
                            (p) =>
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(type)
                          ).length;
                          return (
                            <label
                              key={type}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedTypes.includes(type)}
                                onChange={() => toggleType(type)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {type} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Style (for clothing) */}
                {filterConfig.showStyle && styles.length > 0 && (
                  <div className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter("style")}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>Style</span>
                      {expandedFilters.style ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters.style && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {styles.map((style) => {
                          const count = products.filter(
                            (p) =>
                              "tags" in p &&
                              Array.isArray(p.tags) &&
                              p.tags.includes(style)
                          ).length;
                          return (
                            <label
                              key={style}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selectedStyles.includes(style)}
                                onChange={() => toggleStyle(style)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {style} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Filters */}
                {filterConfig.customFilters?.map((customFilter) => (
                  <div key={customFilter.key} className="border-b pb-4">
                    <button
                      onClick={() => toggleFilter(customFilter.key)}
                      className="flex items-center justify-between w-full text-base font-medium mb-4"
                    >
                      <span>{customFilter.label}</span>
                      {expandedFilters[customFilter.key] ? (
                        <Minus className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </button>
                    {expandedFilters[customFilter.key] && (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {customFilter.options.map((option) => {
                          const count = customFilter.getCount(option);
                          return (
                            <label
                              key={option}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  customFilterStates[customFilter.key] || []
                                ).includes(option)}
                                onChange={() =>
                                  toggleCustomFilter(customFilter.key, option)
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-sm">
                                {option} ({count})
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}

                {/* Sale */}
                <div className="border-b pb-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onSale}
                        onChange={(e) => setOnSale(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">On Sale</span>
                    </label>
                  </div>
                </div>

                {/* Availability */}
                <div className="border-b pb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">In Stock</span>
                  </label>
                </div>
              </div>
            </aside>
          </>
        )}

        {/* Main Content - Product Grid */}
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Desktop Sidebar - 常に表示（モバイルでは非表示） */}
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold mb-4">Sort & Filter</h2>

              {/* Sort By */}
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleFilter("sort")}
                  className="flex items-center justify-between w-full text-base font-medium mb-4"
                >
                  <span>Sort By</span>
                  {expandedFilters.sort ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
                {expandedFilters.sort && (
                  <div className="space-y-2">
                    {(
                      [
                        "popularity",
                        "price-high",
                        "price-low",
                        "newest",
                      ] as SortOption[]
                    ).map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="sort"
                          value={option}
                          checked={sortOption === option}
                          onChange={() => handleSortChange(option)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm">
                          {option === "popularity"
                            ? "Popularity"
                            : option === "price-high"
                            ? "High - Low Price"
                            : option === "price-low"
                            ? "Low - High Price"
                            : "Newest"}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Category */}
              {filterConfig.showProduct && categories.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("product")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Product</span>
                    {expandedFilters.product ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.product && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {categories.map((cat) => {
                        const count = products.filter(
                          (p) =>
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(cat)
                        ).length;
                        return (
                          <label
                            key={cat}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(cat)}
                              onChange={() => toggleProduct(cat)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {cat} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Price */}
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleFilter("price")}
                  className="flex items-center justify-between w-full text-base font-medium mb-4"
                >
                  <span>Price</span>
                  {expandedFilters.price ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
                {expandedFilters.price && (
                  <div className="space-y-3">
                    <div className="relative h-2">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>
                      <div
                        className="absolute top-0 h-2 bg-gray-400 rounded-full"
                        style={{
                          left: `${(minPrice / 10000) * 100}%`,
                          width: `${((maxPrice - minPrice) / 10000) * 100}%`,
                        }}
                      ></div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={minPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val <= maxPrice) setMinPrice(val);
                        }}
                        className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        style={{ background: "transparent" }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={maxPrice}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (val >= minPrice) setMaxPrice(val);
                        }}
                        className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer z-20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                        style={{ background: "transparent" }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                          $
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={minPrice === 0 ? "" : minPrice.toString()}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            if (value === "") {
                              setMinPrice(0);
                            } else {
                              const num = Number(value);
                              if (num <= maxPrice && num <= 10000) {
                                setMinPrice(num);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              setMinPrice(0);
                            }
                          }}
                          placeholder="0"
                          className="pl-7 w-full"
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">-</span>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                          $
                        </span>
                        <Input
                          type="text"
                          inputMode="numeric"
                          value={maxPrice === 10000 ? "" : maxPrice.toString()}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, "");
                            if (value === "") {
                              setMaxPrice(10000);
                            } else {
                              const num = Number(value);
                              if (num >= minPrice && num <= 10000) {
                                setMaxPrice(num);
                              }
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value === "") {
                              setMaxPrice(10000);
                            }
                          }}
                          placeholder="8000"
                          className="pl-7 w-full"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Room */}
              {filterConfig.showRoom && rooms.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("room")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Room</span>
                    {expandedFilters.room ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.room && (
                    <div className="space-y-2">
                      {rooms.map((room) => {
                        const count = products.filter(
                          (p) =>
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(room)
                        ).length;
                        return (
                          <label
                            key={room}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedRooms.includes(room)}
                              onChange={() => toggleRoom(room)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {room} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Color */}
              {filterConfig.showColor && colors.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("color")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Color</span>
                    {expandedFilters.color ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.color && (
                    <div className="space-y-2">
                      {colors.map((color) => {
                        const count = products.filter((p) => {
                          if (
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(color)
                          ) {
                            return true;
                          }
                          if ("variants" in p && p.variants?.edges) {
                            return p.variants.edges.some(({ node }) => {
                              const colorOption = node.selectedOptions?.find(
                                (opt) => opt.name.toLowerCase() === "color"
                              );
                              return colorOption && colorOption.value === color;
                            });
                          }
                          return false;
                        }).length;
                        const colorKey = color.toLowerCase();
                        const colorValue = colorMap[colorKey] || "#808080";
                        return (
                          <label
                            key={color}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedColors.includes(color)}
                              onChange={() => toggleColor(color)}
                              className="w-4 h-4"
                            />
                            <div
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: colorValue }}
                            />
                            <span className="text-sm">
                              {color} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Material */}
              {filterConfig.showMaterial && materials.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("material")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Material</span>
                    {expandedFilters.material ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.material && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {materials.map((material) => {
                        const count = products.filter(
                          (p) =>
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(material)
                        ).length;
                        return (
                          <label
                            key={material}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMaterials.includes(material)}
                              onChange={() => toggleMaterial(material)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {material} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Size (for clothing) */}
              {filterConfig.showSize && sizes.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("size")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Size</span>
                    {expandedFilters.size ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.size && (
                    <div className="space-y-2">
                      {sizes.map((size) => {
                        const count = products.filter((p) => {
                          if ("variants" in p && p.variants?.edges) {
                            return p.variants.edges.some(({ node }) => {
                              const sizeOption = node.selectedOptions?.find(
                                (opt) => opt.name.toLowerCase() === "size"
                              );
                              return sizeOption && sizeOption.value === size;
                            });
                          }
                          if (
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(size)
                          ) {
                            return true;
                          }
                          return false;
                        }).length;
                        return (
                          <label
                            key={size}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedSizes.includes(size)}
                              onChange={() => toggleSize(size)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {size} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Type (for clothing) */}
              {filterConfig.showType && types.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("type")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Type</span>
                    {expandedFilters.type ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.type && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {types.map((type) => {
                        const count = products.filter(
                          (p) =>
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(type)
                        ).length;
                        return (
                          <label
                            key={type}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(type)}
                              onChange={() => toggleType(type)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {type} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Style (for clothing) */}
              {filterConfig.showStyle && styles.length > 0 && (
                <div className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter("style")}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>Style</span>
                    {expandedFilters.style ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters.style && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {styles.map((style) => {
                        const count = products.filter(
                          (p) =>
                            "tags" in p &&
                            Array.isArray(p.tags) &&
                            p.tags.includes(style)
                        ).length;
                        return (
                          <label
                            key={style}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedStyles.includes(style)}
                              onChange={() => toggleStyle(style)}
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {style} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Filters */}
              {filterConfig.customFilters?.map((customFilter) => (
                <div key={customFilter.key} className="border-b pb-4">
                  <button
                    onClick={() => toggleFilter(customFilter.key)}
                    className="flex items-center justify-between w-full text-base font-medium mb-4"
                  >
                    <span>{customFilter.label}</span>
                    {expandedFilters[customFilter.key] ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                  {expandedFilters[customFilter.key] && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customFilter.options.map((option) => {
                        const count = customFilter.getCount(option);
                        return (
                          <label
                            key={option}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={(
                                customFilterStates[customFilter.key] || []
                              ).includes(option)}
                              onChange={() =>
                                toggleCustomFilter(customFilter.key, option)
                              }
                              className="w-4 h-4"
                            />
                            <span className="text-sm">
                              {option} ({count})
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Sale */}
              <div className="border-b pb-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onSale}
                      onChange={(e) => setOnSale(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">On Sale</span>
                  </label>
                </div>
              </div>

              {/* Availability */}
              <div className="border-b pb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStock}
                    onChange={(e) => setInStock(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">In Stock</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content - Product Grid */}
          <main className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(1, prev - 1));
                  }}
                  disabled={currentPage === 1}
                  className="h-10 w-10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      if (totalPages > 7) {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => {
                                setCurrentPage(page);
                              }}
                              className="h-10 w-10"
                            >
                              {page}
                            </Button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span
                              key={page}
                              className="px-2 text-muted-foreground"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="h-10 w-10"
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                  }}
                  disabled={currentPage === totalPages}
                  className="h-10 w-10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
