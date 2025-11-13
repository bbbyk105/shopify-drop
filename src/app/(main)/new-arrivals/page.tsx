import { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "New Arrivals - Lumina Luxe",
  description:
    "Discover our latest collection of elegant lighting solutions and home decor.",
};

export default function NewArrivalsPage() {
  // 最新の商品を表示（実際にはデータベースから取得）
  const newProducts = products;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              New Arrivals
            </h1>
            <p className="text-xl text-muted-foreground">
              Explore our latest collection of contemporary lighting designs.
              Each piece is carefully curated to bring elegance and
              sophistication to your space.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <p className="text-muted-foreground">
            Showing {newProducts.length} products
          </p>
          <select className="bg-secondary border border-border rounded-md px-4 py-2">
            <option>Sort by: Latest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Name: A to Z</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
