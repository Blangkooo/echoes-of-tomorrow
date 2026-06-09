"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createUniverseSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function createUniverse(input: z.input<typeof createUniverseSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = createUniverseSchema.parse(input);

  const universe = await db.universeScenario.create({
    data: {
      userId: session.user.id,
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
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const universe = await db.universeScenario.findUnique({
    where: { id },
    select: { userId: true, isPublic: true },
  });
  if (!universe || universe.userId !== session.user.id) throw new Error("Not found");

  await db.universeScenario.update({
    where: { id },
    data: { isPublic: !universe.isPublic },
  });

  revalidatePath("/dashboard/universes");
}

export async function deleteUniverse(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const universe = await db.universeScenario.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!universe || universe.userId !== session.user.id) throw new Error("Not found");

  await db.universeScenario.delete({ where: { id } });
  revalidatePath("/dashboard/universes");
}
