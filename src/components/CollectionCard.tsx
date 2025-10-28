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
        className="group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-4/3 overflow-hidden rounded-lg bg-secondary mb-4">
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
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {collection.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {collection.description}
        </p>
      </div>
    </Link>
  );
}
