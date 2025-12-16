type RateLimitEntry = {
  count: number;
  firstRequestAt: number;
};

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 20;

const store = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  allowed: boolean;
  retryAfter?: number;
};

export function checkRateLimit(
  key: string,
  limit = RATE_LIMIT_MAX_REQUESTS,
  windowMs = RATE_LIMIT_WINDOW_MS
): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);

  if (!current || now - current.firstRequestAt > windowMs) {
    store.set(key, { count: 1, firstRequestAt: now });
    return { allowed: true };
  }

  const updatedCount = current.count + 1;
  const elapsed = now - current.firstRequestAt;

  if (updatedCount > limit) {
    return { allowed: false, retryAfter: Math.max(windowMs - elapsed, 0) };
  }

  store.set(key, { count: updatedCount, firstRequestAt: current.firstRequestAt });
  return { allowed: true };
}


