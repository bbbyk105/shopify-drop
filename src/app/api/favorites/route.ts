import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import type { Product as LocalProduct } from "@/types";
import { products } from "@/lib/products";

type Product = ShopifyProduct | LocalProduct;

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!Array.isArray(productIds)) {
      return NextResponse.json(
        { error: "productIds must be an array" },
        { status: 400 }
      );
    }

    // Shopifyから商品を取得
    let shopifyProducts: ShopifyProduct[] = [];
    try {
      shopifyProducts = await getAllProducts(100);
    } catch (error) {
      console.error("Failed to fetch Shopify products:", error);
    }

    // Shopify商品があればそれを使用、なければローカル商品を使用
    const allProducts: Product[] =
      shopifyProducts.length > 0 ? shopifyProducts : products;

    // お気に入りIDに一致する商品をフィルター
    const favoriteProducts = allProducts.filter((product): product is Product => {
      if ("slug" in product) {
        // LocalProductの場合
        const productId = `local-${product.slug}`;
        return productIds.includes(productId);
      } else {
        // ShopifyProductの場合
        return productIds.includes(product.id);
      }
    });

    return NextResponse.json({ products: favoriteProducts });
  } catch (error) {
    console.error("Error fetching favorite products:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorite products" },
      { status: 500 }
    );
  }
}
