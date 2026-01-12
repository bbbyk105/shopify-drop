"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface GridImage {
  id: number;
  src: string;
  alt: string;
  parallaxSpeed: number;
  delay: number;
}

export default function ImageGrid() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const images: GridImage[] = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?w=800&h=600&fit=crop&q=80",
      alt: "Modern minimalist decor",
      parallaxSpeed: 0.5,
      delay: 0,
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop&q=80",
      alt: "Cozy bedroom with ocean view",
      parallaxSpeed: -0.3,
      delay: 0.1,
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80",
      alt: "Wooden furniture detail",
      parallaxSpeed: 0.6,
      delay: 0.2,
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&h=600&fit=crop&q=80",
      alt: "Bedroom interior design",
      parallaxSpeed: -0.4,
      delay: 0.15,
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=600&fit=crop&q=80",
      alt: "Golden elegant lamp",
      parallaxSpeed: 0.35,
      delay: 0.25,
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=600&fit=crop&q=80",
      alt: "Modern ambient lighting",
      parallaxSpeed: -0.25,
      delay: 0.3,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

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

  const getImageTransform = (image: GridImage, index: number) => {
    const adjustedProgress = Math.max(0, scrollProgress - image.delay);
    const baseOffset = (adjustedProgress - 0.5) * 150;
    const offset = baseOffset * image.parallaxSpeed;

    const wave = Math.sin(adjustedProgress * Math.PI * 2) * 20;
    const isEven = index % 2 === 0;
    const horizontalOffset = isEven ? wave : -wave;

    const rotation = offset * 0.03;
    const scale = 0.95 + adjustedProgress * 0.1;

    const opacity = Math.max(0.3, Math.min(1, adjustedProgress * 1.5));

    return {
      transform: `
        translateY(${offset}px) 
        translateX(${horizontalOffset}px) 
        rotate(${rotation}deg) 
        scale(${scale})
      `,
      opacity: opacity,
      transition:
        hoveredId === image.id
          ? "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease-out"
          : "transform 0.1s linear, opacity 0.3s ease-out",
    };
  };

  const textTransform = {
    opacity: Math.max(0, Math.min(1, scrollProgress * 2)),
    transform: `translateX(${(1 - scrollProgress) * -80}px)`,
    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
  };

  return (
    <section ref={sectionRef} className="bg-muted/30 py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-4" style={textTransform}>
            <h2 className="text-4xl md:text-5xl font-bold">Our Best Sellers</h2>
            <p className="text-lg text-muted-foreground">
              Checkout what retailers from around the world are favoring on
              keystone
            </p>
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-4/3 rounded-lg bg-secondary cursor-pointer"
                  style={getImageTransform(image, index)}
                  onMouseEnter={() => setHoveredId(image.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-lg shadow-xl">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-linear-to-t from-black/40 to-transparent transition-opacity duration-500 ${
                        hoveredId === image.id ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
