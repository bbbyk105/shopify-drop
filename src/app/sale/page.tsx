import { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sale - Lumina Luxe",
  description: "Discover amazing deals on premium lighting and home decor.",
};

export default function SalePage() {
  // セール商品（実際には割引情報を含む）
  const saleProducts = products.map((product) => ({
    ...product,
    originalPrice: product.price * 1.3,
    discount: 30,
  }));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-red-900/20 to-orange-900/20 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              LIMITED TIME OFFER
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              End of Season Sale
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Up to 30% off on selected items. Elevate your space with premium
              lighting at unbeatable prices.
            </p>
            <div className="flex gap-4 text-center">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 min-w-20">
                <div className="text-3xl font-bold">02</div>
                <div className="text-sm text-muted-foreground">Days</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 min-w-20">
                <div className="text-3xl font-bold">14</div>
                <div className="text-sm text-muted-foreground">Hours</div>
              </div>
              <div className="bg-background/80 backdrop-blur-sm rounded-lg p-4 min-w-20">
                <div className="text-3xl font-bold">35</div>
                <div className="text-sm text-muted-foreground">Minutes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sale Items</h2>
            <p className="text-muted-foreground">
              {saleProducts.length} products on sale
            </p>
          </div>
          <select className="bg-secondary border border-border rounded-md px-4 py-2">
            <option>Sort by: Featured</option>
            <option>Discount: High to Low</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {saleProducts.map((product) => (
            <div key={product.id} className="relative">
              <div className="absolute top-4 right-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                -{product.discount}%
              </div>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
