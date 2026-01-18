import Link from "next/link";
import Image from "next/image";

export default function PromotionalTwoColumn() {
  return (
    <section className="py-12 lg:py-16 mb-12 lg:mb-16 border-t">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* Left: Ottomans & Poufs */}
          <Link href="/furniture" className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
            <Image
              src="/images/living_room.webp"
              alt="Ottomans & Poufs"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-start items-start p-6 lg:p-8 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                Put the &apos;fun&apos; in function.
              </h2>
              <p className="text-base md:text-lg lg:text-xl mb-6 max-w-md">
                Kick your feet up, grab a seat, or use it as a makeshift table — it all feels good.
              </p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
                SHOP OTTOMANS & POUFS
              </button>
            </div>
          </Link>

          {/* Right: Lighting */}
          <Link href="/lighting" className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-lg">
            <Image
              src="/images/home_office.webp"
              alt="Lighting"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col justify-start items-start p-6 lg:p-8 text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                Shining personality.
              </h2>
              <p className="text-base md:text-lg lg:text-xl mb-6 max-w-md">
                Lamps are a subtle way to put your stamp on any room.
              </p>
              <button className="px-6 py-3 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
                SHOP LIGHTING
              </button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
