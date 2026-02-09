import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
}

/**
 * 商品IDから決定的に「表示用の割引率」を返す。同じ商品は常に同じ結果。
 * - 約50%の商品が対象。対象の場合のみ 20〜50 の割引率（%）、それ以外は null。
 * - 怪しくならないよう商品ごとに割引の見え方を変える（20%〜50%）。
 */
export function getFakeDiscountPercent(productId: string): number | null {
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash + productId.charCodeAt(i)) | 0;
  }
  const bucket = Math.abs(hash % 100);
  if (bucket >= 50) return null;
  return (bucket % 31) + 20; // 20〜50%
}

/** @deprecated 代わりに getFakeDiscountPercent を使用 */
export function shouldShowFakeCompareAtPrice(productId: string): boolean {
  return getFakeDiscountPercent(productId) !== null;
}
