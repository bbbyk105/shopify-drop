import { GraphQLClient } from "graphql-request";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const version = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || "2024-10";
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

if (!domain) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is missing");
}

if (!token) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN is missing");
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
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    return await shopify.request<T>(query, variables);
  } catch (error) {
    console.error("Shopify API Error:", error);
    throw error;
  }
}
