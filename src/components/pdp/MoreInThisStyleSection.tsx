"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
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
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {formatPrice(price)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
