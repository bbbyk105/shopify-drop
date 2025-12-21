import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import CollectionCard from "@/components/CollectionCard";
import ImageGrid from "@/components/ImageGrid";
import FeaturedProduct from "@/components/FeaturedProduct";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import { products, collections } from "@/lib/products";
import BrandStory from "@/components/BrandStory";

export default function HomePage() {
  const newArrivals = products.slice(0, 3);
  const bestSellers = products.slice(0, 3);

  return (
    <div>
      <Hero />

      {/* Featured Collections */}
      <FeaturedCollections />

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">New Arrivals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <ImageGrid />
      {/* Featured Product */}
      <FeaturedProduct />

      {/* Featured Collections */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Featured Collections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </section>

      <BrandStory />

      {/* Best Sellers */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Best Sellers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
