import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Furniture Collection - Lumina Luxe",
  description:
    "Explore our curated furniture collection designed to complement your space.",
};

export default function FurniturePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=1000&fit=crop"
          alt="Furniture Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/40" />
        <div className="container relative mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Furniture Collection
            </h1>
            <p className="text-xl mb-8">
              Coming Soon. Discover timeless pieces that blend form and function
              seamlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Coming Soon</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re carefully curating a stunning collection of contemporary
            furniture pieces. Stay tuned for elegant sofas, tables, chairs, and
            storage solutions that will transform your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-md bg-secondary border border-border"
            />
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Notify Me
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
