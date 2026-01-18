import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function FreeDesignPlan() {
  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl mb-12 lg:mb-16">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop"
          alt="Design plan"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Get a free design plan.
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl">
            Complete a short form to get your custom design.
          </p>
          <Link href="/design-plan">
            <Button
              size="lg"
              className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-8 py-6 text-base md:text-lg font-semibold rounded-none"
            >
              GET STARTED
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
