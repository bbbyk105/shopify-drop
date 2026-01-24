"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[500px] sm:min-h-[600px] md:min-h-[700px] lg:min-h-[800px]">
      {/* 背景メディア */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/videos/top.mp4" type="video/mp4" />
        </video>
        {/* オーバーレイ（既存の色を維持） */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
      </div>

      {/* テキストブロック（PC: 左寄り、SP: 中央） */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start">
        <div className="mx-auto md:mx-0 w-full max-w-4xl px-6 md:pl-12 lg:pl-16 xl:pl-24 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-white leading-[1.1]">
            Create your perfect space.
          </h1>
          <p className="mt-6 md:mt-8 text-lg md:text-xl lg:text-2xl leading-relaxed text-white/90 max-w-2xl md:max-w-xl">
            Discover timeless designs that transform your home into a sanctuary
            of style and comfort.
          </p>
          <div className="mt-10 md:mt-12">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white rounded-full px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-semibold transition-colors"
              >
                SHOP ALL PRODUCTS
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
