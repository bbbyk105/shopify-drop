import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="min-h-screen">
        <Header />
        {children}
        <Footer />
      </main>
    </>
  );
}
