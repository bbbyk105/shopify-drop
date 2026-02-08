import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "www.paypalobjects.com",
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: "evimeria",
  project: "javascript-nextjs",
  silent: !process.env.CI,
});
