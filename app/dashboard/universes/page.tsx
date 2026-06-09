import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { UniversesClient } from "./universes-client";

export default async function UniversesPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const universes = await db.universeScenario.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      decisionPoint: true,
      divergenceYear: true,
      probability: true,
      isPublic: true,
      createdAt: true,
    },
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Parallel Paths" subtitle="Explore alternate versions of your future" />
      <UniversesClient universes={universes} />
    </div>
  );
}
