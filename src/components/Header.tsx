"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import { useTheme } from "@/components/ThemeProvider";

interface HeaderProps {
  hasSale?: boolean;
}

export default function Header({ hasSale = true }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const cart = useCart((state) => state.cart);
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  // カート数量の監視とアニメーション
  useEffect(() => {
    const newCount = cart?.totalQuantity || 0;
    if (newCount > cartCount && cartCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
    setCartCount(newCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.totalQuantity]);

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
            {hasSale && (
            <Link
              href="/sale"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Sale
            </Link>
            )}
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

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            <Link href={"/favorite"}>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Link href={"/cart"} className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ${
                      isAnimating ? "animate-bounce scale-125" : "scale-100"
                    } transition-transform duration-300`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
