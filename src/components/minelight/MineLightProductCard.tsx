import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/shopify/types";

interface MineLightProductCardProps {
  product: Product;
}

export default function MineLightProductCard({
  product,
}: MineLightProductCardProps) {
  const firstVariant = product.variants.edges[0]?.node;
  const price = parseFloat(firstVariant?.price.amount || "0").toFixed(2);
  const compareAtPrice = firstVariant?.compareAtPrice
    ? parseFloat(firstVariant.compareAtPrice.amount).toFixed(2)
    : null;

  const isOnSale =
    compareAtPrice && parseFloat(compareAtPrice) > parseFloat(price);

  return (
    <Link
      href={`/minelight/products/${product.handle}`}
      className="group block bg-[#4A4A4A] border-8 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition-all"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-[#3A3A3A] border-b-4 border-black overflow-hidden">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.title}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Sale Badge */}
        {isOnSale && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 font-bold text-sm border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            SALE!
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-[#5CB85C] text-white px-6 py-3 font-bold border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            VIEW PRODUCT
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <h3 className="text-xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-minecraft line-clamp-2">
          {product.title.toUpperCase()}
        </h3>

        <div className="flex items-center gap-3">
          {isOnSale && (
            <span className="text-lg text-red-400 line-through">
              ${compareAtPrice}
            </span>
          )}
          <span className="text-2xl font-bold text-yellow-400 drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
            ${price}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-[#5CB85C] text-white text-xs px-2 py-1 font-bold border-2 border-black uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
