// app/products/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    notFound();
  }

  const images = product.images || [product.image];
  const relatedProducts = getRelatedProducts(product.id);

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`);
    alert(`Added ${quantity} ${product.name} to your cart!`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Lighting
            </Link>
          </li>
          <li>/</li>
          <li>
            <a
              href="/table-lamps"
              className="hover:text-foreground transition-colors"
            >
              Table Lamps
            </a>
          </li>
          <li>/</li>
          <li className="text-foreground">Elegance Lamp</li>
        </ol>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        {/* Images - Left Side */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
            <Image
              src={images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-secondary border-2 transition-colors ${
                    selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-muted-foreground"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info - Right Side (Sticky on desktop) */}
        <div className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.details
                  ? `The ${product.name} is a statement piece, designed to elevate any room with its sophisticated presence. Crafted with meticulous attention to detail, this lamp features a sleek, modern silhouette that seamlessly blends with both contemporary and classic interiors. Its soft, ambient light creates a warm and inviting atmosphere, perfect for reading, relaxing, or entertaining.`
                  : product.description}
              </p>
            </div>

            {/* Product Details */}
            {product.details && (
              <div className="border-t border-b border-border py-6">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <div className="space-y-3">
                  {product.details.material && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Material</span>
                      <span className="font-medium">
                        {product.details.material}
                      </span>
                    </div>
                  )}
                  {product.details.dimensions && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dimensions</span>
                      <span className="font-medium">
                        {product.details.dimensions}
                      </span>
                    </div>
                  )}
                  {product.details.designer && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Designer</span>
                      <span className="font-medium">
                        {product.details.designer}
                      </span>
                    </div>
                  )}
                  {product.details.bulbType && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bulb Type</span>
                      <span className="font-medium">
                        {product.details.bulbType}
                      </span>
                    </div>
                  )}
                  {product.details.wattage && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Wattage</span>
                      <span className="font-medium">
                        {product.details.wattage}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Price and Add to Cart */}
            <div className="space-y-4">
              <div className="text-3xl font-bold">
                {formatPrice(product.price)}
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full text-base h-12"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Related Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard key={relatedProduct.id} product={relatedProduct} />
          ))}
        </div>
      </section>
    </div>
  );
}
