import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[400px] md:h-[500px] overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Lumina Luxe Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 to-black/30" />
      </div>

      <div className="container relative mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Illuminate Your World with EVIMERÍA Home
          </h1>
        </div>
      </div>
    </section>
  );
}
