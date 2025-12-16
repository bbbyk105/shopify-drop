"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={"/logos/transparent.png"}
              alt="logo"
              width={120}
              height={120}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/new-arrivals"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              New Arrivals
            </Link>
            <Link
              href="/lighting"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Lighting
            </Link>
            <Link
              href="/furniture"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Furniture
            </Link>
            <Link
              href="/decor"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Decor
            </Link>
            <Link
              href="/sale"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sale
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          {/* Search and Icons */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden lg:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="w-64 pl-9 bg-secondary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            <Link href={"/favorite"}>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={"/cart"}>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
