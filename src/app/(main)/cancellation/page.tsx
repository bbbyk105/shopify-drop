import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy - Evimeria Home",
  description: "Evimeria Home Cancellation Policy",
};

export default function CancellationPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Cancellation Policy
      </h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Order Cancellations
          </h2>
          <p>
            Cancellations are accepted only before the order is shipped (before
            fulfillment processing begins).
          </p>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">
              We are unable to cancel an order in the following cases:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>The order has already been processed for shipment</li>
              <li>The order has been shipped or is in transit</li>
              <li>The order has been delivered</li>
            </ul>
          </div>

          <p className="mt-6">
            If you request a cancellation after shipment, it will be handled
            according to our Terms of Service (Returns & Refunds section).
          </p>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="font-semibold">Please note:</p>
            <p>
              Depending on the processing status, an order may already be in
              preparation for shipment at the time we receive your request. In
              such cases, we may not be able to cancel the order.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
