const adminEndpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!adminToken) {
    throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN is not defined");
  }

  try {
    const response = await fetch(adminEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken,
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Admin API request failed: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error("Shopify Admin API Errors:", json.errors);
      throw new Error("Shopify Admin API returned errors");
    }

    return json.data;
  } catch (error) {
    console.error("Admin API fetch error:", error);
    throw error;
  }
}
