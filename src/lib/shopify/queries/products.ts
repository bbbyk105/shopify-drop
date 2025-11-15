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

// 全商品取得
export async function getAllProducts(first: number = 50): Promise<Product[]> {
  const query = /* GraphQL */ `
    ${PRODUCT_FRAGMENT}
    query getAllProducts($first: Int!) {
      products(first: $first) {
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
