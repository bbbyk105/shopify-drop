"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function FeaturedProduct() {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const product = {
    id: "featured-1",
    name: "Elegance Table Lamp",
    price: 14800,
    rating: 4.5,
    reviewCount: 4,
    description:
      "The Elegance Table Lamp is crafted from premium materials with meticulous attention to detail. Featuring a sleek, modern silhouette, sophisticated finish, timeless design, and warm ambient lighting. Pair it with our Classic Collection for a cohesive look or the Modernist Collection for contemporary contrast.",
    images: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1550985543-f47f38aeee65?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=800&h=1000&fit=crop",
    ],
    colors: [
      {
        name: "BLACK",
        value: "#1a1a1a",
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop",
      },
    ],
    slug: "noir-elegance",
  };

  const totalImages = product.images.length;

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + totalImages) % totalImages);
  };

  const handleAddToCart = () => {
    console.log(`Added ${quantity} items to cart`);
    alert(`Added ${quantity} ${product.name} to your cart!`);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Navigation */}
            <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.images[currentImage]}
                alt={`${product.name} - Image ${currentImage + 1}`}
                fill
                className="object-cover"
                priority
              />

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors rounded-full p-2"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors rounded-full p-2"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
                {currentImage + 1} / {totalImages}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative aspect-square overflow-hidden rounded-lg bg-muted border-2 transition-all ${
                    currentImage === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-muted-foreground/30"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6 lg:sticky lg:top-24">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {product.name}
              </h1>

              {/* Price and Rating */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-3xl font-bold">
                  ¥{formatPrice(product.price)}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : i < product.rating
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "fill-muted text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.reviewCount} reviews
                  </span>
                </div>
              </div>

              <div className="h-px bg-border mb-6" />

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="h-px bg-border mb-6" />
            </div>

            {/* Color Selection */}
            <div>
              <div className="mb-3">
                <span className="font-semibold">COLOR:</span>{" "}
                <span className="text-muted-foreground">
                  {product.colors[0].name}
                </span>
              </div>
              <div className="flex gap-3">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-foreground ring-2 ring-offset-2 ring-foreground"
                  >
                    <Image
                      src={color.image}
                      alt={color.name}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="px-4 py-3 hover:bg-muted transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="px-6 py-3 min-w-[60px] text-center font-medium">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    className="px-4 py-3 hover:bg-muted transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 h-auto py-3 text-base font-semibold"
                >
                  ADD TO CART
                </Button>
              </div>

              {/* Buy Now Button */}
              <Button
                size="lg"
                className="w-full h-auto py-3 text-base font-semibold bg-[#5469d4] hover:bg-[#5469d4]/90"
              >
                Buy with ShopPay
              </Button>

              {/* More Payment Options */}
              <div className="text-center">
                <button className="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
                  More payment options
                </button>
              </div>
            </div>

            {/* View Details Link */}
            <div className="pt-4">
              <Link
                href={`/products/${product.slug}`}
                className="inline-block text-sm font-semibold border-b-2 border-foreground hover:border-muted-foreground transition-colors pb-1"
              >
                VIEW DETAILS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
