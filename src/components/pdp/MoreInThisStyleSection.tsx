"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice, getFakeDiscountPercent } from "@/lib/utils";
import type { Product } from "@/lib/shopify/types";

const MAX_ITEMS = 8;
const RELEVANT_TAGS = [
  "living-room",
  "livingroom",
  "bedroom",
  "sofa",
  "rug",
  "lighting",
  "side-table",
  "dining-room-kitchen",
  "home-office",
  "entryway",
  "outdoor",
];

function isRelevant(product: Product): boolean {
  const tags = product.tags.map((t) => t.toLowerCase().trim());
  return RELEVANT_TAGS.some((tag) =>
    tags.some((t) => t.includes(tag) || tag.includes(t))
  );
}

interface MoreInThisStyleSectionProps {
  relatedProducts: Product[];
  /** Exclude this product ID from the list */
  currentProductId?: string;
}

export default function MoreInThisStyleSection({
  relatedProducts,
  currentProductId,
}: MoreInThisStyleSectionProps) {
  const filtered = relatedProducts
    .filter((p) => p.id !== currentProductId && isRelevant(p))
    .slice(0, MAX_ITEMS);

  if (filtered.length === 0) return null;

  return (
    <section
      className="py-12 md:py-16 px-4"
      aria-labelledby="more-in-this-style-heading"
    >
      <div className="container mx-auto max-w-6xl">
        <h2
          id="more-in-this-style-heading"
          className="text-xl md:text-2xl font-medium text-foreground tracking-tight mb-8 md:mb-10"
        >
          More in this style
        </h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
          {filtered.map((product) => {
            const price = parseFloat(
              product.priceRange.minVariantPrice.amount
            );
            const realCompareAtPrice =
              product.compareAtPriceRange?.minVariantPrice
                ? parseFloat(
                    product.compareAtPriceRange.minVariantPrice.amount
                  )
                : null;
            const realIsOnSale =
              realCompareAtPrice != null &&
              realCompareAtPrice > 0 &&
              realCompareAtPrice > price;
            const fakePercent = getFakeDiscountPercent(product.id);
            const compareAtPrice = realIsOnSale
              ? realCompareAtPrice
              : fakePercent != null
                ? Math.round((price / (1 - fakePercent / 100)) * 100) / 100
                : null;
            const isOnSale =
              (compareAtPrice != null && compareAtPrice > price) ||
              realIsOnSale;
            const discountPercent =
              isOnSale && compareAtPrice
                ? realIsOnSale
                  ? Math.round((1 - price / compareAtPrice) * 100)
                  : (fakePercent ?? 0)
                : 0;
            const imageUrl =
              product.featuredImage?.url ||
              product.images.edges[0]?.node.url ||
              "/placeholder.png";

            return (
              <li key={product.id}>
                <Link
                  href={`/products/${product.handle}`}
                  className="group block"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-secondary/30 mb-3">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      className="object-cover transition-opacity duration-200 group-hover:opacity-92"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                  <p className="text-sm font-medium text-foreground group-hover:underline">
                    {product.title}
                  </p>
                  <div className="text-sm mt-0.5 flex flex-wrap items-baseline gap-x-1">
                    {isOnSale ? (
                      <>
                        <span className="text-gray-400 line-through font-normal">
                          {formatPrice(compareAtPrice!)}
                        </span>
                        <span className="font-semibold text-red-600">
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
                      <span className="text-sm text-muted-foreground">
                        {formatPrice(price)}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
