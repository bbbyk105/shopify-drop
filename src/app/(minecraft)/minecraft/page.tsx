import { getProductsByTag } from "@/lib/shopify/queries/products";
import MinecraftProductCard from "@/components/minecraft/MinecraftProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Pickaxe, Flame } from "lucide-react";

export const metadata = {
  title: "Minecraft Collection | Pixelated Lighting",
  description:
    "Level up your room with Minecraft-inspired lighting. Pixelated Lantern and Torch Lamp available now!",
};

export default async function MinecraftPage() {
  // マインクラフトタグの商品を取得
  const products = await getProductsByTag("minecraft");

  return (
    <div className="relative">
      {/* 草ブロック背景パターン */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 8px,
          rgba(0, 100, 0, 0.3) 8px,
          rgba(0, 100, 0, 0.3) 16px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 8px,
          rgba(0, 100, 0, 0.3) 8px,
          rgba(0, 100, 0, 0.3) 16px
        )
      `,
            backgroundSize: "16px 16px",
          }}
        />
      </div>
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <div className="inline-block mb-6 px-6 py-2 bg-[#4A4A4A] border-4 border-black text-white text-sm font-bold uppercase">
            Special Collection
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)] font-minecraft tracking-wider">
            LEVEL UP YOUR ROOM
          </h1>

          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            Illuminate your space with iconic Minecraft-inspired lighting
          </p>

          {/* Trust Badges - Minecraft Style */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <MinecraftBadge
              icon={<Flame className="h-5 w-5" />}
              text="LED Powered"
            />
            <MinecraftBadge
              icon={<Pickaxe className="h-5 w-5" />}
              text="Durable Design"
            />
            <MinecraftBadge text="USB Rechargeable" />
            <MinecraftBadge text="7-16 Colors" />
          </div>
        </div>
      </section>
      {/* Products Grid */}
      <section className="relative py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <MinecraftProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white text-xl drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
                No products found. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>
      {/* Features Section */}
      <section className="relative py-16 px-4 bg-[#654321]/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)] font-minecraft">
            WHY PLAYERS LOVE IT
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              title="PERFECT GIFT"
              description="Ideal for Minecraft fans and gamers of all ages"
            />
            <FeatureCard
              title="MULTI-USE"
              description="Wall-mounted, handheld, or table lamp options"
            />
            <FeatureCard
              title="MOOD LIGHTING"
              description="Multiple color modes with remote control"
            />
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-16 px-4 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)] font-minecraft">
            READY TO CRAFT YOUR SETUP?
          </h2>
          <p className="text-lg text-white mb-8 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.8)]">
            Free shipping on all orders. 30-day returns.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#5CB85C] hover:bg-[#4A9B4A] text-white font-bold text-lg px-8 py-6 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <Link href="#products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

function MinecraftBadge({
  icon,
  text,
}: {
  icon?: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-[#4A4A4A] border-4 border-black px-4 py-2 text-white font-bold shadow-[3px_3px_0px_rgba(0,0,0,1)]">
      {icon}
      <span className="text-sm uppercase">{text}</span>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-[#4A4A4A] border-4 border-black p-6 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
      <h3 className="text-xl font-bold text-white mb-3 font-minecraft">
        {title}
      </h3>
      <p className="text-gray-200">{description}</p>
    </div>
  );
}
