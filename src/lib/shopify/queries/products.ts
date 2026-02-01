import { unstable_cache } from "next/cache";
import { shopifyFetch } from "../client";
import type { Product } from "../types";

const REVALIDATE_PRODUCT = 300;
const REVALIDATE_LIST = 300;
const REVALIDATE_SITEMAP = 900;

const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    title
    handle
    tags
    description
    descriptionHtml
    availableForSale
    featuredImage {
      url
      altText
      width
      height
    }
    images(first: 10) {
      edges {
        node {
          id
          url
          altText
          width
          height
        }
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          image {
            url
            altText
            width
            height
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    seo {
      title
      description
    }
    deliveryMin: metafield(namespace: "custom", key: "delivery_min_days") {
      value
    }
    deliveryMax: metafield(namespace: "custom", key: "delivery_max_days") {
      value
    }
  }
`;

// 単一商品取得の実処理（モジュールスコープで1回だけ定義）
const _getProductByHandle = async (
  handle: string,
): Promise<Product | null> => {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query getProduct($handle: String!) {
      product(handle: $handle) {
        ...ProductFields
      }
    }
  `;
  try {
    const data = await shopifyFetch<{ product: Product | null }>(query, {
      handle,
    });
    return data.product;
  } catch (error) {
    console.error(`Error fetching product ${handle}:`, error);
    return null;
  }
};

// モジュールスコープで1回だけ cached wrapper を生成。キーは引数 handle で統一（Next が引数をキーに含める）
export const cachedGetProductByHandle = unstable_cache(
  _getProductByHandle,
  ["shopify", "productByHandle"],
  { revalidate: REVALIDATE_PRODUCT },
);

// 互換維持：既存の getProductByHandle 利用箇所はそのまま動く
export async function getProductByHandle(
  handle: string,
): Promise<Product | null> {
  return cachedGetProductByHandle(handle);
}

// コレクション内の商品一覧取得（unstable_cache で 300s キャッシュ）
export async function getProductsByCollection(
  handle: string,
  first: number = 24,
): Promise<Product[]> {
  const cached = unstable_cache(
    async (h: string, f: number) => {
      const query = /* GraphQL */ `
        ${PRODUCT_FRAGMENT}
        query getCollectionProducts($handle: String!, $first: Int!) {
          collection(handle: $handle) {
            products(first: $first) {
              edges {
                node {
                  ...ProductFields
                }
              }
            }
          }
        }
      `;
      try {
        const data = await shopifyFetch<{
          collection: { products: { edges: { node: Product }[] } } | null;
        }>(query, { handle: h, first: f });
        return data.collection?.products?.edges.map((e) => e.node) ?? [];
      } catch (error) {
        console.error(`Error fetching collection ${h}:`, error);
        return [];
      }
    },
    ["shopify", "collection", handle, String(first)],
    { revalidate: REVALIDATE_LIST },
  );
  return cached(handle, first);
}

// タグで商品をフィルター
export async function getProductsByTag(
  tag: string,
  first: number = 24,
): Promise<Product[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query getProductsByTag($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{
      products: { edges: { node: Product }[] };
    }>(query, { query: `tag:${tag}`, first });

    return data.products?.edges.map((e) => e.node) ?? [];
  } catch (error) {
    console.error(`Error fetching products with tag ${tag}:`, error);
    return [];
  }
}

// generateStaticParams 専用：実処理（handle のみ取得、CREATED_AT 降順）
const _getProductHandlesForStaticParams = async (
  first: number,
): Promise<string[]> => {
  const query = /* GraphQL */ `
    query getProductHandlesForStaticParams($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            handle
          }
        }
      }
    }
  `;
  try {
    const data = await shopifyFetch<{
      products: { edges: { node: { handle: string } }[] };
    }>(query, { first });
    const handles =
      data.products?.edges.map((e) => e.node.handle).filter(Boolean) ?? [];
    return handles;
  } catch (error) {
    console.error("Error fetching product handles for static params:", error);
    return [];
  }
};

// モジュールスコープで1回だけ cached wrapper を生成（Next が引数 first をキーに含める）
export const cachedGetProductHandlesForStaticParams = unstable_cache(
  _getProductHandlesForStaticParams,
  ["shopify", "productHandlesForStaticParams"],
  { revalidate: REVALIDATE_LIST },
);

// 互換維持：既存の getProductHandlesForStaticParams 利用箇所はそのまま動く
export async function getProductHandlesForStaticParams(
  first: number = 200,
): Promise<string[]> {
  return cachedGetProductHandlesForStaticParams(first);
}

// 全商品取得（新しい順）。unstable_cache で 300s キャッシュ（layout + トップ等の重複を吸収）
export async function getAllProducts(first: number = 50): Promise<Product[]> {
  const cached = unstable_cache(
    async (f: number) => {
      const query = /* GraphQL */ `
        ${PRODUCT_FRAGMENT}
        query getAllProducts($first: Int!) {
          products(first: $first, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      `;
      try {
        const data = await shopifyFetch<{
          products: { edges: { node: Product }[] };
        }>(query, { first: f });
        return data.products?.edges.map((e) => e.node) ?? [];
      } catch (error) {
        console.error("Error fetching all products:", error);
        return [];
      }
    },
    ["shopify", "allProducts", String(first)],
    { revalidate: REVALIDATE_LIST },
  );
  return cached(first);
}

// sitemap 専用：250件・900s キャッシュ（sitemap が毎回 Shopify を叩かないようにする）
export async function getAllProductsForSitemap(): Promise<Product[]> {
  const cached = unstable_cache(
    async () => {
      const query = /* GraphQL */ `
        ${PRODUCT_FRAGMENT}
        query getAllProducts($first: Int!) {
          products(first: $first, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      `;
      try {
        const data = await shopifyFetch<{
          products: { edges: { node: Product }[] };
        }>(query, { first: 250 });
        return data.products?.edges.map((e) => e.node) ?? [];
      } catch (error) {
        console.error("Error fetching all products (sitemap):", error);
        return [];
      }
    },
    ["shopify", "allProductsSitemap"],
    { revalidate: REVALIDATE_SITEMAP },
  );
  return cached();
}

// 類似商品を取得（同じタグを持つ商品、現在の商品を除く）。unstable_cache で 300s キャッシュ
export async function getRelatedProducts(
  currentProductId: string,
  tags: string[],
  limit: number = 4,
): Promise<Product[]> {
  if (tags.length === 0) {
    return [];
  }

  const tag = tags[0];
  const cacheKey = [
    "shopify",
    "relatedProducts",
    currentProductId,
    tag,
    String(limit),
  ];

  const cached = unstable_cache(
    async (productId: string, tagList: string[], lim: number) => {
      const t = tagList[0];
      const query = /* GraphQL */ `
        ${PRODUCT_FRAGMENT}
        query getRelatedProducts($query: String!, $first: Int!) {
          products(first: $first, query: $query) {
            edges {
              node {
                ...ProductFields
              }
            }
          }
        }
      `;
      try {
        const data = await shopifyFetch<{
          products: { edges: { node: Product }[] };
        }>(query, { query: `tag:${t}`, first: lim + 1 });
        const relatedProducts =
          data.products?.edges
            .map((e) => e.node)
            .filter((p) => p.id !== productId)
            .slice(0, lim) ?? [];
        return relatedProducts;
      } catch (error) {
        console.error("Error fetching related products:", error);
        return [];
      }
    },
    cacheKey,
    { revalidate: REVALIDATE_LIST },
  );
  return cached(currentProductId, tags, limit);
}
