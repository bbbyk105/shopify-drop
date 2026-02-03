import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Evimeria Home",
  description: "Evimeria Home Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of the
          Evimeria Home online store and related services (the
          &quot;Service&quot;). By using our Service, you agree to be bound by
          these Terms.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 1 (Scope)
          </h2>
          <p>
            These Terms apply to all relationships between Evimeria Home
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) and users
            (&quot;you&quot; or &quot;customer&quot;) regarding the use of the
            Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 2 (Order Acceptance and Contract Formation)
          </h2>
          <p>
            A sales contract is formed when you complete the purchase process
            and we confirm receipt of your order. However, we may decline or
            cancel an order in certain cases, including payment issues, stock
            availability, or fulfillment circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 3 (Pricing and Payment)
          </h2>
          <p>
            Product prices, shipping fees (if applicable), and other charges are
            shown during checkout. You agree to pay using the payment methods
            provided by our store.
          </p>
        </section>

        <section id="shipping" className="scroll-mt-20 md:scroll-mt-28">
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 4 (Shipping)
          </h2>
          <p>
            We ship to the United States only. Estimated delivery time is 1–14
            business days, depending on the product.
          </p>

          <p className="mt-4">Delivery may be delayed due to:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Weather, natural disasters, traffic conditions</li>
            <li>Peak seasons and logistics congestion</li>
            <li>Supplier or carrier circumstances</li>
          </ul>
          <p className="mt-4">
            We will make reasonable efforts to assist, but we are not
            responsible for losses caused by delays beyond our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 5 (Tracking Information)
          </h2>
          <p>
            We generally provide tracking numbers. However, depending on the
            shipping method or product, tracking information may take time to
            update or may be temporarily unavailable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 6 (Cancellations)
          </h2>
          <p>
            Order cancellations are subject to our{" "}
            <a href="/cancellation" className="text-primary hover:underline">
              Cancellation Policy
            </a>
            .
          </p>
        </section>

        <section id="returns" className="scroll-mt-20 md:scroll-mt-28">
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 7 (Returns & Refunds)
          </h2>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3">
              1. Refund Request Period
            </h3>
            <p>
              We offer refund support only if you contact us within 7 days after
              the product is delivered. Requests made after this period may not
              be accepted.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">
              2. Refunds Only (No Replacements)
            </h3>
            <p>
              If you contact us within 7 days after delivery and we are able to
              confirm the issue, we will provide a refund. We do not offer
              replacements or reshipments.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">
              3. Photo Verification
            </h3>
            <p>
              For refund processing, we may request photos to confirm the
              condition of the product. If you do not provide the requested
              photos or if we cannot verify the issue, we may decline the refund
              request.
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">
              4. Customer-Requested Returns/Refunds
            </h3>
            <p>
              We do not accept returns or refunds due to customer preference,
              such as &quot;I changed my mind,&quot; &quot;It looked
              different,&quot; or &quot;It doesn&apos;t fit.&quot;
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">5. Refund Method</h3>
            <p>
              Refunds are processed through the original payment method used at
              checkout. The timing of the refund may vary depending on the
              payment provider or credit card issuer.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 8 (Prohibited Conduct)
          </h2>
          <p>You agree not to engage in any of the following:</p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Violating laws or public order</li>
            <li>Providing false information or making fraudulent orders</li>
            <li>
              Infringing on the rights or interests of us or third parties
            </li>
            <li>Interfering with the operation of the Service</li>
            <li>
              Purchasing in bulk for resale purposes or any purchase we deem
              inappropriate
            </li>
            <li>Any other conduct deemed inappropriate by our store</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 9 (Intellectual Property)
          </h2>
          <p>
            All content on our Service (including text, images, logos, and
            designs) is owned by us or rightful owners and is protected by
            applicable laws. Unauthorized use or reproduction is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 10 (Disclaimer)
          </h2>
          <p>
            We strive to ensure accurate and safe Service operation, but we do
            not guarantee completeness or uninterrupted functionality. We are
            not responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-2">
            <li>Shipping delays, lost packages, or customs delays</li>
            <li>
              Technical issues related to your device or internet connection
            </li>
            <li>Disputes between customers and third parties</li>
            <li>
              Damages caused by events beyond our reasonable control (natural
              disasters, system outages, etc.)
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 11 (Changes to These Terms)
          </h2>
          <p>
            We may update these Terms at any time. Updates become effective once
            posted on our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Article 12 (Governing Law and Jurisdiction)
          </h2>
          <p>
            These Terms are governed by the laws of Japan. Any disputes related
            to the Service shall be subject to the exclusive jurisdiction of the
            court having jurisdiction over our business location.
          </p>
        </section>

        {/* Legal Information - FTC Compliance */}
        <section className="mt-8 p-4 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Legal Information</h2>
          <div className="space-y-3">
            <p>
              <strong>Business Name:</strong> Evimeria Home
            </p>
            <p>
              <strong>Owner/Representative:</strong> Byakko Kondo
            </p>
            <p>
              <strong>Business Address:</strong>
              <br />
              653-1, Denbo
              <br />
              Fuji City, Shizuoka 417-0061
              <br />
              Japan
            </p>
            <p>
              <strong>Contact Email:</strong> info@evimeria105.com
            </p>
            <p>
              <strong>Pricing:</strong> All prices displayed on product pages
              include applicable taxes. Shipping fees and handling charges are
              displayed separately during checkout.
            </p>
            <div className="space-y-2">
              <p>
                <strong>Payment Methods:</strong> We currently accept major
                credit cards and supported digital wallets such as Shop Pay and
                Google Pay. Available payment options may vary depending on your
                device, location, and checkout conditions. All payments are
                securely processed via Shopify Checkout.
              </p>
            </div>
            <p>
              <strong>Payment Timing:</strong> Payment is processed at the time
              of order placement.
            </p>
            <p>
              <strong>Shipping & Delivery:</strong> We ship to the United States
              only. Items are typically shipped within 1-14 business days after
              order confirmation, depending on the product. For more details,
              please see our{" "}
              <a
                href="/terms#shipping"
                className="text-primary hover:underline"
              >
                Shipping Policy
              </a>
              .
            </p>
            <p>
              <strong>Return Policy:</strong> We offer refunds only (no
              replacements or reshipments) if you contact us within 7 days after
              delivery and we can confirm the issue. We do not accept returns or
              refunds due to customer preference. Please refer to our{" "}
              <a href="/cancellation" className="text-primary hover:underline">
                Cancellation Policy
              </a>{" "}
              and{" "}
              <a href="/terms#returns" className="text-primary hover:underline">
                Returns & Refunds
              </a>{" "}
              section for complete details.
            </p>
            <p>
              <strong>Cancellation:</strong> Orders can only be cancelled before
              shipment. Once an order has been processed for shipment, it cannot
              be cancelled. Please refer to our{" "}
              <a href="/cancellation" className="text-primary hover:underline">
                Cancellation Policy
              </a>{" "}
              for details.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
