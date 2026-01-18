"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl mb-8 lg:mb-12 shadow-xl">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/top.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Create your perfect space.
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl">
            Discover timeless designs that transform your home into a sanctuary
            of style and comfort.
          </p>
          <Link href="/rooms/bedroom">
            <Button
              size="lg"
              className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-none"
            >
              SHOP BEDROOM
            </Button>
          </Link>
        </div>
      </div>
      
      {/* 下方向の視覚ヒント */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
