import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { CapsulesClient } from "./capsules-client";

export default async function CapsulesPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const capsules = await db.timeCapsule.findMany({
    where: { userId },
    orderBy: { lockedUntil: "asc" },
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Time Capsules" subtitle="Messages sealed in time" />
      <CapsulesClient capsules={capsules} />
    </div>
  );
}
