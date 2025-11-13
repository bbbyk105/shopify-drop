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

export async function getCart(cartId: string): Promise<{ cart: Cart }> {
  const query = /* GraphQL */ `
    ${CART_FIELDS}
    query getCart($id: ID!) {
      cart(id: $id) {
        ...CartFields
      }
    }
  `;

  return shopifyFetch<{ cart: Cart }>(query, { id: cartId });
}
