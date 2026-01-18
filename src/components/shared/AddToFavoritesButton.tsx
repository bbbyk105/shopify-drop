"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
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

interface AddToFavoritesButtonProps {
  productId: string;
  productName?: string;
  productImage?: string;
  variant?: "icon" | "button";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function AddToFavoritesButton({
  productId,
  productName,
  productImage,
  variant = "icon",
  className,
  size = "md",
}: AddToFavoritesButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // ハイドレーションエラーを防ぐため、マウント後に状態を更新
  useEffect(() => {
    setMounted(true);
  }, []);

  const favorite = mounted ? isFavorite(productId) : false;

  const handleAddToFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggle(productId);

    toast({
      variant: "success",
      title: "Added to Favorites",
      description: productName || "Item added to favorites",
      productImage,
      productName,
    });

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleRemoveFromFavorites = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsAnimating(true);
    toggle(productId);
    setOpen(false);

    toast({
      variant: "default",
      title: "Removed from Favorites",
      description: productName || "Item removed from favorites",
      productImage,
      productName,
    });

    setTimeout(() => setIsAnimating(false), 300);
  };

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  if (variant === "icon") {
    if (favorite) {
      return (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Remove from favorites"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                sizeClasses[size],
                "text-red-500",
                isAnimating && "scale-125",
                className
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all",
                  "fill-current"
                )}
              />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove{" "}
                <strong>{productName || "this item"}</strong> from your favorites?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            {productImage && (
              <div className="flex justify-center my-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-secondary">
                  <Image
                    src={productImage}
                    alt={productName || "Product"}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleRemoveFromFavorites}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }

    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleAddToFavorites}
        aria-label="Add to favorites"
        className={cn(
          sizeClasses[size],
          isAnimating && "scale-125",
          className
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            "fill-none"
          )}
        />
      </Button>
    );
  }

  // Button variant
  if (favorite) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={cn(
              "border-red-500 text-red-500",
              isAnimating && "scale-105",
              className
            )}
          >
            <Heart
              className={cn(
                "mr-2 h-4 w-4 transition-all",
                "fill-current"
              )}
            />
            Remove from Favorites
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove from Favorites?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <strong>{productName || "this item"}</strong> from your favorites?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {productImage && (
            <div className="flex justify-center my-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-secondary">
                <Image
                  src={productImage}
                  alt={productName || "Product"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveFromFavorites}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleAddToFavorites}
      className={cn(
        isAnimating && "scale-105",
        className
      )}
    >
      <Heart
        className={cn(
          "mr-2 h-4 w-4 transition-all",
          "fill-none"
        )}
      />
      Add to Favorites
    </Button>
  );
}
