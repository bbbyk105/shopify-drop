"use client";

import Link from "next/link";
import { Search, Heart, ShoppingCart, Sun, Moon, Menu, X, HelpCircle, User, Phone, MessageCircle, Info, PenTool } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  // スクロール検知でheaderを表示/非表示
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // トップ付近では常に表示
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 下にスクロールしている時は非表示
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // 上にスクロールしている時は表示
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Desktop: Primary Header Bar */}
          <div className="hidden md:flex h-16 items-center justify-between gap-4">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center shrink-0 group">
              <span className="text-xl md:text-2xl font-semibold tracking-wide">
                <span className="text-[#E1F244] group-hover:text-[#E1F244]/80 transition-colors">EVIMERÍA</span>
                <span className={`${theme === "dark" ? "text-white" : "text-[#020B20]"} group-hover:opacity-80 transition-colors`}> home</span>
              </span>
            </Link>

            {/* Search Bar - Center (Desktop) */}
            <form onSubmit={handleSearch} className="flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products & help..."
                  className="w-full pr-9 bg-secondary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>

            {/* Utility Icons - Right */}
            <div className="flex items-center space-x-2 shrink-0">
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

              <Link href={"/account"}>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

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

          {/* Mobile: Header Bar */}
          <div className="md:hidden flex h-14 items-center justify-between relative px-2">
            {/* Hamburger Menu - Left */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="shrink-0 w-9 h-9"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </Button>

            {/* Logo - Center */}
            <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2 pointer-events-auto z-10 max-w-[calc(100%-180px)]">
              <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                <span className="text-[#E1F244]">EVIMERÍA</span>
                <span className={`${theme === "dark" ? "text-white" : "text-[#020B20]"}`}> home</span>
              </span>
            </Link>

            {/* Utility Icons - Right */}
            <div className="flex items-center space-x-0.5 shrink-0 ml-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="h-7 w-7 p-0 min-w-0"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4 text-foreground" />
                ) : (
                  <Sun className="h-4 w-4 text-foreground" />
                )}
              </Button>
              <Link href={"/account"}>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 min-w-0">
                  <User className="h-4 w-4 text-foreground" />
                </Button>
              </Link>
              <Link href={"/favorite"}>
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 min-w-0">
                  <Heart className="h-4 w-4 text-foreground" />
                </Button>
              </Link>
              <Link href={"/cart"} className="relative">
                <Button variant="ghost" size="icon" className="h-7 w-7 p-0 min-w-0 relative">
                  <ShoppingCart className="h-4 w-4 text-foreground" />
                  {cartCount > 0 && (
                    <span
                      className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ${
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

          {/* Mobile: Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products & help ..."
                  className="w-full pr-9 bg-secondary/50 border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Secondary Navigation Bar: Product Links (Desktop) */}
          <nav className="hidden md:flex items-center h-12 border-t border-border/40 space-x-6">
            <Link
              href="/new-arrivals"
              className="text-sm font-medium transition-colors hover:text-primary py-2"
            >
              New Arrivals
            </Link>
            <Link
              href="/lighting"
              className="text-sm font-medium transition-colors hover:text-primary py-2"
            >
              Lighting
            </Link>
            {hasSale && (
              <Link
                href="/sale"
                className="text-sm font-medium transition-colors hover:text-primary py-2"
              >
                Sale
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-background shadow-lg overflow-y-auto">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-foreground" />
              </Button>
              <div className="flex items-center space-x-2">
                <Link href={"/favorite"} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Heart className="h-5 w-5 text-foreground" />
                  </Button>
                </Link>
                <Link href={"/cart"} className="relative" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                    <ShoppingCart className="h-5 w-5 text-foreground" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="py-4">
              <Link
                href="/new-arrivals"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>New Arrivals</span>
              </Link>
              <Link
                href="/lighting"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Lighting</span>
              </Link>
              {hasSale && (
                <Link
                  href="/sale"
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Sale</span>
                </Link>
              )}

              {/* Separator */}
              <div className="border-t border-border/40 my-2" />

              {/* Utility Links */}
              <div
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors cursor-pointer"
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span>Toggle Theme</span>
              </div>
              <Link
                href="/account"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>My Account & Orders</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help Center</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Phone className="h-5 w-5" />
                <span>Contact us</span>
              </Link>
              <Link
                href="/tracking"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle className="h-5 w-5" />
                <span>Live chat with us</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Info className="h-5 w-5" />
                <span>About Evimeria</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
