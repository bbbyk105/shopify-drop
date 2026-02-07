import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import CartAddedDrawer from "@/components/CartAddedDrawer";

import ChatWidget from "@/components/ChatWidget";

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

/** true にすると next/script で GTM を挿入（@next/third-parties が動かない場合用） */
const USE_GTM_SCRIPT_FALLBACK =
  process.env.NEXT_PUBLIC_GTM_USE_SCRIPT_FALLBACK === "true";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

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
        {/* GTM: env がある時だけ読み込む / USE_GTM_SCRIPT_FALLBACK=true の時は next/script のみ */}
        {gtmId ? (
          USE_GTM_SCRIPT_FALLBACK ? (
            <Script id="gtm-init" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
            </Script>
          ) : (
            <GoogleTagManager gtmId={gtmId} />
          )
        ) : null}

        <ThemeProvider>
          {children}
          <Toaster />
          <CartAddedDrawer />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
