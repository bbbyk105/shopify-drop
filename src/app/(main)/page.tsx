import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import ProductSlider from "@/components/home/ProductSlider";
import { featuredCollections } from "@/config/featuredCollections";
import ShopByRoom from "@/components/home/ShopByRoom";
import PromotionalTwoColumn from "@/components/home/PromotionalTwoColumn";
import Section from "@/components/home/Section";
import VerticalVideoSection from "@/components/home/VerticalVideoSection";
import { products } from "@/lib/products";
import {
  getAllProducts,
  getProductsByCollection,
  getProductsByTag,
} from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";
import type { Product as LocalProduct } from "@/types";

/** ISR: 180秒で再検証。トップは更新頻度をやや高めに。 */
export const revalidate = 180;

export default async function HomePage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: ShopifyProduct[] = [];
  try {
    shopifyProducts = await getAllProducts(20);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;

  // New Arrivals: 最新商品として最大8件まで表示
  const newArrivals = allProducts.slice(0, 8);

  // Top Sellers: ①「Best-Seller」コレクション → ②タグでAPI検索（bestseller, best-seller, best seller, top-seller, top seller）
  // ※getAllProducts(20)の絞り込みではなく、Shopifyのタグ検索APIで直接取得
  const BESTSELLER_TAGS = [
    "bestseller",
    "best-seller",
    "best seller",
    "top-seller",
    "top seller",
  ];
  let bestSellers: Array<ShopifyProduct | LocalProduct> = [];
  try {
    bestSellers = await getProductsByCollection("Best-Seller", 8);
  } catch (error) {
    console.error("Failed to fetch Best-Seller collection:", error);
  }
  if (bestSellers.length === 0) {
    const seen = new Set<string>();
    for (const tag of BESTSELLER_TAGS) {
      try {
        const items = await getProductsByTag(tag, 8);
        for (const p of items) {
          if (!seen.has(p.id)) {
            seen.add(p.id);
            bestSellers.push(p);
            if (bestSellers.length >= 8) break;
          }
        }
      } catch {
        // タグが存在しない場合はスキップ
      }
      if (bestSellers.length >= 8) break;
    }
  }

  return (
    <div>
      {/* (1) Hero */}
      <Hero />

      {/* (2) Shop By Room - 回遊導線 */}
      <ShopByRoom />

      {/* (3) Top Sellers - 商品密度の山1 */}
      {bestSellers.length > 0 && (
        <Section title="Top Sellers" showDivider>
          <ProductSlider products={bestSellers} variant="titleOnly" />
        </Section>
      )}

      {/* (4) Featured Collections - 回遊の次の一手 */}
      {featuredCollections.length > 0 && (
        <Section
          title="Featured Collection"
          subtitle="Discover our special curated collections"
          showDivider
        >
          <FeaturedCollections />
        </Section>
      )}

      {/* (4.5) 縦動画（9:16） - Ad2.webm */}
      <VerticalVideoSection
        videoUrl="/videos/Ad2.webm"
        title="See it in your space"
        subtitle="Get a feel for how our pieces look in real life."
        description="Our products are designed to blend seamlessly into your home. Watch how lighting and furniture come together to create a space you'll love."
      />

      {/* (5) Promotional Two Column - 統合されたプロモーションバナー */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <PromotionalTwoColumn videoUrl="/videos/top2.webm" />
      </div>

      {/* (6) New Arrivals - 商品密度の山2 */}
      {newArrivals.length > 0 && (
        <Section title="New Arrivals" showDivider>
          <ProductSlider products={newArrivals} variant="titleOnly" />
        </Section>
      )}
    </div>
  );
}
