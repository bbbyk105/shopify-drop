import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Evimeria Home - Illuminate Your World",
  description:
    "Discover elegant lighting solutions and premium home decor at Evimeria Home. Transform your space with our curated collection of contemporary and classic designs.",
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
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
