import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About - Evimeria Home",
  description:
    "Learn about Evimeria Home — our story, values, and commitment to bringing quality home goods to your space.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">About Evimeria Home</h1>

      <div className="prose prose-lg max-w-none space-y-8">
        <p className="text-muted-foreground text-lg">
          Bringing quality home goods and thoughtful design to spaces that
          matter to you.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Story</h2>
          <p>
            Evimeria Home was born from a simple belief: your home should
            reflect who you are and make everyday life a little more enjoyable.
            We curate furniture, lighting, and home accessories that combine
            quality, style, and affordability.
          </p>
          <p>
            Whether you&apos;re refreshing a room or building your space from
            scratch, we aim to offer pieces that stand the test of time — in
            both design and durability.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <p>
            <strong>Quality & Care.</strong> We select products we&apos;d be
            proud to have in our own homes, with attention to materials and
            craftsmanship.
          </p>
          <p>
            <strong>Reliable Service.</strong> From checkout to delivery, we
            strive to make your experience smooth and stress-free.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have a question? Reach out and we&apos;ll get back to you.
          </p>
          <Button asChild size="lg">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
