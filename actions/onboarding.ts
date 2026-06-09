"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validations";
import { z } from "zod";

export async function completeOnboarding(input: z.infer<typeof onboardingSchema>) {
  const session = await auth();

  const userId = (session?.user as { id?: string })?.id;
  if (!userId) throw new Error("Unauthorized");

  const data = onboardingSchema.parse(input);

  await db.futureSelfProfile.upsert({
    where: { userId },
    create: {
      userId,
      futureYear: data.futureYear,
      coreValues: data.coreValues,
      lifeGoals: data.lifeGoals,
      bio: data.bio,
    },
    update: {
      futureYear: data.futureYear,
      coreValues: data.coreValues,
      lifeGoals: data.lifeGoals,
      bio: data.bio,
    },
  });

  await db.user.update({
    where: { id: userId },
    data: { onboarded: true },
  });
}
