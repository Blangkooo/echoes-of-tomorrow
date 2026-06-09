import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Header } from "@/components/layout/Header";
import { format, formatDistanceToNow } from "date-fns";

const ECHO_EMOJIS: Record<string, string> = {
  MESSAGE: "💬", PREDICTION: "🔮", DREAM: "✨", CHALLENGE: "⚡",
  GOAL: "🎯", MEMORY: "📸", QUESTION: "❓",
};

export default async function TimelinePage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;

  const [echoes, capsules, profile] = await Promise.all([
    db.echo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, type: true, content: true, createdAt: true },
    }),
    db.timeCapsule.findMany({
      where: { userId },
      orderBy: { lockedUntil: "asc" },
      select: { id: true, title: true, lockedUntil: true, isUnlocked: true },
    }),
    db.futureSelfProfile.findUnique({
      where: { userId },
      select: { futureYear: true },
    }),
  ]);

  const events = [
    ...echoes.map((e) => ({
      id: e.id,
      type: "echo" as const,
      emoji: ECHO_EMOJIS[e.type] ?? "💬",
      title: e.type.charAt(0) + e.type.slice(1).toLowerCase(),
      content: e.content,
      date: e.createdAt,
      isPast: true,
    })),
    ...capsules.map((c) => ({
      id: c.id,
      type: "capsule" as const,
      emoji: c.isUnlocked ? "📬" : "📦",
      title: c.title,
      content: c.isUnlocked ? "Opened" : `Opens ${format(c.lockedUntil, "MMM d, yyyy")}`,
      date: c.lockedUntil,
      isPast: c.isUnlocked,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header
        title="Timeline"
        subtitle={profile?.futureYear ? `Your story — present to ${profile.futureYear}` : "Your journey across time"}
      />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-[#A3A3A3] text-sm mb-1">Your timeline is empty</p>
            <p className="text-[#A3A3A3]/50 text-xs">Start writing echoes to build your story.</p>
          </div>
        ) : (
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/6" />
            <div className="space-y-0">
              {events.map((event) => (
                <div key={event.id} className="relative flex gap-6 pb-8 last:pb-0">
                  <div className="relative z-10 flex-shrink-0 w-8 flex items-start pt-1 justify-center">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${event.isPast ? "bg-[#FACC15]" : "bg-white/20"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-[#171717] border border-white/6 rounded-xl p-4 hover:border-white/10 transition-colors">
                      <div className="flex items-start gap-2.5">
                        <span className="text-base flex-shrink-0 mt-0.5">{event.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-xs font-medium text-[#A3A3A3]">{event.title}</span>
                            <span className="text-xs text-[#A3A3A3]/50 flex-shrink-0">
                              {event.isPast
                                ? formatDistanceToNow(event.date, { addSuffix: true })
                                : format(event.date, "MMM d, yyyy")}
                            </span>
                          </div>
                          <p className="text-sm text-[#FAFAFA]/80 leading-relaxed line-clamp-3">
                            {event.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {profile?.futureYear && (
              <div className="relative flex gap-6">
                <div className="relative z-10 flex-shrink-0 w-8 flex justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#FACC15] ring-4 ring-[#FACC15]/20 mt-0.5" />
                </div>
                <div className="flex-1 pb-4">
                  <span className="text-sm font-semibold text-[#FACC15]">{profile.futureYear}</span>
                  <p className="text-xs text-[#A3A3A3] mt-0.5">Your future self awaits here</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
