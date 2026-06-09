"use server";

import { auth } from "@/auth";

export async function getUserId(): Promise<string> {
  const session = await auth();
  const id = (session?.user as { id?: string })?.id;
  if (!id) throw new Error("Unauthorized");
  return id;
}
