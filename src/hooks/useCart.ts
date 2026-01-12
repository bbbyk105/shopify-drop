"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Cart } from "@/lib/shopify/types";

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
            // APIルート経由で取得
            const response = await fetch(`/api/shopify/cart?cartId=${cartId}`);
            if (!response.ok) throw new Error("Cart not found");
            const data = await response.json();
            set({ cartId, cart: data.cart, loading: false });
          } catch (error) {
            console.error("Error loading cart:", error);
            // カートが見つからない場合は新規作成
            const response = await fetch("/api/shopify/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "create" }),
            });
            if (!response.ok) throw new Error("Failed to create cart");
            const data = await response.json();
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
        try {
          const response = await fetch("/api/shopify/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "create" }),
          });
          if (!response.ok) throw new Error("Failed to create cart");
          const data = await response.json();
          set({
            cartId: data.cartCreate.cart.id,
            cart: data.cartCreate.cart,
            loading: false,
          });
        } catch (error) {
          console.error("Error creating cart:", error);
          set({ loading: false });
          throw error;
        }
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
          const response = await fetch("/api/shopify/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "add",
              cartId: currentCartId,
              lines: [{ merchandiseId: variantId, quantity }],
            }),
          });
          if (!response.ok) throw new Error("Failed to add to cart");
          const data = await response.json();
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

        // 楽観的更新: 価格も即座に計算して表示
        const previousCart = cart;
        const oldLine = cart.lines.edges.find((e) => e.node.id === lineId);
        const oldQuantity = oldLine?.node.quantity || 0;
        const pricePerUnit = oldLine
          ? parseFloat(oldLine.node.merchandise.price.amount)
          : 0;
        const oldLineTotal = oldLine
          ? parseFloat(oldLine.node.cost.totalAmount.amount)
          : 0;
        const newLineTotal = qty * pricePerUnit;
        const lineTotalDiff = newLineTotal - oldLineTotal;

        // 更新されたラインアイテム
        const updatedEdges = cart.lines.edges.map((edge) =>
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
                      amount: newLineTotal.toFixed(2),
                    },
                  },
                },
              }
            : edge
        );

        // カート全体のSubtotalとTotalを計算
        const currentSubtotal = parseFloat(cart.cost.subtotalAmount.amount);
        const newSubtotal = currentSubtotal + lineTotalDiff;
        
        // TotalはSubtotalと同じか、税金が含まれる場合は差分を維持
        const currentTotal = parseFloat(cart.cost.totalAmount.amount);
        const totalDiff = currentTotal - currentSubtotal; // 税金や割引の差分
        const newTotal = newSubtotal + totalDiff;

        const optimisticCart: Cart = {
          ...cart,
          lines: {
            ...cart.lines,
            edges: updatedEdges,
          },
          totalQuantity: cart.totalQuantity - oldQuantity + qty,
          cost: {
            ...cart.cost,
            subtotalAmount: {
              ...cart.cost.subtotalAmount,
              amount: newSubtotal.toFixed(2),
            },
            totalAmount: {
              ...cart.cost.totalAmount,
              amount: newTotal.toFixed(2),
            },
          },
        };

        set({ cart: optimisticCart });

        try {
          const response = await fetch("/api/shopify/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "update",
              cartId,
              lineId,
              quantity: qty,
            }),
          });
          if (!response.ok) throw new Error("Failed to update quantity");
          const data = await response.json();
          // APIレスポンスで正確な価格情報を更新（税金や割引が含まれる場合の正確な値）
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
          const response = await fetch("/api/shopify/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "remove",
              cartId,
              lineIds: [lineId],
            }),
          });
          if (!response.ok) throw new Error("Failed to remove from cart");
          const data = await response.json();
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
