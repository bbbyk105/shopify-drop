"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden min-h-[420px] sm:min-h-[480px] md:min-h-[620px]">
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

      {/* テキストブロック（中央配置） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="mx-auto w-full max-w-3xl px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-white">
            Create your perfect space.
          </h1>
          <p className="mt-4 text-base md:text-lg leading-relaxed text-white/90">
            Discover timeless designs that transform your home into a sanctuary
            of style and comfort.
          </p>
          <div className="mt-8">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white rounded-full px-6 py-3 text-sm font-semibold"
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
