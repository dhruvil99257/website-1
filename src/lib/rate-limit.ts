import { headers } from "next/headers";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number }[];
}

const store: RateLimitStore = {};
const CLEANUP_INTERVAL = 60000;

setInterval(() => {
  const now = Date.now();
  for (const [key, entries] of Object.entries(store)) {
    store[key] = entries.filter((e) => e.resetTime > now);
    if (store[key].length === 0) delete store[key];
  }
}, CLEANUP_INTERVAL);

export async function rateLimit(
  identifier: string,
  options: { maxRequests: number; windowMs: number }
): Promise<{ success: boolean; limit: number; remaining: number; resetTime: number }> {
  const now = Date.now();
  const windowStart = now - options.windowMs;

  if (!store[identifier]) {
    store[identifier] = [];
  }

  store[identifier] = store[identifier].filter((entry) => entry.resetTime > windowStart);

  if (store[identifier].length >= options.maxRequests) {
    const oldestEntry = store[identifier][0];
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetTime: oldestEntry.resetTime,
    };
  }

  const resetTime = now + options.windowMs;
  store[identifier].push({ count: 1, resetTime });

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - store[identifier].length,
    resetTime,
  };
}

export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  return (
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    headersList.get("x-client-ip") ||
    "unknown"
  );
}
