"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";
import { formatPrice } from "@/lib/utils";

type Product = ShopifyProduct | LocalProduct;

interface ProductsClientProps {
  products: Product[];
}

type SortOption = "popularity" | "price-high" | "price-low" | "newest";

const ITEMS_PER_LOAD = 20;

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

export default function ProductsClient({ products }: ProductsClientProps) {
  const [sortOption, setSortOption] = useState<SortOption>("popularity");
  const [showCount, setShowCount] = useState(ITEMS_PER_LOAD);
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({
    sort: true,
    product: true,
    price: true,
    room: true,
    color: true,
    material: true,
  });

  // フィルター状態
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [contractGrade, setContractGrade] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [clearanceSale, setClearanceSale] = useState(false);
  const [inStock, setInStock] = useState(true);

  // 商品からカテゴリー、ルーム、カラー、マテリアルを抽出
  const categories = useMemo(() => {
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
            !lower.includes("bestseller")
          ) {
            cats.add(tag);
          }
        });
      }
    });
    return Array.from(cats).sort();
  }, [products]);

  const rooms = useMemo(() => {
    const roomSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (lower.includes("room") || lower.includes("bedroom") || lower.includes("living")) {
            roomSet.add(tag);
          }
        });
      }
    });
    return Array.from(roomSet).sort();
  }, [products]);

  const colors = useMemo(() => {
    const colorSet = new Set<string>();
    products.forEach((product) => {
      if ("tags" in product && Array.isArray(product.tags)) {
        product.tags.forEach((tag) => {
          const lower = tag.toLowerCase();
          if (
            ["white", "black", "gray", "grey", "brown", "red", "blue", "green", "yellow", "beige", "tan", "navy", "cream"].includes(lower)
          ) {
            colorSet.add(tag);
          }
        });
      }
    });
    return Array.from(colorSet).sort();
  }, [products]);

  const materials = useMemo(() => {
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
            lower.includes("glass")
          ) {
            materialSet.add(tag);
          }
        });
      }
    });
    return Array.from(materialSet).sort();
  }, [products]);

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
          return selectedColors.some((color) => product.tags.includes(color));
        }
        return false;
      });
    }

    // マテリアルフィルター
    if (selectedMaterials.length > 0) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          return selectedMaterials.some((material) => product.tags.includes(material));
        }
        return false;
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
    if (onSale || clearanceSale) {
      filtered = filtered.filter((product) => {
        if ("tags" in product && Array.isArray(product.tags)) {
          const tags = product.tags.map((t) => t.toLowerCase());
          if (onSale && tags.some((t) => t.includes("sale"))) return true;
          if (clearanceSale && tags.some((t) => t.includes("clearance"))) return true;
          return false;
        }
        return false;
      });
    }

    // 在庫フィルター
    if (inStock) {
      filtered = filtered.filter((product) => product.availableForSale !== false);
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
        return filtered; // 既に新しい順で取得されている想定
      case "popularity":
      default:
        return filtered; // デフォルトは人気順（現状の順序を維持）
    }
  }, [
    products,
    sortOption,
    selectedProducts,
    selectedRooms,
    selectedColors,
    selectedMaterials,
    minPrice,
    maxPrice,
    onSale,
    clearanceSale,
    inStock,
  ]);

  const displayedProducts = filteredAndSortedProducts.slice(0, showCount);
  const hasMore = showCount < filteredAndSortedProducts.length;

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
  };

  const toggleRoom = (room: string) => {
    setSelectedRooms((prev) =>
      prev.includes(room) ? prev.filter((r) => r !== room) : [...prev, room]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Left Sidebar - Filters */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="space-y-6">
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
                    {(["popularity", "price-high", "price-low", "newest"] as SortOption[]).map(
                      (option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="sort"
                            value={option}
                            checked={sortOption === option}
                            onChange={() => setSortOption(option)}
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
                      )
                    )}
                  </div>
                )}
              </div>

              {/* Product */}
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
                      const count = products.filter((p) =>
                        "tags" in p && Array.isArray(p.tags) && p.tags.includes(cat)
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
                    {/* Range Slider */}
                    <div className="relative h-2">
                      {/* Background Track */}
                      <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-full"></div>
                      {/* Active Range */}
                      <div
                        className="absolute top-0 h-2 bg-gray-400 rounded-full"
                        style={{
                          left: `${(minPrice / 10000) * 100}%`,
                          width: `${((maxPrice - minPrice) / 10000) * 100}%`,
                        }}
                      ></div>
                      {/* Min Handle */}
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
                        style={{
                          background: "transparent",
                        }}
                      />
                      {/* Max Handle */}
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
                        style={{
                          background: "transparent",
                        }}
                      />
                    </div>
                    {/* Price Input Fields */}
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
                      const count = products.filter((p) =>
                        "tags" in p && Array.isArray(p.tags) && p.tags.includes(room)
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

              {/* Color */}
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
                      const count = products.filter((p) =>
                        "tags" in p && Array.isArray(p.tags) && p.tags.includes(color)
                      ).length;
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

              {/* Material */}
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
                      const count = products.filter((p) =>
                        "tags" in p && Array.isArray(p.tags) && p.tags.includes(material)
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

              {/* Contract Grade */}
              <div className="border-b pb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contractGrade}
                    onChange={(e) => setContractGrade(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Contract Grade</span>
                </label>
              </div>

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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={clearanceSale}
                      onChange={(e) => setClearanceSale(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Clearance Sale</span>
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
            <h1 className="text-3xl font-bold">All Products</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => {
                const isShopifyProduct = "handle" in product;
                const price = isShopifyProduct
                  ? parseFloat(product.priceRange.minVariantPrice.amount)
                  : product.price;
                const compareAtPrice = isShopifyProduct
                  ? product.compareAtPriceRange?.minVariantPrice
                    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                    : null
                  : null;
                const hasSale = compareAtPrice && compareAtPrice > price;
                const image = isShopifyProduct
                  ? product.featuredImage?.url ||
                    product.images.edges[0]?.node.url ||
                    "/placeholder.png"
                  : product.image;
                const title = isShopifyProduct ? product.title : product.name;
                const slug = isShopifyProduct ? product.handle : product.slug;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${slug}`}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 mb-3">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {hasSale && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          SALE
                        </div>
                      )}
                      {/* カラースウォッチ */}
                      {isShopifyProduct && product.variants.edges.length > 0 && (
                        <div className="absolute bottom-2 left-2 flex gap-1">
                          {product.variants.edges.slice(0, 3).map(({ node }) => {
                            const colorOption = node.selectedOptions.find(
                              (opt) => opt.name.toLowerCase() === "color"
                            );
                            if (colorOption) {
                              const colorKey = colorOption.value.toLowerCase();
                              const colorValue = colorMap[colorKey] || "#808080";
                              return (
                                <div
                                  key={node.id}
                                  className="w-4 h-4 rounded-full border border-white shadow-sm"
                                  style={{ backgroundColor: colorValue }}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      )}
                    </div>
                    <h3 className="text-base font-medium mb-1 group-hover:text-primary transition-colors">
                      {title}
                    </h3>
                    <p className="text-base font-bold">{formatPrice(price)}</p>
                  </Link>
                );
              })}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-4">
                  Showing {displayedProducts.length} of {filteredAndSortedProducts.length}
                </p>
                <Button
                  onClick={() => setShowCount((prev) => prev + ITEMS_PER_LOAD)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-2"
                >
                  SEE MORE
                </Button>
              </div>
            )}

            {/* Info Section */}
            <div className="border-t pt-12 mt-12">
              <h2 className="text-2xl font-bold mb-4">
                Browse all of Evimeria&apos;s Contemporary, Mid Century & Modern Furniture.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Discover our curated collection of contemporary, mid-century, and modern furniture
                designed to transform your living spaces. Each piece is carefully selected for its
                quality, style, and functionality.
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
