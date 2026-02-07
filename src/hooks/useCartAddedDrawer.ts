"use client";

import { create } from "zustand";

export type RelatedProductItem = {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  price: number;
  variantId: string;
  /** Display detail e.g. "Basket, 27x42x23 cm" */
  variantTitle?: string;
};

export type CartAddedDrawerProduct = {
  productName: string;
  productImage: string;
  variantTitle?: string;
  price: number;
};

type CartAddedDrawerState = {
  isOpen: boolean;
  product: CartAddedDrawerProduct | null;
  relatedProducts: RelatedProductItem[];
  open: (payload: {
    product: CartAddedDrawerProduct;
    relatedProducts?: RelatedProductItem[];
  }) => void;
  close: () => void;
};

export const useCartAddedDrawer = create<CartAddedDrawerState>((set) => ({
  isOpen: false,
  product: null,
  relatedProducts: [],
  open: (payload) =>
    set({
      isOpen: true,
      product: payload.product,
      relatedProducts: payload.relatedProducts ?? [],
    }),
  close: () =>
    set({ isOpen: false, product: null, relatedProducts: [] }),
}));
