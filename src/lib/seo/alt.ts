/**
 * 商品画像の alt ルール: 「家具種 + 素材 + 色 + 用途」を組み立て、なければ商品名を fallback に使用。
 * LCP / アクセシビリティ用。
 */

export interface ProductAltInput {
  /** 商品名（必須・fallback に使用） */
  title: string;
  /** 家具種（例: Table Lamp, Sofa） */
  productType?: string | null;
  /** 素材（例: Metal, Wood） */
  material?: string | null;
  /** 色（例: Black, White） */
  color?: string | null;
  /** 用途・部屋（例: Living Room） */
  usage?: string | null;
}

/**
 * 商品画像用の alt 文字列を生成する。
 * ルール: 家具種 + 素材 + 色 + 用途。いずれも無い場合は title を返す。
 */
export function buildProductImageAlt(input: ProductAltInput): string {
  const parts: string[] = [];
  if (input.productType?.trim()) parts.push(input.productType.trim());
  if (input.material?.trim()) parts.push(input.material.trim());
  if (input.color?.trim()) parts.push(input.color.trim());
  if (input.usage?.trim()) parts.push(input.usage.trim());
  if (parts.length === 0) return input.title;
  return `${input.title} — ${parts.join(", ")}`;
}
