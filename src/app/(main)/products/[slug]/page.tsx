import {
  cachedGetProductByHandle,
  getProductHandlesForStaticParams,
  getRelatedProducts,
  getComplementaryProducts,
} from "@/lib/shopify/queries/products";
import { getProductInventory } from "@/lib/shopify/queries/inventory";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ProductClient from "./ProductClient";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import type { BundleGroup } from "@/components/pdp/types";
import { buildProductMeta } from "@/lib/seo/meta";
import { buildProductSchema, buildBreadcrumbSchema } from "@/lib/seo/schema";
import { getSiteUrl } from "@/lib/seo/site-url";

/** ISR: 600秒で再検証。商品詳細。 */
export const revalidate = 600;

/** ビルド時に上位200件の商品を静的生成（handle のみの軽量クエリ）。それ以外はオンデマンド。 */
export async function generateStaticParams() {
  try {
    const handles = await getProductHandlesForStaticParams(200);
    return [...new Set(handles)].map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    return {
      title: "Product Not Found",
    };
  }

  const product = await cachedGetProductByHandle(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const description = product.description || product.seo?.description || "";
  const meta = buildProductMeta(product.title, description, slug);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  const product = await cachedGetProductByHandle(slug);

  if (!product) {
    notFound();
  }

  // 在庫数を取得
  let inventory: Record<string, number> = {};
  try {
    inventory = await getProductInventory(product.id);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    // エラー時はデフォルト値を使用
  }

  // 画像配列を作成
  const images = product.images.edges.map((edge) => edge.node);
  const firstVariant = product.variants.edges[0]?.node;

  // Headerのナビゲーション項目に完全に合わせてカテゴリーを決定
  // 優先順位: 1. ルームカテゴリー > 2. 商品タイプ > 3. 特別カテゴリー
  const getCategoryFromTags = (
    tags: string[],
  ): { path: string; label: string } | null => {
    const normalizedTags = tags.map((tag) => tag.toLowerCase().trim());

    // Headerのナビゲーション項目と完全一致するマッピング
    // 優先順位順に定義（先に見つかったものが優先される）
    const categoryMappings: Array<{
      tags: string[];
      path: string;
      label: string;
    }> = [
      // ルームカテゴリー（最優先）
      {
        tags: ["living-room", "livingroom"],
        path: "/rooms/living-room",
        label: "Living Room",
      },
      { tags: ["bedroom"], path: "/rooms/bedroom", label: "Bedroom" },
      {
        tags: ["dining-room-kitchen", "dining-room", "diningroom", "kitchen"],
        path: "/rooms/dining-room-kitchen",
        label: "Dining Room & Kitchen",
      },
      { tags: ["outdoor"], path: "/rooms/outdoor", label: "Outdoor" },
      {
        tags: ["home-office", "homeoffice"],
        path: "/rooms/home-office",
        label: "Home Office",
      },
      { tags: ["entryway"], path: "/rooms/entryway", label: "Entryway" },
      // 商品タイプカテゴリー
      { tags: ["lighting"], path: "/lighting", label: "Lighting" },
      { tags: ["clothing"], path: "/clothing", label: "Clothing" },
      // 特別カテゴリー
      {
        tags: ["new-arrivals", "newarrivals"],
        path: "/new-arrivals",
        label: "New Arrivals",
      },
      { tags: ["sale"], path: "/sale", label: "Sale" },
    ];

    // 優先順位に従って検索（最初に見つかったものを返す）
    for (const mapping of categoryMappings) {
      for (const tag of normalizedTags) {
        if (mapping.tags.includes(tag)) {
          return { path: mapping.path, label: mapping.label };
        }
      }
    }

    return null;
  };

  const category = getCategoryFromTags(product.tags);

  // 類似商品を取得（More in this style 用に最大8件）
  let relatedProducts: ShopifyProduct[] = [];
  try {
    relatedProducts = await getRelatedProducts(product.id, product.tags, 8);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  }

  // Complete the space: 現在の商品は含めず、ナビのカテゴリから相性の良い組み合わせをランダムに提案（売り切れ除外）
  // キーは product.tags の小文字・ハイフン版。値は Shopify のタグ（admin のタグと一致させること）
  const complementaryTagMap: Record<string, string[]> = {
    "living-room": ["lighting", "bedroom", "entryway", "new-arrivals"],
    livingroom: ["lighting", "bedroom", "entryway", "new-arrivals"],
    bedroom: ["lighting", "living-room", "entryway", "new-arrivals"],
    lighting: ["living-room", "bedroom", "entryway", "new-arrivals"],
    "dining-room-kitchen": ["lighting", "living-room", "new-arrivals"],
    "dining-room": ["lighting", "living-room", "new-arrivals"],
    outdoor: ["lighting", "living-room", "new-arrivals"],
    "home-office": ["lighting", "living-room", "bedroom", "new-arrivals"],
    homeoffice: ["lighting", "living-room", "bedroom", "new-arrivals"],
    entryway: ["lighting", "living-room", "bedroom", "new-arrivals"],
    clothing: ["new-arrivals"],
    "new-arrivals": ["living-room", "lighting", "bedroom"],
    newarrivals: ["living-room", "lighting", "bedroom"],
    sale: ["living-room", "lighting", "bedroom"],
  };
  const normalizedProductTags = product.tags.map((t) => t.toLowerCase().trim());
  const complementaryTags: string[] = [];
  for (const tag of normalizedProductTags) {
    const mapped =
      complementaryTagMap[tag] ?? complementaryTagMap[tag.replace(/\s+/g, "-")];
    if (mapped) {
      complementaryTags.push(...mapped);
      break;
    }
  }
  if (complementaryTags.length === 0) {
    complementaryTags.push(
      "living-room",
      "lighting",
      "bedroom",
      "new-arrivals",
    );
  }
  const uniqueTags = [...new Set(complementaryTags)];
  let complementaryProducts: ShopifyProduct[] = [];
  try {
    complementaryProducts = await getComplementaryProducts(
      uniqueTags,
      product.id,
      4,
      product.id,
    );
  } catch (error) {
    console.error("Failed to fetch complementary products:", error);
  }

  const bundleItems = complementaryProducts
    .map((p) => {
      const v = p.variants.edges[0]?.node;
      const variantId = v?.id ?? "";
      if (!variantId) return null;
      return {
        handle: p.handle,
        variantId,
        title: p.title,
        price: parseFloat(p.priceRange.minVariantPrice.amount),
        image:
          p.featuredImage?.url ??
          p.images.edges[0]?.node.url ??
          "/placeholder.png",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const bundleMedia =
    bundleItems[0]?.image ??
    product.featuredImage?.url ??
    "/images/living_room.webp";
  const bundles: BundleGroup[] =
    bundleItems.length >= 2
      ? [
          {
            title: "Complete the space",
            subtitle: "Pairs well with your style",
            media: bundleMedia,
            items: bundleItems,
          },
        ]
      : [];

  const siteUrl = getSiteUrl();
  const productUrl = `${siteUrl}/products/${slug}`;
  const productJsonLd = buildProductSchema(product, productUrl);
  const breadcrumbJsonLd = buildBreadcrumbSchema(product.title, productUrl);

  return (
    <div className="container mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
          </li>
          {category && (
            <>
              <li>/</li>
              <li>
                <Link
                  href={category.path}
                  className="hover:text-foreground transition-colors"
                >
                  {category.label}
                </Link>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-foreground">{product.title}</li>
        </ol>
      </nav>

      {/* クライアントコンポーネントに在庫情報も渡す */}
      <ProductClient
        product={product}
        images={images}
        firstVariant={firstVariant}
        inventory={inventory}
        relatedProducts={relatedProducts}
        bundles={bundles}
      />
    </div>
  );
}
