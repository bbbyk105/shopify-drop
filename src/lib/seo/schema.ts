import { getSiteUrl } from "./site-url";
import type { Product } from "@/lib/shopify/types";

/** 共通: Organization + WebSite（SearchAction付き）用のJSON-LD */
export function buildOrganizationAndWebSite() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: "Evimeria Home",
        url,
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: "Evimeria Home",
        publisher: { "@id": `${url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/products?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/** 商品ページ: Product JSON-LD（必須最小セット。review/aggregateRating は未実装のため含めない） */
export function buildProductSchema(
  product: Product,
  productUrl: string,
): object {
  const images = product.images?.edges?.map((e) => e.node.url) ?? [];
  if (
    product.featuredImage?.url &&
    !images.includes(product.featuredImage.url)
  ) {
    images.unshift(product.featuredImage.url);
  }
  const firstVariant = product.variants?.edges?.[0]?.node;
  const price = firstVariant
    ? parseFloat(firstVariant.price.amount)
    : parseFloat(product.priceRange?.minVariantPrice?.amount ?? "0");
  const currency =
    firstVariant?.price?.currencyCode ??
    product.priceRange?.minVariantPrice?.currencyCode ??
    "USD";
  const availability = product.availableForSale
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description?.trim() || product.title,
    image: images.length ? images : undefined,
    brand: {
      "@type": "Brand",
      name: "Evimeria Home",
    },
    sku: firstVariant?.id ?? undefined,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

/** 商品ページ: BreadcrumbList（Home > Products > Product の3階層） */
export function buildBreadcrumbSchema(
  productTitle: string,
  productUrl: string,
): object {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${url}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: productTitle,
        item: productUrl,
      },
    ],
  };
}
