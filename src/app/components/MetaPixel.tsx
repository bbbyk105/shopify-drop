"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    fbq: (
      action: "track" | "init",
      eventOrPixelId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * SPA 遷移時に pathname が変わったタイミングで fbq('track', 'PageView') を発火する。
 * 初回ロードの PageView は layout の Script ベースコードで送信されるため、初回はスキップする。
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);

  return null;
}
