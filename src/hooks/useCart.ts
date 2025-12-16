"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart } from "@/lib/shopify/types";
import {
  createCart,
  addLines,
  updateLineQty,
  removeLines,
} from "@/lib/shopify/mutations/cart";
import { getCart } from "@/lib/shopify/queries/cart";

type CartState = {
  cartId?: string;
  cart?: Cart;
  loading: boolean;
  init: () => Promise<void>;
  add: (variantId: string, quantity?: number) => Promise<void>;
  setQty: (lineId: string, qty: number) => Promise<void>;
  remove: (lineId: string) => Promise<void>;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: undefined,
      cart: undefined,
      loading: false,

      // カート初期化
      init: async () => {
        const { cartId } = get();

        if (cartId) {
          set({ loading: true });
          try {
            const data = await getCart(cartId);
            set({ cartId, cart: data.cart, loading: false });
          } catch (error) {
            console.error("Error loading cart:", error);
            // カートが見つからない場合は新規作成
            const data = await createCart();
            set({
              cartId: data.cartCreate.cart.id,
              cart: data.cartCreate.cart,
              loading: false,
            });
          }
          return;
        }

        // カートIDがない場合は新規作成
        set({ loading: true });
        const data = await createCart();
        set({
          cartId: data.cartCreate.cart.id,
          cart: data.cartCreate.cart,
          loading: false,
        });
      },

      // カートに商品追加
      add: async (variantId: string, quantity = 1) => {
        const { cartId, init } = get();

        if (!cartId) {
          await init();
        }

        const currentCartId = get().cartId;
        if (!currentCartId) {
          throw new Error("Cart not initialized");
        }

        set({ loading: true });
        try {
          const data = await addLines(currentCartId, [
            { merchandiseId: variantId, quantity },
          ]);
          set({ cart: data.cartLinesAdd.cart, loading: false });
        } catch (error) {
          console.error("Error adding to cart:", error);
          set({ loading: false });
          throw error;
        }
      },

      // 数量変更
      setQty: async (lineId: string, qty: number) => {
        const { cartId, cart } = get();
        if (!cartId || !cart) return;

        // 楽観的更新: 先にローカル反映し体感速度を上げる
        const previousCart = cart;
        const optimisticCart: Cart = {
          ...cart,
          lines: {
            ...cart.lines,
            edges: cart.lines.edges.map((edge) =>
              edge.node.id === lineId
                ? {
                    ...edge,
                    node: {
                      ...edge.node,
                      quantity: qty,
                      cost: {
                        ...edge.node.cost,
                        totalAmount: {
                          ...edge.node.cost.totalAmount,
                          amount: (
                            qty * parseFloat(edge.node.merchandise.price.amount)
                          ).toString(),
                        },
                      },
                    },
                  }
                : edge
            ),
          },
          totalQuantity:
            cart.totalQuantity -
            (cart.lines.edges.find((e) => e.node.id === lineId)?.node.quantity ||
              0) +
            qty,
        };

        set({ cart: optimisticCart });

        try {
          const data = await updateLineQty(cartId, lineId, qty);
          set({ cart: data.cartLinesUpdate.cart });
        } catch (error) {
          console.error("Error updating quantity:", error);
          // 失敗時は元に戻す
          set({ cart: previousCart });
          throw error;
        }
      },

      // 商品削除
      remove: async (lineId: string) => {
        const { cartId } = get();
        if (!cartId) return;

        set({ loading: true });
        try {
          const data = await removeLines(cartId, [lineId]);
          set({ cart: data.cartLinesRemove.cart, loading: false });
        } catch (error) {
          console.error("Error removing from cart:", error);
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: "shopify-cart",
      // cartIdのみをlocalStorageに保存
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);
