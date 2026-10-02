/**
 * Security, Rate Limiting & Protection Layer
 */

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

const MAX_REQUESTS_PER_MINUTE = 60;
const REFILL_RATE_PER_MS = MAX_REQUESTS_PER_MINUTE / 60000;

/**
 * Token bucket rate limiter per client IP / identifier
 */
export function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  let bucket = rateLimitMap.get(clientId);

  if (!bucket) {
    bucket = { tokens: MAX_REQUESTS_PER_MINUTE, lastRefill: now };
    rateLimitMap.set(clientId, bucket);
  } else {
    const elapsed = now - bucket.lastRefill;
    bucket.tokens = Math.min(MAX_REQUESTS_PER_MINUTE, bucket.tokens + elapsed * REFILL_RATE_PER_MS);
    bucket.lastRefill = now;
  }

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return {
      allowed: true,
      remaining: Math.floor(bucket.tokens),
      resetMs: Math.ceil((MAX_REQUESTS_PER_MINUTE - bucket.tokens) / REFILL_RATE_PER_MS),
    };
  }

  return {
    allowed: false,
    remaining: 0,
    resetMs: Math.ceil((1 - bucket.tokens) / REFILL_RATE_PER_MS),
  };
}

/**
 * Sanitize user input to prevent injection
 */
export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return input.trim().replace(/[<>]/g, "");
  }
  if (typeof input === "object" && input !== null) {
    const clean: Record<string, any> = {};
    for (const [k, v] of Object.entries(input)) {
      clean[sanitizeInput(k)] = sanitizeInput(v);
    }
    return clean;
  }
  return input;
}
