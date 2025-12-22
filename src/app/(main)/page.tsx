import Hero from "@/components/Hero";
import CollectionCard from "@/components/CollectionCard";
import ImageGrid from "@/components/ImageGrid";
import FeaturedProduct from "@/components/FeaturedProduct";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import ProductSlider from "@/components/home/ProductSlider";
import { products, collections } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import BrandStory from "@/components/BrandStory";

export default async function HomePage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts: any[] = [];
  try {
    shopifyProducts = await getAllProducts(20);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;
  // New Arrivals: 最新商品として最大8件まで表示（取得順を新しい順とみなす）
  const newArrivals = allProducts.slice(0, 8);

  // Best Sellers: 「bestseller」系タグが付いている商品を最大8件
  const bestSellers = allProducts
    .filter((product: any) => {
      const tags: string[] = Array.isArray(product.tags) ? product.tags : [];
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
    <div className="container mx-auto px-4 py-8">
      <Hero />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-12 lg:py-16 mb-12 lg:mb-16">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              New Arrivals
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Discover our latest collection of premium home essentials
            </p>
          </div>
          <ProductSlider products={newArrivals} />
        </section>
      )}

      <div className="mb-12 lg:mb-16">
        <ImageGrid />
      </div>

      {/* Featured Product */}
      <div className="mb-12 lg:mb-16">
        <FeaturedProduct />
      </div>

      {/* Featured Collections */}
      <section className="py-12 lg:py-16 mb-12 lg:mb-16 border-t">
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            Featured Collections
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Explore curated collections designed for your home
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <div className="mb-12 lg:mb-16 border-t pt-12 lg:pt-16">
        <BrandStory />
      </div>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-12 lg:py-16 border-t">
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
              Best Sellers
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Our most loved products, handpicked for you
            </p>
          </div>
          <ProductSlider products={bestSellers} />
        </section>
      )}
    </div>
  );
}
