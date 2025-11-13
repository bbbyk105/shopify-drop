import { getProductByHandle } from "@/lib/shopify/queries/products";
import { getProductInventory } from "@/lib/shopify/queries/inventory";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ProductClient from "./ProductClient";

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

  // カテゴリーをタグから推測
  const category =
    product.tags.find((tag) =>
      ["furniture", "lighting", "decor"].includes(tag.toLowerCase())
    ) || "products";

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
            <Link
              href={`/${category}`}
              className="hover:text-foreground transition-colors capitalize"
            >
              {category}
            </Link>
          </li>
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
      />
    </div>
  );
}
