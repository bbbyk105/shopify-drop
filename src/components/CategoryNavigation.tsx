"use client";

import Link from "next/link";
import Image from "next/image";

interface CategoryItem {
  name: string;
  href: string;
  image: string;
}

interface CategoryNavigationProps {
  currentCategory?: string;
}

const allCategories: CategoryItem[] = [
  {
    name: "All Products",
    href: "/products",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "New Arrivals",
    href: "/new-arrivals",
    image: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Lighting",
    href: "/lighting",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Clothing",
    href: "/clothing",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Living Room",
    href: "/rooms/living-room",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Bedroom",
    href: "/rooms/bedroom",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Dining Room",
    href: "/rooms/dining-room-kitchen",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Home Office",
    href: "/rooms/home-office",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Entryway",
    href: "/rooms/entryway",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80",
  },
  {
    name: "Outdoor",
    href: "/rooms/outdoor",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=400&fit=crop&q=80",
  },
];

// 関連カテゴリーのマッピング
const getRelatedCategories = (currentCategory?: string): CategoryItem[] => {
  if (!currentCategory) {
    // デフォルト: メインカテゴリーのみ
    return allCategories.filter(
      (cat) =>
        cat.href === "/products" ||
        cat.href === "/new-arrivals" ||
        cat.href === "/lighting" ||
        cat.href === "/clothing"
    );
  }

  // 現在のカテゴリーに基づいて関連カテゴリーを返す
  if (currentCategory === "/products") {
    return allCategories.filter(
      (cat) =>
        cat.href === "/products" ||
        cat.href === "/new-arrivals" ||
        cat.href === "/lighting" ||
        cat.href === "/clothing"
    );
  }

  if (currentCategory === "/new-arrivals") {
    return allCategories.filter(
      (cat) =>
        cat.href === "/products" ||
        cat.href === "/new-arrivals" ||
        cat.href === "/lighting" ||
        cat.href === "/clothing"
    );
  }

  if (currentCategory === "/lighting") {
    return allCategories.filter(
      (cat) =>
        cat.href === "/products" ||
        cat.href === "/new-arrivals" ||
        cat.href === "/lighting"
    );
  }

  if (currentCategory === "/clothing") {
    return allCategories.filter(
      (cat) =>
        cat.href === "/products" ||
        cat.href === "/new-arrivals" ||
        cat.href === "/clothing"
    );
  }

  // ルームページの場合
  if (currentCategory.startsWith("/rooms/")) {
    const roomCategories = allCategories.filter((cat) =>
      cat.href.startsWith("/rooms/")
    );
    // 現在のルーム + 他のルーム + メインカテゴリー
    return [
      allCategories.find((cat) => cat.href === "/products")!,
      allCategories.find((cat) => cat.href === "/new-arrivals")!,
      ...roomCategories,
    ].filter(Boolean) as CategoryItem[];
  }

  // デフォルト: メインカテゴリーのみ
  return allCategories.filter(
    (cat) =>
      cat.href === "/products" ||
      cat.href === "/new-arrivals" ||
      cat.href === "/lighting" ||
      cat.href === "/clothing"
  );
};

export default function CategoryNavigation({
  currentCategory,
}: CategoryNavigationProps) {
  const relatedCategories = getRelatedCategories(currentCategory);

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {relatedCategories.map((category) => {
          const isActive = currentCategory === category.href;
          return (
            <Link
              key={category.href}
              href={category.href}
              className={`group relative shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden transition-all ${
                isActive
                  ? "ring-2 ring-primary shadow-lg"
                  : "hover:shadow-md"
              }`}
            >
              <div className="relative w-full h-full bg-secondary/30">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 128px, 160px"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <span
                    className={`text-sm md:text-base font-semibold text-white ${
                      isActive ? "underline" : ""
                    }`}
                  >
                    {category.name}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
