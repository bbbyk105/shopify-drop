"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { products } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Product = ShopifyProduct | typeof products[0];

export default function FavoriteClient() {
  const { favorites, remove, clear } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // APIルート経由で商品を取得
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: favorites }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch favorite products");
        }

        const data = await response.json();
        setFavoriteProducts(data.products || []);
      } catch (error) {
        console.error("Error loading favorite products:", error);
        setFavoriteProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavoriteProducts();
  }, [favorites]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">Loading favorites...</div>
      </div>
    );
  }

  if (favorites.length === 0 || favoriteProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl font-bold">Your favorites is empty</h1>
          <p className="text-muted-foreground">
            Add some products to your favorites to see them here!
          </p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteProducts.length}{" "}
            {favoriteProducts.length === 1 ? "item" : "items"}
          </p>
        </div>
        {favorites.length > 0 && (
          <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="outline">Clear All</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Favorites?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove all items from your favorites?
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    clear();
                    setClearDialogOpen(false);
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => {
          const isShopifyProduct = "handle" in product;
          const productId = isShopifyProduct
            ? product.id
            : `local-${product.slug}`;
          const slug = isShopifyProduct ? product.handle : product.slug;
          const title = isShopifyProduct ? product.title : product.name;
          const image = isShopifyProduct
            ? product.featuredImage?.url ||
              product.images.edges[0]?.node.url ||
              "/placeholder.png"
            : product.image;
          const price = isShopifyProduct
            ? parseFloat(product.priceRange.minVariantPrice.amount)
            : product.price;
          const realCompareAtPrice = isShopifyProduct
            ? (product as ShopifyProduct).compareAtPriceRange?.minVariantPrice
              ? parseFloat(
                  (product as ShopifyProduct).compareAtPriceRange!
                    .minVariantPrice.amount
                )
              : null
            : null;
          const realIsOnSale =
            realCompareAtPrice != null &&
            realCompareAtPrice > 0 &&
            realCompareAtPrice > price;
          const compareAtPrice = realIsOnSale ? realCompareAtPrice : null;
          const isOnSale =
            compareAtPrice != null && compareAtPrice > price && realIsOnSale;
          const discountPercent =
            isOnSale && compareAtPrice
              ? Math.round((1 - price / compareAtPrice) * 100)
              : 0;

          return (
            <div
              key={productId}
              className="group relative border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow"
            >
              <Link href={`/products/${slug}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-secondary/30">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* ホバー時の暗いオーバーレイ */}
                  <div className="absolute inset-0 bg-black/20 transition-opacity duration-300 group-hover:opacity-100 opacity-0" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                  </h3>
                  <div className="flex flex-wrap items-baseline gap-x-1">
                    {isOnSale ? (
                      <>
                        <span className="text-base text-gray-400 line-through font-normal">
                          {formatPrice(compareAtPrice!)}
                        </span>
                        <span className="text-lg font-semibold text-red-600">
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
                      <p className="text-lg font-bold">
                        {formatPrice(price)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
              <AlertDialog
                open={deleteDialogOpen === productId}
                onOpenChange={(open) =>
                  setDeleteDialogOpen(open ? productId : null)
                }
              >
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to remove{" "}
                      <strong>{title}</strong> from your favorites? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-center my-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-secondary">
                      <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        remove(productId);
                        setDeleteDialogOpen(null);
                      }}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Remove
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          );
        })}
      </div>
    </div>
  );
}
