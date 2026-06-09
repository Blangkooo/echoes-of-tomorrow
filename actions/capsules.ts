"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createCapsuleSchema } from "@/lib/validations";
import { saveMemory } from "@/lib/memory";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addMonths, addYears } from "date-fns";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";

function getUnlockDate(duration: string): Date {
  const now = new Date();
  switch (duration) {
    case "ONE_MONTH": return addMonths(now, 1);
    case "ONE_YEAR": return addYears(now, 1);
    case "FIVE_YEARS": return addYears(now, 5);
    case "TEN_YEARS": return addYears(now, 10);
    default: return addYears(now, 1);
  }
}

export async function createCapsule(input: z.input<typeof createCapsuleSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = createCapsuleSchema.parse(input);

  const capsule = await db.timeCapsule.create({
    data: {
      userId: session.user.id,
      title: data.title,
      content: data.content,
      duration: data.duration as any,
      lockedUntil: getUnlockDate(data.duration),
      mood: data.mood as any,
      tags: data.tags,
    },
  });

  await saveMemory(
    session.user.id,
    `Time capsule sealed: "${data.title}" — ${data.content.slice(0, 150)}`,
    "CAPSULE",
    capsule.id,
    1.3
  );

  revalidatePath("/dashboard/capsules");
  return capsule;
}

export async function unlockCapsule(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const capsule = await db.timeCapsule.findUnique({
    where: { id },
    select: { userId: true, title: true, content: true, duration: true, lockedUntil: true, isUnlocked: true },
  });

  if (!capsule || capsule.userId !== session.user.id) throw new Error("Not found");
  if (capsule.isUnlocked) throw new Error("Already unlocked");
  if (new Date(capsule.lockedUntil) > new Date()) throw new Error("Capsule is still locked");

  // Generate AI reflection using OpenAI
  let aiReflection = "";
  try {
    const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL || "gpt-4o"),
      prompt: `A person wrote this time capsule message and it has now unlocked:

Title: "${capsule.title}"

Message written:
${capsule.content}

Duration locked: ${capsule.duration.replace("_", " ").toLowerCase()}

Write a brief, emotionally resonant reflection (2-3 sentences) that acknowledges this moment of unlocking. Speak to the person directly. Focus on growth, change, and the significance of time having passed. Be sincere and human.`,
      temperature: 0.8,
      maxTokens: 200,
    });
    aiReflection = text;
  } catch {
    aiReflection =
      "Time has passed, and the person who sealed this message has grown in ways that are both visible and invisible. This moment of opening is its own kind of milestone.";
  }

  const updated = await db.timeCapsule.update({
    where: { id },
    data: {
      isUnlocked: true,
      unlockedAt: new Date(),
      aiReflection,
    },
  });

  await saveMemory(
    session.user.id,
    `Opened time capsule: "${capsule.title}" — original message: ${capsule.content.slice(0, 150)}`,
    "MILESTONE",
    id,
    2.0
  );

  revalidatePath("/dashboard/capsules");
  return updated;
}

export async function deleteCapsule(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const capsule = await db.timeCapsule.findUnique({ where: { id }, select: { userId: true } });
  if (!capsule || capsule.userId !== session.user.id) throw new Error("Not found");

  await db.timeCapsule.delete({ where: { id } });
  revalidatePath("/dashboard/capsules");
}
