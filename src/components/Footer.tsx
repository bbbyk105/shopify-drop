import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container mx-auto px-4 py-10 md:py-12">
        {/* Main row: Links, Social */}
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-1 md:justify-end"
            aria-label="Footer"
          >
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="/help"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Help
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/tracking"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Tracking
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/cancellation"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancellation
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </nav>

          <div className="flex justify-center gap-6 md:justify-end">
            <Link
              href="https://instagram.com/evimeriahome_official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.facebook.com/profile.php?id=61587239397776&locale=ja_JP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Facebook"
            >
              <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Payment methods — same logo sizes as before */}
        <div className="mt-10 pt-8 border-t border-border/40">
          <p className="text-xs text-muted-foreground text-center mb-4">
            We accept
          </p>
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-8 sm:gap-y-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center h-4" title="Shop Pay">
                <Image
                  src="/logos/shop_pay_logo_purple.png"
                  alt="Shop Pay"
                  width={56}
                  height={24}
                  className="h-4 w-auto object-contain"
                />
              </span>
              <span className="inline-flex items-center h-6" title="Apple Pay">
                <Image
                  src="/logos/cards/ApplePay.svg"
                  alt="Apple Pay"
                  width={56}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </span>
              <span className="inline-flex items-center h-6" title="Google Pay">
                <Image
                  src="/logos/google_pay.png"
                  alt="Google Pay"
                  width={56}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </span>
              <span className="inline-flex items-center h-6" title="PayPal">
                <Image
                  src="https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/jp/developer/BN-paypal-logo320_145.png"
                  alt="PayPal（ペイパル）"
                  width={145}
                  height={60}
                  className="h-6 w-auto object-contain"
                />
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center gap-x-3">
                <span className="inline-flex items-center h-8" title="Visa">
                  <Image
                    src="/logos/cards/visa.svg"
                    alt="Visa"
                    width={56}
                    height={24}
                    className="h-8 w-auto object-contain"
                    unoptimized
                  />
                </span>
                <span
                  className="inline-flex items-center h-6"
                  title="Mastercard"
                >
                  <Image
                    src="/logos/cards/mc_symbol.svg"
                    alt="Mastercard"
                    width={40}
                    height={24}
                    className="h-6 w-auto object-contain"
                    unoptimized
                  />
                </span>
              </span>
              <span className="inline-flex items-center h-6" title="JCB">
                <Image
                  src="/logos/cards/jcb.png"
                  alt="JCB"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </span>
              <span
                className="inline-flex items-center h-6"
                title="American Express"
              >
                <Image
                  src="/logos/cards/amex.png"
                  alt="American Express"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </span>
              <span
                className="inline-flex items-center h-6"
                title="Diners Club"
              >
                <Image
                  src="/logos/cards/diners.png"
                  alt="Diners Club"
                  width={40}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border/40">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Evimeria. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
