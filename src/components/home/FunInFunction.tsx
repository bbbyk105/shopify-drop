import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FunInFunction() {
  return (
    <section>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Put the 'fun' in function */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=800&fit=crop"
                alt="Ottomans and poufs"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container relative mx-auto px-4 h-full flex items-center">
              <div className="max-w-xl space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Put the &apos;fun&apos; in function.
                </h2>
                <p className="text-base md:text-lg text-white/90 max-w-lg">
                  Kick your feet up, grab a seat, or use it as a makeshift table —
                  it all feels good.
                </p>
                <Link href="/products/ottomans-poufs">
                  <Button
                    size="lg"
                    className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-none"
                  >
                    SHOP OTTOMANS & POUFS
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Shining personality */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop"
                alt="Lighting with personality"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            <div className="container relative mx-auto px-4 h-full flex items-center">
              <div className="max-w-xl space-y-6">
                <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                  Shining personality.
                </h2>
                <p className="text-base md:text-lg text-white/90 max-w-lg">
                  Lamps are a subtle way to put your stamp on any room.
                </p>
                <Link href="/lighting">
                  <Button
                    size="lg"
                    className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-none"
                  >
                    SHOP LIGHTING
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
