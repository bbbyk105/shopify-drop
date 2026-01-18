import Image from "next/image";
import Link from "next/link";

const customerPhotos = [
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=750&fit=crop",
    author: "@alexandragater",
  },
  {
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=750&fit=crop",
    author: "@sarahdesigns",
  },
  {
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=600&h=750&fit=crop",
    author: "@homeinspo",
  },
];

export default function GreatStyleInTheWild() {
  return (
    <section className="py-12 lg:py-16 mb-12 lg:mb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          Great style in the wild.
        </h2>
        <p className="text-base md:text-lg text-muted-foreground mb-8">
          Looking for inspo? Check out how our customers have styled their own
          Article furniture.{" "}
          <Link
            href="/inspiration"
            className="underline hover:no-underline"
          >
            See more.
          </Link>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {customerPhotos.map((photo, index) => (
            <div key={index} className="relative cursor-pointer">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  src={photo.image}
                  alt={`Customer style by ${photo.author}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded text-sm font-medium">
                  Photo by {photo.author}
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-gray-900 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
