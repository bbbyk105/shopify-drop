import Link from "next/link";
import Image from "next/image";
import Section from "./Section";

const rooms = [
  {
    name: "All Products",
    href: "/products",
    image: "/images/all_products.webp",
  },
  {
    name: "New Arrivals",
    href: "/new-arrivals",
    image: "/images/newarrivals.webp",
  },
  {
    name: "Living Room",
    href: "/rooms/living-room",
    image: "/images/living_room.webp",
  },
  {
    name: "Bedroom",
    href: "/rooms/bedroom",
    image: "/images/bed_room.webp",
  },
  {
    name: "Dining Room & Kitchen",
    href: "/rooms/dining-room-kitchen",
    image: "/images/dining.webp",
  },
  {
    name: "Outdoor",
    href: "/rooms/outdoor",
    image: "/images/outdoor.webp",
  },
  {
    name: "Home Office",
    href: "/rooms/home-office",
    image: "/images/home_office.webp",
  },
  {
    name: "Entryway",
    href: "/rooms/entryway",
    image: "/images/entryway.webp",
  },
];

export default function ShopByRoom() {
  return (
    <Section title="Shop By Room">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        {rooms.map((room) => (
          <Link
            key={room.name}
            href={room.href}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-3 bg-secondary/30 transition-all duration-300 group-hover:opacity-95">
              <Image
                src={room.image}
                alt={room.name}
                fill
                className="object-cover transition-opacity duration-300 group-hover:opacity-90"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {/* 控えめなオーバーレイ（hover時のみ少し濃く） */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            </div>
            <div className="space-y-1">
              <p className="text-sm md:text-base font-medium text-foreground group-hover:text-primary transition-colors">
                {room.name}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Shop the look
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
