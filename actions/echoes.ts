"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/get-user-id";
import { createEchoSchema, updateEchoSchema } from "@/lib/validations";
import { saveMemory } from "@/lib/memory";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createEcho(input: z.input<typeof createEchoSchema>) {
  const userId = await getUserId();
  const data = createEchoSchema.parse(input);

  const echo = await db.echo.create({
    data: {
      userId,
      type: data.type,
      title: data.title,
      content: data.content,
      ...(data.targetDate ? { targetDate: new Date(data.targetDate) } : {}),
      mood: data.mood,
      tags: data.tags,
      isPinned: data.isPinned,
    },
  });

  await saveMemory(
    userId,
    `${data.type.toLowerCase()} — "${data.title}": ${data.content.slice(0, 200)}`,
    "ECHO",
    echo.id,
    data.type === "GOAL" ? 1.5 : 1.0
  );

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/echoes");
  revalidatePath("/dashboard/timeline");
  return echo;
}

export async function updateEcho(input: z.infer<typeof updateEchoSchema>) {
  const userId = await getUserId();
  const data = updateEchoSchema.parse(input);
  const { id, ...updates } = data;

  const echo = await db.echo.findUnique({ where: { id }, select: { userId: true } });
  if (!echo || echo.userId !== userId) throw new Error("Not found");

  const updated = await db.echo.update({
    where: { id },
    data: {
      ...updates,
      targetDate: updates.targetDate ? new Date(updates.targetDate) : undefined,
    },
  });

  revalidatePath("/dashboard/echoes");
  return updated;
}

export async function deleteEcho(id: string) {
  const userId = await getUserId();
  const echo = await db.echo.findUnique({ where: { id }, select: { userId: true } });
  if (!echo || echo.userId !== userId) throw new Error("Not found");

  await db.echo.delete({ where: { id } });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/echoes");
  revalidatePath("/dashboard/timeline");
}

export async function pinEcho(id: string) {
  const userId = await getUserId();
  const echo = await db.echo.findUnique({ where: { id }, select: { userId: true, isPinned: true } });
  if (!echo || echo.userId !== userId) throw new Error("Not found");

  await db.echo.update({ where: { id }, data: { isPinned: !echo.isPinned } });
  revalidatePath("/dashboard/echoes");
}

export async function getEchoes(userId: string, type?: string) {
  const where = type && type !== "all"
    ? { userId, type: type.toUpperCase() as any }
    : { userId };

  return db.echo.findMany({
    where,
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
  });
}

export async function getEchoStats(userId: string) {
  const [total, byType, recent] = await Promise.all([
    db.echo.count({ where: { userId } }),
    db.echo.groupBy({ by: ["type"], where: { userId }, _count: true }),
    db.echo.count({
      where: { userId, createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);
  return { total, byType, recent };
}
