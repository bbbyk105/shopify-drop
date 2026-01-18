"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl mb-12 lg:mb-16 shadow-xl">
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
            Trend proof your space.
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl">
            Even in 2036, you&apos;ll still be sleeping easy knowing you&apos;ve
            created a timeless oasis.
          </p>
          <Link href="/products/evergreen-bedroom">
            <Button
              size="lg"
              className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-none"
            >
              SHOP EVERGREEN BEDROOM
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
