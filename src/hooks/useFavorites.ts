"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProductId = string;

interface FavoritesState {
  favorites: ProductId[];
  add: (productId: ProductId) => void;
  remove: (productId: ProductId) => void;
  toggle: (productId: ProductId) => void;
  isFavorite: (productId: ProductId) => boolean;
  clear: () => void;
}

// 将来のログイン機能に対応するため、ユーザーIDを考慮した構造
// 現在はローカルストレージを使用、将来的にはAPIに移行可能
export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      add: (productId: ProductId) => {
        const { favorites } = get();
        if (!favorites.includes(productId)) {
          set({ favorites: [...favorites, productId] });
          // TODO: 将来的にはAPIに保存
          // if (userId) {
          //   await fetch(`/api/favorites`, {
          //     method: "POST",
          //     body: JSON.stringify({ productId, userId }),
          //   });
          // }
        }
      },

      remove: (productId: ProductId) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter((id) => id !== productId),
        });
        // TODO: 将来的にはAPIから削除
        // if (userId) {
        //   await fetch(`/api/favorites/${productId}`, {
        //     method: "DELETE",
        //     body: JSON.stringify({ userId }),
        //   });
        // }
      },

      toggle: (productId: ProductId) => {
        const { isFavorite, add, remove } = get();
        if (isFavorite(productId)) {
          remove(productId);
        } else {
          add(productId);
        }
      },

      isFavorite: (productId: ProductId) => {
        return get().favorites.includes(productId);
      },

      clear: () => {
        set({ favorites: [] });
      },
    }),
    {
      name: "favorites-storage", // localStorage key
    }
  )
);
