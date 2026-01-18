"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo */}
        <Link href="/" className="inline-block mb-8 group">
          <span className="text-3xl md:text-4xl font-semibold tracking-wide">
            <span className="text-[#E1F244] group-hover:text-[#E1F244]/80 transition-colors">
              EVIMERÍA
            </span>
            <span className="text-[#020B20] dark:text-white group-hover:opacity-80 transition-colors">
              {" "}home
            </span>
          </span>
        </Link>

        {/* 404 Error */}
        <div className="space-y-4">
          <h1 className="text-8xl md:text-9xl font-bold text-primary/20 dark:text-primary/10">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Additional Links */}
        <div className="pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground mb-4">
            You might be looking for:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/products"
              className="text-primary hover:underline transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/lighting"
              className="text-primary hover:underline transition-colors"
            >
              Lighting
            </Link>
            <Link
              href="/rooms/living-room"
              className="text-primary hover:underline transition-colors"
            >
              Living Room
            </Link>
            <Link
              href="/rooms/bedroom"
              className="text-primary hover:underline transition-colors"
            >
              Bedroom
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
