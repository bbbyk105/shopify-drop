import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { getSiteUrl } from "@/lib/seo/site-url";
import { buildOrganizationAndWebSite } from "@/lib/seo/schema";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Evimeria Home | Evimeria - Illuminate Your World",
  description:
    "Discover elegant lighting solutions and premium home decor at Evimeria Home (Evimeria / evimeria / evimeria合同会社). Transform your space with our curated collection of contemporary and classic designs.",
  keywords: [
    "Evimeria Home",
    "Evimeria",
    "evimeria",
    "evimeria 合同会社",
    "evimeria group",
    "lighting",
    "lamps",
    "home decor",
    "interior design",
    "luxury lighting",
    "table lamps",
    "floor lamps",
  ],
  authors: [{ name: "Evimeria Home" }, { name: "Evimeria" }],
  verification: {
    other: {
      "facebook-domain-verification": "adi79gxv3rvwt6vp6pqozm39unn6e3",
    },
  },
  openGraph: {
    title: "Evimeria Home | Evimeria - Illuminate Your World",
    description:
      "Discover elegant lighting solutions and premium home decor at Evimeria Home (Evimeria / evimeria).",
    type: "website",
    locale: "en_US",
    siteName: "Evimeria Home",
  },
  twitter: {
    card: "summary_large_image",
    title: "Evimeria Home | Evimeria - Illuminate Your World",
    description:
      "Discover elegant lighting solutions and premium home decor at Evimeria Home (Evimeria / evimeria).",
  },
};

const organizationAndWebSiteJsonLd = buildOrganizationAndWebSite();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationAndWebSiteJsonLd),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
