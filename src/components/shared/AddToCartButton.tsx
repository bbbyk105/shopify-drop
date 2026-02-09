"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { useCartAddedDrawer, type RelatedProductItem } from "@/hooks/useCartAddedDrawer";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  variantId: string;
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  productName?: string;
  productImage?: string;
  /** Variant display name for cart drawer e.g. "Basket, White, 25x26x18 cm" */
  variantTitle?: string;
  /** Unit price; required to show the cart added drawer */
  price?: number;
   /** Compare at price (original price) for showing savings in cart drawer */
  compareAtPrice?: number | null;
  /** Related products to show in the drawer (e.g. from product page) */
  relatedProducts?: RelatedProductItem[];
  /** When false, button is disabled and add to cart is skipped */
  availableForSale?: boolean;
  /** When true, only render children in default state (no cart icon + text); for icon-only buttons */
  iconOnly?: boolean;
  /** When false, do not open the cart drawer on add (e.g. when adding from inside the drawer); show toast only */
  openDrawerOnAdd?: boolean;
}

export default function AddToCartButton({
  variantId,
  quantity = 1,
  className,
  children,
  productName,
  productImage,
  variantTitle,
  price,
  compareAtPrice = null,
  relatedProducts = [],
  availableForSale = true,
  iconOnly = false,
  openDrawerOnAdd = true,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const add = useCart((state) => state.add);
  const openDrawer = useCartAddedDrawer((s) => s.open);
  const { toast } = useToast();

  const showDrawer =
    openDrawerOnAdd &&
    productName &&
    productImage &&
    price !== undefined &&
    price !== null;

  const handleAddToCart = async () => {
    if (!availableForSale) return;
    if (isAdding || justAdded) return;

    setIsAdding(true);
    const result = await add(variantId, quantity);
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error || "This item may have just sold out. Please reselect options.",
        productImage,
        productName,
      });
      setIsAdding(false);
      return;
    }
    setJustAdded(true);
    if (showDrawer) {
      openDrawer({
        product: {
          productName,
          productImage,
          variantTitle,
          price,
          compareAtPrice,
        },
        relatedProducts,
      });
    } else {
      toast({
        variant: "success",
        title: "Added to Cart",
        description: productName || "Item added to cart",
        productImage,
        productName,
      });
    }
    setTimeout(() => setJustAdded(false), 2000);
    setIsAdding(false);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={!availableForSale || isAdding || justAdded}
      className={className}
    >
      {isAdding ? (
        iconOnly ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden />
        ) : (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          Adding...
        </>
        )
      ) : justAdded ? (
        iconOnly ? (
          <Check className="h-5 w-5" aria-hidden />
        ) : (
        <>
          <Check className="w-5 h-5 mr-2" />
          Added to Cart!
        </>
        )
      ) : iconOnly ? (
        children
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          {children || "Add to Cart"}
        </>
      )}
    </Button>
  );
}
