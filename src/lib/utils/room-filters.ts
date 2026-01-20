import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import { Product as LocalProduct } from "@/types";

type Product = ShopifyProduct | LocalProduct;

const roomTagMap: Record<string, string[]> = {
  "living-room": [
    "Living Room", // Shopifyで使用する正確なタグ名
    "living room",
    "livingroom",
    "living-room",
  ],
  bedroom: [
    "Bedroom", // Shopifyで使用する正確なタグ名
    "bedroom",
    "bed room",
  ],
  "dining-room-kitchen": [
    "Dining Room & Kitchen", // Shopifyで使用する正確なタグ名
    "dining room & kitchen",
    "dining room",
    "diningroom",
    "dining-room",
    "kitchen",
  ],
  outdoor: [
    "Outdoor", // Shopifyで使用する正確なタグ名
    "outdoor",
    "out door",
    "garden",
    "patio",
  ],
  "home-office": [
    "Home Office", // Shopifyで使用する正確なタグ名
    "home office",
    "homeoffice",
    "office",
    "workspace",
  ],
  entryway: [
    "Entryway", // Shopifyで使用する正確なタグ名
    "entryway",
    "entry way",
    "entry",
    "foyer",
  ],
  lighting: [
    "Lighting", // Shopifyで使用する正確なタグ名
    "lighting",
    "light",
    "lamp",
  ],
  clothing: [
    "Clothing", // Shopifyで使用する正確なタグ名
    "Clothes", // Shopifyで使用する正確なタグ名
    "clothing",
    "clothes",
    "apparel",
    "wear",
    "tshirt",
    "t-shirt",
    "t shirt",
    "shirt",
    "top",
    "fashion",
  ],
};

export function filterProductsByRoom(
  products: Product[],
  roomSlug: string
): Product[] {
  const roomTags = roomTagMap[roomSlug.toLowerCase()] || [];
  if (roomTags.length === 0) return products;

  return products.filter((product) => {
    // Shopify商品の場合はタグで判定
    if ("tags" in product && Array.isArray(product.tags)) {
      // まず正確なタグ名でマッチング（大文字小文字を区別）
      const exactMatch = product.tags.some((tag) =>
        roomTags.some((roomTag) => tag === roomTag)
      );
      if (exactMatch) return true;

      // 正確なマッチがない場合、小文字に変換して柔軟なマッチング
      const productTags = product.tags.map((tag) => tag.toLowerCase());
      return roomTags.some((roomTag) => {
        const normalizedRoomTag = roomTag.toLowerCase();
        return productTags.some(
          (pt) =>
            pt === normalizedRoomTag ||
            pt.includes(normalizedRoomTag) ||
            normalizedRoomTag.includes(pt)
        );
      });
    }
    // ローカル商品の場合はカテゴリーで判定
    if ("category" in product) {
      const category = product.category.toLowerCase().trim();
      return roomTags.some((roomTag) => {
        const normalizedRoomTag = roomTag.toLowerCase().trim();
        // カテゴリー名がルームタグを含むか、または完全一致するかをチェック
        // スペースを無視した比較も行う
        const categoryNoSpaces = category.replace(/\s+/g, "");
        const roomTagNoSpaces = normalizedRoomTag.replace(/\s+/g, "");
        return (
          category === normalizedRoomTag ||
          category.includes(normalizedRoomTag) ||
          normalizedRoomTag.includes(category) ||
          categoryNoSpaces === roomTagNoSpaces ||
          categoryNoSpaces.includes(roomTagNoSpaces) ||
          roomTagNoSpaces.includes(categoryNoSpaces)
        );
      });
    }
    return false;
  });
}

// Lighting専用のフィルター関数
export function filterProductsByLighting(products: Product[]): Product[] {
  return filterProductsByRoom(products, "lighting");
}

// Clothing専用のフィルター関数
export function filterProductsByClothing(products: Product[]): Product[] {
  return filterProductsByRoom(products, "clothing");
}
