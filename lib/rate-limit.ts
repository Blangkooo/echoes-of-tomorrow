import { db } from "@/lib/db";

/**
 * Simple database-backed rate limiter.
 * Uses the Memory table to track request counts per user.
 * For production, replace with Upstash Redis for better performance.
 */

const LIMITS = {
  chat: { window: 60, max: 20 },        // 20 messages per minute
  echo: { window: 60, max: 30 },         // 30 echoes per minute
  capsule: { window: 3600, max: 10 },    // 10 capsules per hour
  universe: { window: 3600, max: 20 },   // 20 universes per hour
} as const;

type LimitKey = keyof typeof LIMITS;

export async function checkRateLimit(
  userId: string,
  action: LimitKey
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const limit = LIMITS[action];
  const windowStart = new Date(Date.now() - limit.window * 1000);

  // Count recent requests stored as memories with a special tag
  const recentRequests = await db.memory.count({
    where: {
      userId,
      type: "MILESTONE",
      content: `rate_limit:${action}`,
      createdAt: { gte: windowStart },
    },
  });

  if (recentRequests >= limit.max) {
    const oldest = await db.memory.findFirst({
      where: {
        userId,
        type: "MILESTONE",
        content: `rate_limit:${action}`,
        createdAt: { gte: windowStart },
      },
      orderBy: { createdAt: "asc" },
    });

    const resetIn = oldest
      ? Math.ceil(
          (new Date(oldest.createdAt).getTime() + limit.window * 1000 - Date.now()) / 1000
        )
      : limit.window;

    return { allowed: false, remaining: 0, resetIn };
  }

  // Record this request
  await db.memory.create({
    data: {
      userId,
      type: "MILESTONE",
      content: `rate_limit:${action}`,
      importance: 0,
    },
  });

  return {
    allowed: true,
    remaining: limit.max - recentRequests - 1,
    resetIn: limit.window,
  };
}
