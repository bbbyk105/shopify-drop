import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - EVIMERIA Home",
  description:
    "Privacy Policy for EVIMERIA Home. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground leading-relaxed">
            Welcome to EVIMERIA Home. We are committed to protecting your
            personal information and your right to privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit our website and use our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Personal Information
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>Register for an account</li>
                <li>Make a purchase</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us through our contact form</li>
                <li>Participate in surveys or promotions</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Automatically Collected Information
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                When you visit our website, we may automatically collect certain
                information about your device, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Pages you visit and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Device information</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about your orders and our services</li>
            <li>To send you marketing communications (with your consent)</li>
            <li>To improve our website and services</li>
            <li>To prevent fraud and ensure security</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            4. Information Sharing and Disclosure
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              With service providers who assist us in operating our website and
              conducting our business
            </li>
            <li>With payment processors to complete transactions</li>
            <li>With shipping companies to deliver your orders</li>
            <li>When required by law or to protect our rights</li>
            <li>In connection with a business transfer or merger</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">5. Data Security</h2>
          <p className="text-muted-foreground leading-relaxed">
            We implement appropriate technical and organizational security
            measures to protect your personal information against unauthorized
            access, alteration, disclosure, or destruction. However, no method
            of transmission over the Internet or electronic storage is 100%
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Depending on your location, you may have the following rights
            regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Right to access your personal information</li>
            <li>Right to correct inaccurate information</li>
            <li>Right to delete your personal information</li>
            <li>Right to restrict processing of your information</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw consent</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            7. Cookies and Tracking Technologies
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We use cookies and similar tracking technologies to track activity
            on our website and store certain information. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent. However, if you do not accept cookies, you may not be able to
            use some portions of our website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">8. Third-Party Links</h2>
          <p className="text-muted-foreground leading-relaxed">
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites. We
            encourage you to review the privacy policies of any third-party
            sites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            9. Children&apos;s Privacy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Our services are not directed to individuals under the age of 18. We
            do not knowingly collect personal information from children. If you
            become aware that a child has provided us with personal information,
            please contact us, and we will take steps to delete such
            information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">
            10. Changes to This Privacy Policy
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the &quot;Last updated&quot; date. You are advised to
            review this Privacy Policy periodically for any changes.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy or our privacy
            practices, please contact us:
          </p>
          <div className="mt-4 space-y-2 text-muted-foreground">
            <p>
              <strong>Email:</strong> privacy@evimeria.com
            </p>
            <p>
              <strong>Address:</strong> EVIMERIA Home Customer Service
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
