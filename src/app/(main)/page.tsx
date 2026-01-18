import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import ProductSlider from "@/components/home/ProductSlider";
import ShopByRoom from "@/components/home/ShopByRoom";
import CustomizeForConnection from "@/components/home/CustomizeForConnection";
import FunInFunction from "@/components/home/FunInFunction";
import FreeDesignPlan from "@/components/home/FreeDesignPlan";
import PromotionalTwoColumn from "@/components/home/PromotionalTwoColumn";
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
        {/* Hero */}
        <div className="container mx-auto px-4 pt-8 pb-0">
          <Hero />
        </div>

        {/* Featured Collections */}
        <div className="mb-12 lg:mb-16 border-t pt-12 lg:pt-16">
          <div className="container mx-auto px-4">
            <FeaturedCollections />
          </div>
        </div>
    
        {/* Shop By Room */}
        <ShopByRoom />
    
        {/* Promotional Two-Column Layout */}
        <PromotionalTwoColumn />
    
        
    
        {/* ストーリー枠（連続させない） */}
        <div className="container mx-auto px-4">
          <FunInFunction />
        </div>
    
        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <section className="py-12 lg:py-16 mb-12 lg:mb-16 border-t">
            <div className="container mx-auto px-4">
              <div className="mb-8 lg:mb-12">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                  New Arrivals
                </h2>
              </div>
              <ProductSlider products={newArrivals} variant="titleOnly" />
            </div>
          </section>
        )}
    
        {/* もう1枚ストーリーを入れるならここ（任意） */}
        <div className="container mx-auto px-4">
          <CustomizeForConnection />
        </div>
    
        {/* 最後に強いCTA（下に置く） */}
        <div className="container mx-auto px-4">
          <FreeDesignPlan />
        </div>
      </div>
    );
    
}
