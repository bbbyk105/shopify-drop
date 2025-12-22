import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import ImageGrid from "@/components/ImageGrid";
import FeaturedProduct from "@/components/FeaturedProduct";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import { products, collections } from "@/lib/products";
import { getAllProducts } from "@/lib/shopify/queries/products";
import BrandStory from "@/components/BrandStory";

export default async function HomePage() {
  // Shopifyから商品を取得（フォールバックとしてローカル商品も使用）
  let shopifyProducts = [];
  try {
    shopifyProducts = await getAllProducts(20);
  } catch (error) {
    console.error("Failed to fetch Shopify products:", error);
  }

  // Shopify商品があればそれを使用、なければローカル商品を使用
  const allProducts = shopifyProducts.length > 0 ? shopifyProducts : products;
  const newArrivals = allProducts.slice(0, 3);
  const bestSellers = allProducts.slice(3, 6);

  return (
    <div className="container mx-auto px-4 py-8">
      <Hero />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* New Arrivals */}
      <section className="py-12 lg:py-16 mb-12 lg:mb-16">
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            New Arrivals
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Discover our latest collection of premium home essentials
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

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
      <section className="py-12 lg:py-16 border-t">
        <div className="mb-8 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
            Best Sellers
          </h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Our most loved products, handpicked for you
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
