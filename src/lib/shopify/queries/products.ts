import { shopifyFetch } from "../client";
import type { Product } from "../types";

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

// 単一商品取得
export async function getProductByHandle(
  handle: string
): Promise<Product | null> {
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
}

// コレクション内の商品一覧取得
export async function getProductsByCollection(
  handle: string,
  first: number = 24
): Promise<Product[]> {
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
    }>(query, { handle, first });

    return data.collection?.products?.edges.map((e) => e.node) ?? [];
  } catch (error) {
    console.error(`Error fetching collection ${handle}:`, error);
    return [];
  }
}

// タグで商品をフィルター
export async function getProductsByTag(
  tag: string,
  first: number = 24
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

// 全商品取得（新しい順）
export async function getAllProducts(first: number = 50): Promise<Product[]> {
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
    }>(query, { first });

    return data.products?.edges.map((e) => e.node) ?? [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
}

// 類似商品を取得（同じタグを持つ商品、現在の商品を除く）
export async function getRelatedProducts(
  currentProductId: string,
  tags: string[],
  limit: number = 4
): Promise<Product[]> {
  if (tags.length === 0) {
    return [];
  }

  // 最初のタグを使用して類似商品を検索
  const tag = tags[0];
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
    }>(query, { query: `tag:${tag}`, first: limit + 1 });

    // 現在の商品を除外
    const relatedProducts = data.products?.edges
      .map((e) => e.node)
      .filter((p) => p.id !== currentProductId)
      .slice(0, limit) ?? [];

    return relatedProducts;
  } catch (error) {
    console.error("Error fetching related products:", error);
    return [];
  }
}
