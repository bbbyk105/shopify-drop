import { shopifyAdminFetch } from "../admin-client";

interface InventoryQuantity {
  name: string;
  quantity: number;
}

interface InventoryLevel {
  quantities: InventoryQuantity[];
}

interface InventoryItem {
  inventoryLevels: {
    edges: Array<{
      node: InventoryLevel;
    }>;
  };
}

interface ProductVariant {
  id: string;
  inventoryItem: InventoryItem;
}

interface AdminProduct {
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
}

// 商品の全バリアントの在庫を取得
export async function getProductInventory(
  productId: string
): Promise<Record<string, number>> {
  const query = `
    query getProductInventory($id: ID!) {
      product(id: $id) {
        variants(first: 100) {
          edges {
            node {
              id
              inventoryItem {
                inventoryLevels(first: 1) {
                  edges {
                    node {
                      quantities(names: "available") {
                        name
                        quantity
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyAdminFetch<{ product: AdminProduct }>(query, {
      id: productId,
    });

    const inventory: Record<string, number> = {};

    data.product?.variants?.edges.forEach(({ node }) => {
      // 'available' という名前の在庫数を取得
      const availableQty =
        node.inventoryItem?.inventoryLevels?.edges[0]?.node?.quantities?.find(
          (q) => q.name === "available"
        );

      inventory[node.id] = availableQty?.quantity ?? 10;
    });

    return inventory;
  } catch (error) {
    console.error("Error fetching product inventory:", error);
    // エラー時はデフォルト値を返す
    return {};
  }
}
