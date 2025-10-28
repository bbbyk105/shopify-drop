"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export default function BrandStory() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // より広い範囲でパララックス効果を適用
      const start = rect.top - windowHeight * 1.2;
      const end = rect.bottom + windowHeight * 0.2;
      const total = end - start;
      const current = -start;
      const progress = Math.max(0, Math.min(1, current / total));

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // より大きな移動量
  const leftImageTransform = `translateX(${
    (scrollProgress - 0.5) * -120
  }px) translateY(${(scrollProgress - 0.5) * 60}px) scale(${
    0.95 + scrollProgress * 0.1
  })`;

  const rightImageTransform = `translateX(${
    (scrollProgress - 0.5) * 120
  }px) translateY(${(scrollProgress - 0.5) * -60}px) scale(${
    0.95 + scrollProgress * 0.1
  })`;

  const opacity = Math.max(0, Math.min(1, (scrollProgress - 0.1) * 1.5));

  return (
    <section ref={sectionRef} className="bg-background py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Overlapping Images with Advanced Parallax */}
          <div className="relative h-[600px] lg:h-[700px]">
            {/* Left Image */}
            <div
              className="absolute left-0 top-0 w-[55%] z-10"
              style={{
                transform: leftImageTransform,
                opacity: opacity,
                transition: "transform 0.05s linear, opacity 0.3s ease-out",
              }}
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=1000&fit=crop"
                  alt="Elegant lighting design"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Right Image */}
            <div
              className="absolute right-0 top-[15%] w-[60%] z-20"
              style={{
                transform: rightImageTransform,
                opacity: opacity,
                transition: "transform 0.05s linear, opacity 0.3s ease-out",
              }}
            >
              <div className="relative aspect-3/4 overflow-hidden rounded-lg bg-secondary shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=1000&fit=crop"
                  alt="Premium lamp details"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Decorative Element */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 100%)",
                opacity: scrollProgress * 0.3,
              }}
            />
          </div>

          {/* Right: Text Content */}
          <div
            className="space-y-6 lg:pl-8"
            style={{
              opacity: opacity,
              transform: `translateY(${(1 - opacity) * 30}px)`,
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
            }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              WE&apos;VE{" "}
              <span className="bg-foreground text-background px-3 py-1 inline-block">
                REDEFINED
              </span>{" "}
              THE WAY TO ILLUMINATE YOUR SPACE
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              Our collection of sleek, high-performance lighting embodies a
              perfect synergy of advanced LED technology, premium materials, and
              contemporary design. Crafted with precision and attention to
              detail, each lamp is a testament to our commitment to providing
              design-conscious individuals with illumination that not only
              complements their sophisticated lifestyle but also elevates it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
