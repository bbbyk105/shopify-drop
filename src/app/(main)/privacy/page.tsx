import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Evimeria Home",
  description: "Evimeria Home Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>

      <div className="prose prose-lg max-w-none space-y-6">
        <p>
          Evimeria Home ("we," "us," or "our") values your privacy. This Privacy
          Policy explains how we collect, use, and protect your personal
          information when you use our online store and related services (the
          "Service").
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p>
            We may collect the following information when you use our Service:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name</li>
            <li>Shipping address</li>
            <li>Phone number</li>
            <li>Email address</li>
            <li>
              Order details (items purchased, quantity, amount, shipping
              information, etc.)
            </li>
            <li>Customer support inquiries and communications</li>
            <li>
              Access and usage information (browsing history, IP address,
              cookies, device information, browser information, etc.)
            </li>
          </ul>
          <p className="mt-4">
            <strong>Note:</strong> We may not directly store your credit card
            information, as payments may be processed by third-party payment
            providers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To process orders, payments, shipping, and delivery</li>
            <li>To respond to inquiries and provide customer support</li>
            <li>To improve our products and services</li>
            <li>To prevent fraud and maintain a safe purchasing environment</li>
            <li>To address violations of laws or our policies</li>
            <li>To deliver advertisements and measure advertising performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            3. Advertising & Analytics
          </h2>
          <p>
            We may use the following tools for advertising and analytics
            purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Meta Ads (Meta Pixel, etc.)</li>
            <li>Google Analytics</li>
          </ul>
          <p className="mt-4">
            These tools may use cookies or similar technologies to analyze site
            usage and measure advertising performance. You can disable cookies
            through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Sharing Your Information with Third Parties
          </h2>
          <p>
            We do not provide your personal information to third parties without
            your consent, except as required by law. However, we may share
            necessary information with third parties only to the extent required
            for business operations, such as:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Shipping and delivery carriers</li>
            <li>Payment service providers</li>
            <li>System and platform service providers</li>
            <li>Suppliers or partners involved in fulfillment and delivery</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Security</h2>
          <p>
            We take reasonable security measures to protect your personal
            information from unauthorized access, loss, misuse, or alteration.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Your Rights</h2>
          <p>
            If you wish to request access, correction, deletion, or suspension
            of use of your personal information, we will respond within a
            reasonable scope after verifying your identity.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Contact</h2>
          <p>
            For any questions regarding this Privacy Policy, please contact us
            at:
          </p>
          <div className="mt-4 space-y-1">
            <p>
              <strong>Evimeria Home</strong>
            </p>
            <p>Email: info@evimeria105.com</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            8. Updates to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will
            become effective when posted on our website.
          </p>
        </section>
      </div>
    </div>
  );
}
