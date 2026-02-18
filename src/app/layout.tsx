import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { GoogleTagManager } from "@next/third-parties/google";
import { Toaster } from "@/components/ui/toaster";
import CartAddedDrawer from "@/components/CartAddedDrawer";

import ChatWidget from "@/components/ChatWidget";
import MetaPixel from "@/app/components/MetaPixel";

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
  const metaPixelId =
    process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "2367420133735996";

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

        {/* Meta Pixel: fbevents.js + init + 初回 PageView（SPA 遷移時は MetaPixel が送信） */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${metaPixelId}');
fbq('track', 'PageView');`}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element -- Meta Pixel 1x1 トラッキング用（JS無効時フォールバック） */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <MetaPixel />

        {children}
        <Toaster />
        <CartAddedDrawer />
        <ChatWidget />
      </body>
    </html>
  );
}
