import Link from "next/link";

export default function MineLightFooter() {
  return (
    <footer className="bg-[#3A3A3A] border-t-8 border-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-minecraft">
              ABOUT US
            </h3>
            <p className="text-gray-300 leading-relaxed">
              We bring the blocky world of Mine Light into your home with
              officially inspired lighting products.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-minecraft">
              QUICK LINKS
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-bold"
                >
                  → Main Store
                </Link>
              </li>
              <li>
                <Link
                  href="/minelight/tracking"
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-bold"
                >
                  → Track your order
                </Link>
              </li>
              <li>
                <Link
                  href="/minelight/contact"
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-bold"
                >
                  → Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/minelight/cart"
                  className="text-gray-300 hover:text-yellow-400 transition-colors font-bold"
                >
                  → Mine Light Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] font-minecraft">
              CUSTOMER SERVICE
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-300 font-bold">✓ Free Shipping</li>
              <li className="text-gray-300 font-bold">✓ 30-Day Returns</li>
              <li className="text-gray-300 font-bold">✓ Secure Checkout</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t-4 border-black text-center">
          <p className="text-gray-400 text-sm font-bold">
            © {new Date().getFullYear()} Mine Light Shop. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            © {new Date().getFullYear()} evimeria home. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
