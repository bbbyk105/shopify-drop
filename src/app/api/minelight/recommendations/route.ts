import { NextResponse } from "next/server";

import { getProductsByTag } from "@/lib/shopify/queries/products";

export async function GET() {
  try {
    // MineLightタグ付きの商品から最大2件取得
    const products = await getProductsByTag("minelight", 2);

    const payload = products.map((product) => ({
      id: product.id,
      title: product.title,
      handle: product.handle,
      price: product.priceRange?.minVariantPrice?.amount ?? null,
      currency: product.priceRange?.minVariantPrice?.currencyCode ?? "JPY",
      imageUrl: product.featuredImage?.url ?? null,
    }));

    return NextResponse.json({ products: payload });
  } catch (error) {
    console.error("Failed to fetch MineLight recommendations", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
