"use client";

import Image from "next/image";
import Link from "next/link";
import { Product as LocalProduct } from "@/types";
import { Product as ShopifyProduct } from "@/lib/shopify/types";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  product: LocalProduct | ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
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

  return (
    <Link href={`/products/${slug}`} className="block group">
      <div
        className="cursor-pointer space-y-4 transition-all"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/30 mb-4 shadow-lg group-hover:shadow-xl transition-all">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-primary transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-2 leading-relaxed line-clamp-2">
            {description}
          </p>
          <p className="text-lg md:text-xl font-bold">{formatPrice(price)}</p>
        </div>
      </div>
    </Link>
  );
}
