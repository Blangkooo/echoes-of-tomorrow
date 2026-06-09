"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { onboardingSchema } from "@/lib/validations";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function completeOnboarding(input: z.infer<typeof onboardingSchema>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const data = onboardingSchema.parse(input);

  await Promise.all([
    db.futureSelfProfile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
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
    }),
    db.user.update({
      where: { id: session.user.id },
      data: { onboarded: true },
    }),
  ]);

  redirect("/dashboard");
}
