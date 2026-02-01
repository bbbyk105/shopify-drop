import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-10";
// セキュリティ強化: NEXT_PUBLIC_を削除してサーバーサイドのみで使用
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is missing");
}

if (!token) {
  throw new Error("SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing");
}

const endpoint = `https://${domain}/api/${version}/graphql.json`;

export const shopify = new GraphQLClient(endpoint, {
  headers: {
    "X-Shopify-Storefront-Access-Token": token,
    "Content-Type": "application/json",
  },
});

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (process.env.NODE_ENV !== "production") {
    // 開発時のみ：実リクエストが走ったことを目視できるようにする（キャッシュヒット時は出ない）
    console.log("[Shopify] request", variables ? Object.keys(variables) : []);
  }
  try {
    return await shopify.request<T>(query, variables);
  } catch (error) {
    console.error("Shopify API Error:", error);
    throw error;
  }
}
