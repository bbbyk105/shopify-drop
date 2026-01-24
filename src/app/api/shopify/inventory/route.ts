import { NextRequest, NextResponse } from "next/server";
import { getVariantsInventory } from "@/lib/shopify/queries/inventory";

// バリアントIDのリストから在庫情報を取得
export async function POST(request: NextRequest) {
  try {
    const { variantIds } = await request.json();

    if (!variantIds || !Array.isArray(variantIds)) {
      return NextResponse.json(
        { error: "variantIds array is required" },
        { status: 400 }
      );
    }

    const inventory = await getVariantsInventory(variantIds);
    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Inventory API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
