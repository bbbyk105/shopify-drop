import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function PromotionalTwoColumn() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-0">
        {/* 左側: テキストとボタン */}
        <div className="relative h-[250px] md:h-[300px] lg:h-[350px] flex items-center">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop"
              alt="Design consultation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative w-full px-4 lg:px-8 xl:px-12">
            <div className="max-w-xl space-y-3 md:space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                Get a free design plan.
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-white/90 max-w-lg">
                Complete a short form to get your custom design.
              </p>
              <Link href="/design-plan">
                <Button
                  size="lg"
                  className="bg-[#8B6F47] hover:bg-[#7A5F3A] text-white px-6 py-4 md:px-8 md:py-6 text-sm md:text-base lg:text-lg font-semibold rounded-none"
                >
                  GET STARTED
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* 右側: デザインワークスペースの画像 */}
        <div className="relative h-[250px] md:h-[300px] lg:h-[350px] w-full">
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop"
            alt="Design workspace with materials, fabric swatches, design proposal, and books"
            fill
            className="object-cover w-full"
          />
        </div>
      </div>
    </section>
  );
}
