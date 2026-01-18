"use client";

import Image from "next/image";
import Link from "next/link";
import { Product as LocalProduct } from "@/types";
import { Product as ShopifyProduct } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: LocalProduct | ShopifyProduct;
  variant?: "default" | "titleOnly";
}

export default function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // ローカル商品とShopify商品の両方に対応
  const isShopifyProduct = "handle" in product;

  const slug = isShopifyProduct ? product.handle : product.slug;
  const title = isShopifyProduct ? product.title : product.name;
  const description = isShopifyProduct
    ? product.description
    : product.description;
  const image = isShopifyProduct
    ? product.featuredImage?.url ||
      product.images.edges[0]?.node.url ||
      "/placeholder.png"
    : product.image;
  const price = isShopifyProduct
    ? parseFloat(product.priceRange.minVariantPrice.amount)
    : product.price;

  const isTitleOnly = variant === "titleOnly";

  return (
    <Link href={`/products/${slug}`} className="block group h-full">
      <div
        className="cursor-pointer h-full flex flex-col transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/30 mb-3 shadow-sm group-hover:shadow-md transition-all">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className={`absolute inset-0 bg-black/10 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="flex flex-col flex-1 space-y-1.5">
          <h3 className="text-base md:text-lg font-semibold group-hover:text-primary transition-colors leading-tight line-clamp-2">
            {title}
          </h3>
          {!isTitleOnly && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 flex-1">
              {description}
            </p>
          )}
          {price && price > 0 && (
            <p className="text-base md:text-lg font-bold mt-auto">{formatPrice(price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
