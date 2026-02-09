import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default async function MainLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col">
      <Header hasSale={false} />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
    </main>
  );
}
