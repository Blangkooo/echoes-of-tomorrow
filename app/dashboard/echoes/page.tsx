import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { EchoesClient } from "./echoes-client";

export default async function EchoesPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const echoes = await db.echo.findMany({
    where: { userId },
    orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      type: true,
      content: true,
      futureResponse: true,
      isPinned: true,
      targetDate: true,
      createdAt: true,
      tags: true,
    },
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Echoes" subtitle="Messages across time" />
      <EchoesClient echoes={echoes} />
    </div>
  );
}
