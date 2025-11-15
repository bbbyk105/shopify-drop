"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function AddToCartButton({
  variantId,
  quantity = 1,
  className,
  children,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const add = useCart((state) => state.add);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await add(variantId, quantity);
      setJustAdded(true);

      // 2秒後に「Added」状態をリセット
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding || justAdded}
      className={className}
    >
      {isAdding ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Adding...
        </>
      ) : justAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          {children || "Add to Cart"}
        </>
      )}
    </Button>
  );
}
