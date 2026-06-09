import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { FutureSelfChat } from "@/components/future-self/FutureSelfChat";

export default async function FutureSelfPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  // Get or create a conversation
  let conversation = await db.conversation.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  if (!conversation) {
    conversation = await db.conversation.create({
      data: { userId, title: "My Future Self" },
    });
  }

  const profile = await db.futureSelfProfile.findUnique({ where: { userId } });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Future Self"
        subtitle={profile?.futureYear ? `Speaking from ${profile.futureYear}` : "AI-powered reflection"}
      />
      <FutureSelfChat
        conversationId={conversation.id}
        futureYear={profile?.futureYear ?? undefined}
      />
    </div>
  );
}
