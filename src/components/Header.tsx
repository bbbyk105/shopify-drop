"use client";

import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  Menu,
  X,
  HelpCircle,
  Phone,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PromoBar from "@/components/PromoBar";
import { useState, useEffect } from "react";
import { useCart } from "@/hooks/useCart";
interface HeaderProps {
  hasSale?: boolean;
}

export default function Header({ hasSale = true }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isMenuSlideIn, setIsMenuSlideIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const cart = useCart((state) => state.cart);
  const [cartCount, setCartCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // カート数量を常に最新の状態に保つ
  const currentCartCount = cart?.totalQuantity || 0;

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

  // ハンバーガーメニューが開いている時、背景のスクロールを無効化
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // 開く時: マウント後にスライドインを発火
  useEffect(() => {
    if (isMobileMenuOpen && !isMenuClosing) {
      const id = requestAnimationFrame(() => setIsMenuSlideIn(true));
      return () => cancelAnimationFrame(id);
    }
    if (!isMobileMenuOpen) {
      setIsMenuSlideIn(false);
    }
  }, [isMobileMenuOpen, isMenuClosing]);

  const closeMobileMenu = () => {
    setIsMenuClosing(true);
    setIsMenuSlideIn(false);
    setTimeout(() => {
      setIsMobileMenuOpen(false);
      setIsMenuClosing(false);
    }, 300);
  };

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
                <span className="text-[#E1F244] group-hover:text-[#E1F244]/80 transition-colors">
                  EVIMERÍA
                </span>
                <span className="text-[#020B20] group-hover:opacity-80 transition-colors">
                  {" "}
                  home
                </span>
              </span>
            </Link>

            {/* Utility Icons - Right */}
            <div className="flex items-center space-x-2 shrink-0">
              <Link href={"/favorite"}>
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href={"/cart"} className="relative">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span
                    className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ${
                      isAnimating ? "animate-bounce scale-125" : "scale-100"
                    } transition-transform duration-300 ${currentCartCount === 0 ? "opacity-50" : ""}`}
                  >
                    {currentCartCount > 99 ? "99+" : currentCartCount}
                  </span>
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
            <Link
              href="/"
              className="flex items-center absolute left-1/2 -translate-x-1/2 pointer-events-auto z-10 max-w-[calc(100%-180px)]"
            >
              <span className="text-xs font-semibold tracking-tight whitespace-nowrap">
                <span className="text-[#E1F244]">EVIMERÍA</span>
                <span className="text-[#020B20]">
                  {" "}
                  home
                </span>
              </span>
            </Link>

            {/* Utility Icons - Right */}
            <div className="flex items-center space-x-0.5 shrink-0 ml-auto">
              <Link href={"/favorite"}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0 min-w-0"
                >
                  <Heart className="h-4 w-4 text-foreground" />
                </Button>
              </Link>
              <Link href={"/cart"} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0 min-w-0 relative"
                >
                  <ShoppingCart className="h-4 w-4 text-foreground" />
                  <span
                    className={`absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ${
                      isAnimating ? "animate-bounce scale-125" : "scale-100"
                    } transition-transform duration-300 ${currentCartCount === 0 ? "opacity-50" : ""}`}
                  >
                    {currentCartCount > 99 ? "99+" : currentCartCount}
                  </span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Secondary Navigation Bar: ProductsListのcategoryFilters順に合わせる */}
          <nav className="hidden md:flex items-center h-12 border-t border-border/40 space-x-6 overflow-x-auto">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              All Products
            </Link>
            <Link
              href="/new-arrivals"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              New Arrivals
            </Link>
            <Link
              href="/rooms/living-room"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Living Room
            </Link>
            <Link
              href="/rooms/bedroom"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Bedroom
            </Link>
            <Link
              href="/lighting"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Lighting
            </Link>
            <Link
              href="/rooms/dining-room-kitchen"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Dining Room & Kitchen
            </Link>
            <Link
              href="/rooms/outdoor"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Outdoor
            </Link>
            <Link
              href="/rooms/home-office"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Home Office
            </Link>
            <Link
              href="/rooms/entryway"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Entryway
            </Link>
            <Link
              href="/clothing"
              className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
            >
              Clothing
            </Link>
            {hasSale && (
              <Link
                href="/sale"
                className="text-sm font-medium transition-colors hover:text-primary py-2 whitespace-nowrap"
              >
                Sale
              </Link>
            )}
          </nav>
        </div>
        <PromoBar />
      </header>

      {/* Mobile Sidebar Menu */}
      {(isMobileMenuOpen || isMenuClosing) && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ease-out ${
              isMenuSlideIn ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeMobileMenu}
          />
          {/* Sidebar - 左からスライドイン */}
          <div
            className={`absolute left-0 top-0 h-full w-80 bg-background shadow-lg overflow-y-auto transition-transform duration-300 ease-out ${
              isMenuSlideIn ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-14 px-4 border-b border-border/40">
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X className="h-5 w-5 text-foreground" />
              </Button>
              <div className="flex items-center space-x-2">
                <Link href={"/favorite"} onClick={closeMobileMenu}>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Heart className="h-5 w-5 text-foreground" />
                  </Button>
                </Link>
                <Link
                  href={"/cart"}
                  className="relative"
                  onClick={closeMobileMenu}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 relative"
                  >
                    <ShoppingCart className="h-5 w-5 text-foreground" />
                    <span
                      className={`absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground ${currentCartCount === 0 ? "opacity-50" : ""}`}
                    >
                      {currentCartCount > 99 ? "99+" : currentCartCount}
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Navigation Links: ProductsListのcategoryFilters順に合わせる */}
            <nav className="py-4">
              <Link
                href="/"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Home</span>
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>All Products</span>
              </Link>
              <Link
                href="/new-arrivals"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>New Arrivals</span>
              </Link>
              <Link
                href="/rooms/living-room"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Living Room</span>
              </Link>
              <Link
                href="/rooms/bedroom"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Bedroom</span>
              </Link>
              <Link
                href="/lighting"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Lighting</span>
              </Link>
              <Link
                href="/rooms/dining-room-kitchen"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Dining Room & Kitchen</span>
              </Link>
              <Link
                href="/rooms/outdoor"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Outdoor</span>
              </Link>
              <Link
                href="/rooms/home-office"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Home Office</span>
              </Link>
              <Link
                href="/rooms/entryway"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Entryway</span>
              </Link>
              <Link
                href="/clothing"
                className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <span>Clothing</span>
              </Link>
              {hasSale && (
                <Link
                  href="/sale"
                  className="flex items-center justify-between px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                  onClick={closeMobileMenu}
                >
                  <span>Sale</span>
                </Link>
              )}

              {/* Separator */}
              <div className="border-t border-border/40 my-2" />

              {/* Utility Links */}
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <HelpCircle className="h-5 w-5" />
                <span>Help Center</span>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
              >
                <Phone className="h-5 w-5" />
                <span>Contact us</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium text-foreground hover:bg-secondary/50 transition-colors"
                onClick={closeMobileMenu}
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
