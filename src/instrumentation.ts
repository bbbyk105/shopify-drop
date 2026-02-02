
/**
 * Next.js instrumentation.
 * Sentry を使う場合は @sentry/nextjs をインストールし、
 * sentry.server.config.ts / sentry.edge.config.ts を用意してから
 * ここで register / onRequestError を実装してください。
 */
export async function register() {
  // 現状は未使用（Sentry 設定ファイル・パッケージがないため何もしない）
}

export async function onRequestError(
  _err: unknown,
  _request: Request,
  _context: { routerKind: string; routePath: string }
) {
  // Sentry 利用時はここで captureRequestError を呼ぶ
}

import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;

