import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { AnalyticsClient } from "./analytics-client";
import { subDays, startOfDay } from "date-fns";

export default async function AnalyticsPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [
    totalEchoes,
    totalCapsules,
    totalUniverses,
    openedCapsules,
    echosByType,
    recentEchoes,
    goals,
  ] = await Promise.all([
    db.echo.count({ where: { userId } }),
    db.timeCapsule.count({ where: { userId } }),
    db.universeScenario.count({ where: { userId } }),
    db.timeCapsule.count({ where: { userId, isUnlocked: true } }),
    db.echo.groupBy({
      by: ["type"],
      where: { userId },
      _count: { type: true },
    }),
    // Last 30 days activity
    db.echo.findMany({
      where: { userId, createdAt: { gte: subDays(new Date(), 30) } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
    db.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  // Build 30-day activity heatmap
  const activityMap: Record<string, number> = {};
  recentEchoes.forEach((e) => {
    const key = startOfDay(e.createdAt).toISOString().split("T")[0];
    activityMap[key] = (activityMap[key] ?? 0) + 1;
  });

  const stats = {
    totalEchoes,
    totalCapsules,
    totalUniverses,
    openedCapsules,
    echosByType: echosByType.map((e) => ({ type: e.type, count: e._count.type })),
    activityMap,
    goals,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Insights" subtitle="Your journey in numbers" />
      <AnalyticsClient stats={stats} />
    </div>
  );
}
