import { NextRequest, NextResponse } from "next/server";
import { createCart, addLines, updateLineQty, removeLines } from "@/lib/shopify/mutations/cart";
import { getCart } from "@/lib/shopify/queries/cart";
import { getVariantsInventory } from "@/lib/shopify/queries/inventory";
import { isShopifyServiceUnavailable } from "@/lib/shopify/client";

// カート操作（作成、追加、更新、削除）
export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    switch (action) {
      case "create": {
        const createResult = await createCart();
        return NextResponse.json(createResult);
      }
      
      case "add": {
        const { cartId, lines } = params;
        if (!cartId || !lines) {
          return NextResponse.json(
            { error: "cartId and lines are required" },
            { status: 400 }
          );
        }
        // 売り切れ・在庫不足の場合は追加させない（本番でカートに追加されるのを防ぐ）
        const variantIds = (lines as { merchandiseId: string; quantity: number }[]).map(
          (line) => line.merchandiseId
        );
        const inventory = await getVariantsInventory(variantIds);
        for (const line of lines as { merchandiseId: string; quantity: number }[]) {
          const available = inventory[line.merchandiseId];
          if (available === undefined) {
            // 在庫取得に失敗した場合は安全のため拒否
            return NextResponse.json(
              { error: "Unable to verify stock. Please try again." },
              { status: 400 }
            );
          }
          if (available <= 0) {
            return NextResponse.json(
              { error: "This item is currently sold out." },
              { status: 400 }
            );
          }
          if (line.quantity > available) {
            return NextResponse.json(
              { error: `Only ${available} item(s) available for this variant.` },
              { status: 400 }
            );
          }
        }
        const addResult = await addLines(cartId, lines);
        return NextResponse.json(addResult);
      }
      
      case "update": {
        const { cartId, lineId, quantity } = params;
        if (!cartId || !lineId || quantity === undefined) {
          return NextResponse.json(
            { error: "cartId, lineId, and quantity are required" },
            { status: 400 }
          );
        }
        const updateResult = await updateLineQty(cartId, lineId, quantity);
        return NextResponse.json(updateResult);
      }
      
      case "remove": {
        const { cartId, lineIds } = params;
        if (!cartId || !lineIds) {
          return NextResponse.json(
            { error: "cartId and lineIds are required" },
            { status: 400 }
          );
        }
        const removeResult = await removeLines(cartId, lineIds);
        return NextResponse.json(removeResult);
      }
      
      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'create', 'add', 'update', or 'remove'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Cart API error:", error);
    if (isShopifyServiceUnavailable(error)) {
      return NextResponse.json(
        { error: "Cart is temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// カート取得
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("cartId");
    
    if (!cartId) {
      return NextResponse.json(
        { error: "cartId is required" },
        { status: 400 }
      );
    }

    const result = await getCart(cartId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Cart fetch error:", error);
    if (isShopifyServiceUnavailable(error)) {
      return NextResponse.json(
        { error: "Cart is temporarily unavailable. Please try again in a moment." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
