const shopDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

const adminEndpoint =
  shopDomain && apiVersion
    ? `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`
    : shopDomain
    ? `https://${shopDomain}/admin/api/graphql.json`
    : undefined;

if (!shopDomain) {
  throw new Error("NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN is not defined");
}

if (!adminToken) {
  throw new Error("SHOPIFY_ADMIN_ACCESS_TOKEN is not defined");
}

const token = adminToken;

export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  if (!adminEndpoint) {
    throw new Error("Admin endpoint is not configured");
  }

  try {
    const response = await fetch(adminEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
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
