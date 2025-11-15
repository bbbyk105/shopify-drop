import { shopifyFetch } from "../client";
import type { Cart } from "../types";

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
              title
              price {
                amount
                currencyCode
              }
              product {
                handle
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

// カート作成
export async function createCart() {
  const mutation = /* GraphQL */ `
    ${CART_FIELDS}
    mutation cartCreate {
      cartCreate {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  return shopifyFetch<{
    cartCreate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>(mutation);
}

// カートに商品追加
export async function addLines(
  cartId: string,
  lines: { merchandiseId: string; quantity: number }[]
) {
  const mutation = /* GraphQL */ `
    ${CART_FIELDS}
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  return shopifyFetch<{
    cartLinesAdd: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>(mutation, { cartId, lines });
}

// カート内商品の数量更新
export async function updateLineQty(
  cartId: string,
  lineId: string,
  quantity: number
) {
  const mutation = /* GraphQL */ `
    ${CART_FIELDS}
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  return shopifyFetch<{
    cartLinesUpdate: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>(mutation, { cartId, lines: [{ id: lineId, quantity }] });
}

// カートから商品削除
export async function removeLines(cartId: string, lineIds: string[]) {
  const mutation = /* GraphQL */ `
    ${CART_FIELDS}
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          ...CartFields
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  return shopifyFetch<{
    cartLinesRemove: {
      cart: Cart;
      userErrors: { field: string[]; message: string }[];
    };
  }>(mutation, { cartId, lineIds });
}
