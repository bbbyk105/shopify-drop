"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { featuredCollections } from "@/config/featuredCollections";

export default function FeaturedCollections() {
  const minelight = featuredCollections.find((c) => c.id === "minelight");

  if (!minelight) {
    return null;
  }

  return (
    <>
      <FeaturedCollectionCard collection={minelight} />
    </>
  );
}

interface FeaturedCollectionCardProps {
  collection: (typeof featuredCollections)[0];
}

function FeaturedCollectionCard({ collection }: FeaturedCollectionCardProps) {
  return (
    <Link
      href={collection.href}
      target="_blank"
      rel="noreferrer"
      className="group cursor-pointer block"
    >
      <div className="flex flex-col md:flex-row gap-6 border border-border rounded-lg bg-card shadow-sm overflow-hidden">
        {/* Left: Image - 小さめで横長 */}
        <div className="relative w-full md:w-64 lg:w-80 h-48 md:h-auto md:min-h-[200px] shrink-0 overflow-hidden bg-secondary rounded-l-lg">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-cover"
            priority={false}
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
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              {collection.title}
            </h3>
            <p className="text-sm md:text-base text-muted-foreground mb-6">
              {collection.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto" size="default" type="button">
              Explore MineLight
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
