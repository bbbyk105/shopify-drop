import * as Sentry from "@sentry/nextjs";

const CHECKOUT_URL = "checkout.shopify.com";

function shouldDropEventUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes(CHECKOUT_URL);
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.05,
  environment: process.env.NODE_ENV,

  beforeSend(event) {
    const url = event.request?.url;
    if (shouldDropEventUrl(url)) return null;
    if (event.request) {
      delete event.request.headers;
      delete event.request.cookies;
    }
    return event;
  },

  beforeSendTransaction(transaction) {
    const reqUrl = transaction.contexts?.request?.url;
    const url = typeof reqUrl === "string" ? reqUrl : "";
    if (shouldDropEventUrl(url)) return null;
    if (transaction.contexts?.request) {
      delete transaction.contexts.request.headers;
      delete transaction.contexts.request.cookies;
    }
    return transaction;
  },
});
