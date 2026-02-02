"use client";

import { sendGTMEvent } from "@next/third-parties/google";

/**
 * GTMにカスタムイベントを送信する。
 * クライアントでのみ実行され、未設定時は何もしない。
 */
export function trackGtmEvent(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  sendGTMEvent(payload);
}
