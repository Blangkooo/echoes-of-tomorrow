"use server";

import { db } from "@/lib/db";
import { getUserId } from "@/lib/get-user-id";
import { createUniverseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createUniverse(input: z.input<typeof createUniverseSchema>) {
  const userId = await getUserId();
  const data = createUniverseSchema.parse(input);

  const universe = await db.universeScenario.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      decisionPoint: data.decisionPoint,
      divergenceYear: data.divergenceYear,
      timeline: data.timeline,
      probability: data.probability,
      mood: data.mood,
      gradient: data.gradient,
      tags: data.tags,
      isPublic: data.isPublic,
    },
  });

  revalidatePath("/dashboard/universes");
  return universe;
}

export async function toggleUniverseVisibility(id: string) {
  const userId = await getUserId();
  const universe = await db.universeScenario.findUnique({ where: { id }, select: { userId: true, isPublic: true } });
  if (!universe || universe.userId !== userId) throw new Error("Not found");

  await db.universeScenario.update({ where: { id }, data: { isPublic: !universe.isPublic } });
  revalidatePath("/dashboard/universes");
}

export async function deleteUniverse(id: string) {
  const userId = await getUserId();
  const universe = await db.universeScenario.findUnique({ where: { id }, select: { userId: true } });
  if (!universe || universe.userId !== userId) throw new Error("Not found");

  await db.universeScenario.delete({ where: { id } });
  revalidatePath("/dashboard/universes");
}
