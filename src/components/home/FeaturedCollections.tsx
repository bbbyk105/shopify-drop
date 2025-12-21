"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { featuredCollections } from "@/config/featuredCollections";
import { useState } from "react";

export default function FeaturedCollections() {
  const minelight = featuredCollections.find((c) => c.id === "minelight");

  if (!minelight) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Featured Collection</h2>
        <p className="text-muted-foreground">
          Discover our special curated collections
        </p>
      </div>
      <FeaturedCollectionCard collection={minelight} />
    </section>
  );
}

interface FeaturedCollectionCardProps {
  collection: (typeof featuredCollections)[0];
}

function FeaturedCollectionCard({ collection }: FeaturedCollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // ボタンがクリックされた場合は親のクリックイベントを無視
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }
    router.push(collection.href);
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <div className="flex flex-col md:flex-row gap-6 border border-border rounded-lg bg-card shadow-sm transition-all hover:shadow-md overflow-hidden">
        {/* Left: Image - 小さめで横長 */}
        <div className="relative w-full md:w-64 lg:w-80 h-48 md:h-auto md:min-h-[200px] shrink-0 overflow-hidden bg-secondary rounded-l-lg">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className={`object-cover transition-transform duration-500 ease-in-out ${
              isHovered ? "scale-110" : "scale-100"
            }`}
            style={{ willChange: "transform" }}
            priority={false}
          />
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ease-in-out pointer-events-none ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
          {/* Badge */}
          {collection.badge && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center rounded-full bg-background px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                {collection.badge}
              </span>
            </div>
          )}
        </div>

        {/* Right: Content */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
              {collection.subtitle}
            </p>
            <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
              {collection.title}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              {collection.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={collection.href} onClick={(e) => e.stopPropagation()}>
              <Button className="w-full sm:w-auto" size="default">
                Explore MineLight
              </Button>
            </Link>
            <Link href="/lighting" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                size="default"
              >
                View Lighting
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
