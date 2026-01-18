import Link from "next/link";
import Image from "next/image";

const rooms = [
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
    href: "/rooms/dining-kitchen",
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
    <section className="py-12 lg:py-16 mb-12 lg:mb-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 lg:mb-12">
          Shop By Room
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {rooms.map((room) => (
            <Link
              key={room.name}
              href={room.href}
              className="cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
                <Image
                  src={room.image}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />
              </div>
              <p className="text-sm md:text-base font-medium text-center">
                {room.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
