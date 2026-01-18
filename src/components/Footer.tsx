import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="border-t border-border/40 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Logo - Left */}
          <div className="flex justify-center md:justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src={"/logos/transparent.png"}
                alt="Evimeria Home"
                width={150}
                height={150}
                className="h-12 w-auto brightness-0 dark:brightness-100"
              />
            </Link>
          </div>

          {/* Links - Center */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/tracking"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Tracking
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cancellation"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancellation Policy
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Social Icons - Right */}
          <div className="flex justify-center md:justify-end gap-6">
            <Link
              href="https://instagram.com/evimeria__official"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FontAwesomeIcon icon={faInstagram} className="h-5 w-5" />
            </Link>

            <Link
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <FontAwesomeIcon icon={faFacebook} className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border/40">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Evimeria. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
