import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl mb-12 lg:mb-16 shadow-xl">
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
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight">
            Illuminate Your World with EVIMERÍA Home
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-xl">
            Discover premium home essentials that transform your living space
          </p>
        </div>
      </div>
    </section>
  );
}
