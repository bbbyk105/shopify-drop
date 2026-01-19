"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  // ハイドレーションエラーを防ぐため、マウント後に状態を更新
  useEffect(() => {
    setMounted(true);
  }, []);

  const favorite = mounted ? isFavorite(productId) : false;

  const handleToggleFavorites = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const wasFavorite = mounted ? isFavorite(productId) : false;
    setIsAnimating(true);
    toggle(productId);

    toast({
      variant: wasFavorite ? "default" : "success",
      title: wasFavorite ? "Removed from Favorites" : "Added to Favorites",
      description: productName
        ? wasFavorite
          ? `${productName} removed from favorites`
          : `${productName} added to favorites`
        : wasFavorite
        ? "Item removed from favorites"
        : "Item added to favorites",
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
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleFavorites}
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        className={cn(
          sizeClasses[size],
          favorite && "text-red-500",
          isAnimating && "scale-125",
          className
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-all",
            favorite ? "fill-current" : "fill-none"
          )}
        />
      </Button>
    );
  }

  // Button variant
  return (
    <Button
      variant="outline"
      onClick={handleToggleFavorites}
      className={cn(
        favorite && "border-red-500 text-red-500",
        isAnimating && "scale-105",
        className
      )}
    >
      <Heart
        className={cn(
          "mr-2 h-4 w-4 transition-all",
          favorite ? "fill-current" : "fill-none"
        )}
      />
      {favorite ? "Remove from Favorites" : "Add to Favorites"}
    </Button>
  );
}
