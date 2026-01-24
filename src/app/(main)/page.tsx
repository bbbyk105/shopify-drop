import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import ProductSlider from "@/components/home/ProductSlider";
import ShopByRoom from "@/components/home/ShopByRoom";
import PromotionalTwoColumn from "@/components/home/PromotionalTwoColumn";
import Section from "@/components/home/Section";
import { products } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import type { Product as ShopifyProduct } from "@/lib/shopify/types";

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
  // ShopifyのAPIは新しい順（CREATED_AT DESC）で返すため、最初の8件が最新
  // 新しい商品が追加されると、9件目以降は表示されないため、古い商品から順に消える
  const newArrivals = allProducts.slice(0, 8);

  // Best Sellers: 「bestseller」系タグが付いている商品を最大8件
  const bestSellers = allProducts
    .filter((product) => {
      const tags: string[] =
        "tags" in product && Array.isArray((product as ShopifyProduct).tags)
          ? (product as ShopifyProduct).tags
          : [];
      return tags.some((tag) => {
        const lower = tag.toLowerCase();
        return [
          "bestseller",
          "best-seller",
          "best seller",
          "top-seller",
          "top seller",
        ].includes(lower);
      });
    })
    .slice(0, 8);

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
      <Section
        title="Featured Collection"
        subtitle="Discover our special curated collections"
        showDivider
      >
        <FeaturedCollections />
      </Section>

      {/* (5) Promotional Two Column - 統合されたプロモーションバナー */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <PromotionalTwoColumn />
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
