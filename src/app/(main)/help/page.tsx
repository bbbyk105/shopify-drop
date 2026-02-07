import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Truck, RotateCcw, CreditCard, Package, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Help - Evimeria Home",
  description:
    "Frequently asked questions, shipping, returns, and order support for Evimeria Home.",
};

export default function HelpPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <HelpCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Help Center</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find answers to common questions about orders, shipping, returns, and
          more.
        </p>
      </div>

      <div className="space-y-12">
        {/* Quick links */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/help#shipping"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <Truck className="w-5 h-5 shrink-0 text-muted-foreground" />
              <span>Shipping & Delivery</span>
            </Link>
            <Link
              href="/help#returns"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <RotateCcw className="w-5 h-5 shrink-0 text-muted-foreground" />
              <span>Returns & Refunds</span>
            </Link>
            <Link
              href="/help#orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <Package className="w-5 h-5 shrink-0 text-muted-foreground" />
              <span>Order Status & Tracking</span>
            </Link>
            <Link
              href="/help#payment"
              className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
            >
              <CreditCard className="w-5 h-5 shrink-0 text-muted-foreground" />
              <span>Payment</span>
            </Link>
          </div>
        </section>

        <hr className="border-border" />

        <section id="shipping" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Truck className="w-6 h-6" />
            Shipping & Delivery
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
            <p>
              We ship to the United States. Delivery typically takes 1–14
              business days depending on your location and the product.
            </p>
            <p>
              You will receive a confirmation email when your order ships. For
              tracking your package, visit our{" "}
              <Link href="/tracking" className="text-primary underline hover:no-underline">
                Tracking
              </Link>{" "}
              page.
            </p>
            <p className="text-muted-foreground text-sm">
              Delivery may be delayed due to weather, peak seasons, or carrier
              circumstances. We will do our best to keep you informed.
            </p>
          </div>
        </section>

        <section id="returns" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <RotateCcw className="w-6 h-6" />
            Returns & Refunds
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
            <p>
              We accept returns within 7 days of delivery for most items in
              unused condition. Please see our{" "}
              <Link
                href="/cancellation"
                className="text-primary underline hover:no-underline"
              >
                Cancellation Policy
              </Link>{" "}
              for full details.
            </p>
            <p>
              To start a return, please contact us with your order number and
              reason. Once approved, we will provide instructions for sending
              the item back.
            </p>
            <p>
              Refunds are processed to the original payment method and may take
              5–10 business days to appear.
            </p>
          </div>
        </section>

        <section id="orders" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Order Status & Tracking
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
            <p>
              After placing an order, you will receive an email confirmation.
              When your order ships, we will send a separate email with tracking
              information (when available).
            </p>
            <p>
              You can look up your order status and tracking on our{" "}
              <Link href="/tracking" className="text-primary underline hover:no-underline">
                Order Tracking
              </Link>{" "}
              page using your email and order number.
            </p>
            <p className="text-muted-foreground text-sm">
              Some carriers may take 24–48 hours to show tracking updates after
              the label is created.
            </p>
          </div>
        </section>

        <section id="payment" className="scroll-mt-24">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6" />
            Payment
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
            <p>
              We accept major credit cards and other payment methods offered at
              checkout. All transactions are processed securely.
            </p>
            <p>
              Prices shown are in USD. You are charged when your order is
              confirmed. For more on pricing and payment, see our{" "}
              <Link href="/terms" className="text-primary underline hover:no-underline">
                Terms of Service
              </Link>
              .
            </p>
          </div>
        </section>

        <hr className="border-border" />

        <section>
          <h2 className="text-2xl font-semibold mb-4">Still need help?</h2>
          <p className="text-muted-foreground mb-6">
            Can&apos;t find what you&apos;re looking for? Reach out and we&apos;ll
            get back to you as soon as we can.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/contact">
              <Mail className="w-5 h-5" />
              Contact Us
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
