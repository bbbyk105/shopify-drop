import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Decor Collection - Lumina Luxe",
  description:
    "Add the finishing touches to your space with our decor collection.",
};

export default function DecorPage() {
  const decorCategories = [
    {
      name: "Vases & Vessels",
      image:
        "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=800&fit=crop&q=80",
      description: "Elegant containers for your florals",
    },
    {
      name: "Candles & Holders",
      image:
        "https://images.unsplash.com/photo-1598300188692-f84b58d3579c?w=600&h=800&fit=crop&q=80",
      description: "Create ambiance with our curated selection",
    },
    {
      name: "Art & Sculptures",
      image:
        "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=800&fit=crop&q=80",
      description: "Statement pieces for your walls and surfaces",
    },
    {
      name: "Textiles",
      image:
        "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=800&fit=crop&q=80",
      description: "Luxurious throws, pillows, and rugs",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Decor Collection
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete your space with carefully selected decorative pieces that
              add personality and warmth.
            </p>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {decorCategories.map((category, index) => (
            <div
              key={index}
              className="group relative aspect-4/5 overflow-hidden rounded-lg bg-secondary cursor-pointer"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-3xl font-bold mb-2">{category.name}</h3>
                <p className="text-lg opacity-90">{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <div className="bg-muted/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">More Coming Soon</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We&apos;re expanding our decor collection with unique pieces from
            talented artisans around the world. Subscribe to be the first to
            know when new items arrive.
          </p>
        </div>
      </section>
    </div>
  );
}
