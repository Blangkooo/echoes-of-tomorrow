import { auth } from "@/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { MessageSquare, Lock, Sparkles, GitBranch, Clock, ArrowRight, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

async function getDashboardData(userId: string) {
  const [echoCount, capsuleCount, universeCount, recentEchoes, profile] = await Promise.all([
    db.echo.count({ where: { userId } }),
    db.timeCapsule.count({ where: { userId } }),
    db.universeScenario.count({ where: { userId } }),
    db.echo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.futureSelfProfile.findUnique({ where: { userId } }),
  ]);

  return { echoCount, capsuleCount, universeCount, recentEchoes, profile };
}

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session!.user as { id: string }).id;
  const { echoCount, capsuleCount, universeCount, recentEchoes, profile } = await getDashboardData(userId);

  const firstName = session!.user?.name?.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const ECHO_TYPE_ICONS: Record<string, string> = {
    MESSAGE: "💬", PREDICTION: "🔮", DREAM: "✨", CHALLENGE: "⚡",
    GOAL: "🎯", MEMORY: "📸", QUESTION: "❓",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Header title="Overview" />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Greeting */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#FAFAFA] mb-1">
            {greeting}, {firstName}
          </h2>
          <p className="text-sm text-[#A3A3A3]">
            {profile?.futureYear
              ? `Your Future Self awaits in ${profile.futureYear}.`
              : "Your journey across time starts here."}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Echoes", count: echoCount, icon: MessageSquare, href: "/dashboard/echoes" },
            { label: "Capsules", count: capsuleCount, icon: Lock, href: "/dashboard/capsules" },
            { label: "Parallel Paths", count: universeCount, icon: GitBranch, href: "/dashboard/universes" },
          ].map(({ label, count, icon: Icon, href }) => (
            <Link key={label} href={href}>
              <div className="bg-[#171717] border border-white/6 rounded-xl p-4 hover:border-white/12 hover:bg-[#1A1A1A] transition-all duration-150 group">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-4 h-4 text-[#A3A3A3] group-hover:text-[#FAFAFA] transition-colors" />
                  <ArrowRight className="w-3 h-3 text-[#A3A3A3]/0 group-hover:text-[#A3A3A3] transition-all" />
                </div>
                <p className="text-2xl font-bold text-[#FAFAFA]">{count}</p>
                <p className="text-xs text-[#A3A3A3] mt-0.5">{label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/dashboard/echoes">
            <div className="bg-[#FACC15]/8 border border-[#FACC15]/20 rounded-xl p-4 hover:bg-[#FACC15]/12 transition-all duration-150 group">
              <div className="flex items-center gap-2 mb-2">
                <Plus className="w-4 h-4 text-[#FACC15]" />
                <span className="text-sm font-medium text-[#FAFAFA]">New Echo</span>
              </div>
              <p className="text-xs text-[#A3A3A3]">Send a message to your future self</p>
            </div>
          </Link>
          <Link href="/dashboard/future-self">
            <div className="bg-[#171717] border border-white/6 rounded-xl p-4 hover:border-white/12 transition-all duration-150 group">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#A3A3A3] group-hover:text-[#FAFAFA] transition-colors" />
                <span className="text-sm font-medium text-[#FAFAFA]">Talk to Future Self</span>
              </div>
              <p className="text-xs text-[#A3A3A3]">AI-powered reflection conversations</p>
            </div>
          </Link>
        </div>

        {/* Recent echoes */}
        {recentEchoes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#FAFAFA]">Recent Echoes</h3>
              <Link href="/dashboard/echoes" className="text-xs text-[#A3A3A3] hover:text-[#FACC15] transition-colors flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {recentEchoes.map((echo) => (
                <div
                  key={echo.id}
                  className="bg-[#171717] border border-white/6 rounded-xl p-4 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-base mt-0.5">{ECHO_TYPE_ICONS[echo.type] ?? "💬"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#FAFAFA] line-clamp-2 leading-relaxed">
                        {echo.content}
                      </p>
                      <p className="text-xs text-[#A3A3A3] mt-1.5">
                        {formatDistanceToNow(echo.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {echoCount === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-white/8 flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-[#A3A3A3]" />
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA] mb-2">Your timeline is empty</h3>
            <p className="text-sm text-[#A3A3A3] max-w-xs leading-relaxed mb-6">
              Write your first echo — a message, goal, dream, or question for your future self.
            </p>
            <Link
              href="/dashboard/echoes"
              className="inline-flex items-center gap-2 bg-[#FACC15] text-black text-sm font-medium px-4 py-2 rounded-xl hover:bg-[#EAB308] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Write your first echo
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
