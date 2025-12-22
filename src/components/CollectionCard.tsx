"use client";

import Image from "next/image";
import Link from "next/link";
import { Collection } from "@/types";
import { useState } from "react";

interface CollectionCardProps {
  collection: Collection;
}

export default function CollectionCard({ collection }: CollectionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/collections/${collection.id}`}>
      <div
        className="group cursor-pointer space-y-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-secondary/30 mb-4 shadow-lg group-hover:shadow-xl transition-all">
          <Image
            src={collection.image}
            alt={collection.name}
            fill
            className={`object-cover transition-transform duration-500 ${
              isHovered ? "scale-110" : "scale-100"
            }`}
          />
          <div
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-70"
            }`}
          />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-primary transition-colors leading-tight">
            {collection.name}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {collection.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
