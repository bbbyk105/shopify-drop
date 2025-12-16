import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lumina Luxe - Illuminate Your World",
  description:
    "Discover elegant lighting solutions and premium home decor at Lumina Luxe. Transform your space with our curated collection of contemporary and classic designs.",
  keywords: [
    "lighting",
    "lamps",
    "home decor",
    "interior design",
    "luxury lighting",
    "table lamps",
    "floor lamps",
  ],
  authors: [{ name: "Evimeria Home" }],
  openGraph: {
    title: "Evimeria Home - Illuminate Your World",
    description:
      "Discover elegant lighting solutions and premium home decor at Evimeria Home.",
    type: "website",
    locale: "en_US",
    siteName: "Evimeria Home",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evimeria Home - Illuminate Your World",
    description:
      "Discover elegant lighting solutions and premium home decor at Evimeria Home.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
