import { z } from "zod";

export const EchoTypeEnum = z.enum([
  "MESSAGE", "PREDICTION", "DREAM", "CHALLENGE", "GOAL", "MEMORY", "QUESTION"
]);

export const EchoMoodEnum = z.enum([
  "HOPEFUL", "ANXIOUS", "EXCITED", "REFLECTIVE", "DETERMINED", "NOSTALGIC", "INSPIRED"
]);

export const AIModelEnum = z.enum([
  "OPTIMISTIC", "REALISTIC", "MENTOR", "ENTREPRENEUR", "CREATIVE"
]);

export const createEchoSchema = z.object({
  type: EchoTypeEnum,
  title: z.string().max(200).optional().default(""),
  content: z.string().min(1, "Content is required").max(5000, "Content too long"),
  targetDate: z.string().datetime().optional().nullable(),
  mood: EchoMoodEnum.optional().default("HOPEFUL"),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  isPinned: z.boolean().optional().default(false),
});

export const updateEchoSchema = z.object({
  id: z.string().cuid(),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(5000).optional(),
  targetDate: z.string().datetime().optional().nullable(),
  mood: EchoMoodEnum.optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  isPinned: z.boolean().optional(),
});

export const createCapsuleSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(10000),
  duration: z.enum(["ONE_MONTH", "ONE_YEAR", "FIVE_YEARS", "TEN_YEARS"]),
  mood: EchoMoodEnum.optional().default("REFLECTIVE"),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
});

export const createUniverseSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  decisionPoint: z.string().min(1).max(500),
  divergenceYear: z.number().int().min(1900).max(2075).optional().default(new Date().getFullYear()),
  timeline: z.array(z.string().max(300)).max(20).optional().default([]),
  mood: z.string().max(200).optional().default(""),
  probability: z.number().int().min(1).max(100).optional().default(50),
  gradient: z.string().max(100).optional().default("from-amber-500 to-yellow-600"),
  tags: z.array(z.string().max(30)).max(10).optional().default([]),
  isPublic: z.boolean().optional().default(false),
});

export const createGoalSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  targetDate: z.string().datetime().optional(),
  progress: z.number().int().min(0).max(100).optional().default(0),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().cuid().optional(),
  content: z.string().min(1, "Message cannot be empty").max(2000),
  mode: AIModelEnum.optional().default("MENTOR"),
});

export const onboardingSchema = z.object({
  futureYear: z.number().int().min(2025).max(2075),
  coreValues: z.array(z.string().min(1).max(50)).min(1).max(8),
  lifeGoals: z.array(z.string().min(1).max(200)).min(1).max(8),
  bio: z.string().max(1000).optional(),
});
