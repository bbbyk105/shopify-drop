import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CustomizeForConnection() {
  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl mb-12 lg:mb-16">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop"
          alt="Modular seating"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Customize for connection.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl">
            Easy, modular styles that adapt to your social calendar.
          </p>
          <Link href="/products/modular-seating">
            <Button
              size="lg"
              className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-none"
            >
              SHOP MODULAR SEATING
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
