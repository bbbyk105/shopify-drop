import { getProductByHandle, getRelatedProducts } from "@/lib/shopify/queries/products";
import { getProductInventory } from "@/lib/shopify/queries/inventory";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ProductClient from "./ProductClient";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";

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

  const product = await getProductByHandle(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.title} | Your Store`,
    description: product.description || product.seo?.description || "",
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description || "",
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

  const product = await getProductByHandle(slug);

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
  const getCategoryFromTags = (tags: string[]): { path: string; label: string } | null => {
    const normalizedTags = tags.map(tag => tag.toLowerCase().trim());
    
    // Headerのナビゲーション項目と完全一致するマッピング
    // 優先順位順に定義（先に見つかったものが優先される）
    const categoryMappings: Array<{ tags: string[]; path: string; label: string }> = [
      // ルームカテゴリー（最優先）
      { tags: ["living-room", "livingroom"], path: "/rooms/living-room", label: "Living Room" },
      { tags: ["bedroom"], path: "/rooms/bedroom", label: "Bedroom" },
      { tags: ["dining-room-kitchen", "dining-room", "diningroom", "kitchen"], path: "/rooms/dining-room-kitchen", label: "Dining Room & Kitchen" },
      { tags: ["outdoor"], path: "/rooms/outdoor", label: "Outdoor" },
      { tags: ["home-office", "homeoffice"], path: "/rooms/home-office", label: "Home Office" },
      { tags: ["entryway"], path: "/rooms/entryway", label: "Entryway" },
      // 商品タイプカテゴリー
      { tags: ["lighting"], path: "/lighting", label: "Lighting" },
      { tags: ["clothing"], path: "/clothing", label: "Clothing" },
      // 特別カテゴリー
      { tags: ["new-arrivals", "newarrivals"], path: "/new-arrivals", label: "New Arrivals" },
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

  // 類似商品を取得
  let relatedProducts: ShopifyProduct[] = [];
  try {
    relatedProducts = await getRelatedProducts(product.id, product.tags, 1);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
            <Link href="/products" className="hover:text-foreground transition-colors">
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
      />
    </div>
  );
}
