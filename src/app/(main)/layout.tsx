import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";
import {
  hasSaleProducts,
  hasFastShippingProducts,
} from "@/lib/shopify/queries/products";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const [hasSale, hasFastShipping] = await Promise.all([
    hasSaleProducts(100),
    hasFastShippingProducts(100),
  ]);

  return (
    <main className="min-h-screen flex flex-col">
      <Header hasSale={hasSale} hasFastShipping={hasFastShipping} />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
