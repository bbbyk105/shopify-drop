import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { hasSaleProducts } from "@/lib/shopify/utils/sale";

export default async function MainLayout({ children }: { children: ReactNode }) {
  const hasSale = await hasSaleProducts();

  return (
    <main className="min-h-screen flex flex-col">
      <Header hasSale={hasSale} />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </main>
  );
}
