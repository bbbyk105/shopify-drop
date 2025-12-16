import { getProductByHandle } from "@/lib/shopify/queries/products";
import { getProductInventory } from "@/lib/shopify/queries/inventory";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import MineLightProductClient from "./MineLightProductClient";

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
    title: `${product.title} | Mine Light Collection`,
    description:
      product.description ||
      product.seo?.description ||
      "Level up your room with Mine Light-inspired lighting",
    openGraph: {
      title: product.seo?.title || product.title,
      description: product.seo?.description || product.description || "",
      images: product.featuredImage ? [product.featuredImage.url] : [],
    },
  };
}

export default async function MineLightProductPage({
  params,
}: ProductPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) {
    notFound();
  }

  const product = await getProductByHandle(slug);

  if (!product) {
    notFound();
  }

  // Mine Lightタグがない商品は404
  if (!product.tags.includes("minelight")) {
    notFound();
  }

  // 在庫数を取得
  let inventory: Record<string, number> = {};
  try {
    inventory = await getProductInventory(product.id);
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
  }

  const images = product.images.edges.map((edge) => edge.node);
  const firstVariant = product.variants.edges[0]?.node;

  return (
    <div className="relative">
      {/* 背景パターン */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: "url('/images/stone-texture.png')",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 relative">
        {/* Breadcrumb - Mine Light Style */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm font-bold">
            <li>
              <Link
                href="/"
                className="text-white hover:text-yellow-300 transition-colors drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              >
                HOME
              </Link>
            </li>
            <li className="text-white">&gt;</li>
            <li>
              <Link
                href="/minelight"
                className="text-white hover:text-yellow-300 transition-colors drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]"
              >
                MINE LIGHT
              </Link>
            </li>
            <li className="text-white">&gt;</li>
            <li className="text-yellow-300 drop-shadow-[1px_1px_0px_rgba(0,0,0,1)]">
              {product.title.toUpperCase()}
            </li>
          </ol>
        </nav>

        <MineLightProductClient
          product={product}
          images={images}
          firstVariant={firstVariant}
          inventory={inventory}
        />
      </div>
    </div>
  );
}
