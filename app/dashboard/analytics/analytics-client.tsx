"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MessageSquare, Lock, GitBranch, Target } from "lucide-react";

const ECHO_COLORS: Record<string, string> = {
  MESSAGE: "#60A5FA",
  PREDICTION: "#A78BFA",
  DREAM: "#FACC15",
  CHALLENGE: "#FB923C",
  GOAL: "#4ADE80",
  MEMORY: "#F472B6",
  QUESTION: "#22D3EE",
};

const ECHO_LABELS: Record<string, string> = {
  MESSAGE: "Messages", PREDICTION: "Predictions", DREAM: "Dreams",
  CHALLENGE: "Challenges", GOAL: "Goals", MEMORY: "Memories", QUESTION: "Questions",
};

interface AnalyticsClientProps {
  stats: {
    totalEchoes: number;
    totalCapsules: number;
    totalUniverses: number;
    openedCapsules: number;
    echosByType: { type: string; count: number }[];
    activityMap: Record<string, number>;
    goals: { id: string; title: string; status: string; progress: number }[];
  };
}

export function AnalyticsClient({ stats }: AnalyticsClientProps) {
  const { totalEchoes, totalCapsules, totalUniverses, openedCapsules, echosByType, activityMap, goals } = stats;

  // Activity data for bar chart (last 14 days)
  const activityData = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().split("T")[0];
    return {
      day: d.toLocaleDateString("en", { weekday: "short" }),
      count: activityMap[key] ?? 0,
    };
  });

  const pieData = echosByType.map(({ type, count }) => ({
    name: ECHO_LABELS[type] ?? type,
    value: count,
    color: ECHO_COLORS[type] ?? "#A3A3A3",
  }));

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Echoes", value: totalEchoes, icon: MessageSquare },
          { label: "Capsules", value: totalCapsules, icon: Lock },
          { label: "Parallel Paths", value: totalUniverses, icon: GitBranch },
          { label: "Opened Capsules", value: openedCapsules, icon: Target },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-[#171717] border border-white/6 rounded-xl p-4">
            <Icon className="w-4 h-4 text-[#A3A3A3] mb-3" />
            <p className="text-2xl font-bold text-[#FAFAFA]">{value}</p>
            <p className="text-xs text-[#A3A3A3] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Activity chart */}
        <div className="bg-[#171717] border border-white/6 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-1">Activity (last 14 days)</h3>
          <p className="text-xs text-[#A3A3A3] mb-4">Echoes written per day</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={activityData} barSize={12}>
              <XAxis dataKey="day" tick={{ fill: "#A3A3A3", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: "#171717", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, color: "#FAFAFA", fontSize: 12 }}
                cursor={{ fill: "rgba(250,204,21,0.04)" }}
              />
              <Bar dataKey="count" fill="#FACC15" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Echo types pie */}
        <div className="bg-[#171717] border border-white/6 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-1">Echo types</h3>
          <p className="text-xs text-[#A3A3A3] mb-4">Breakdown by category</p>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-[#A3A3A3] text-sm">
              No echoes yet
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {pieData.map(({ name, value, color }) => (
                  <div key={name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="text-xs text-[#A3A3A3] flex-1 truncate">{name}</span>
                    <span className="text-xs text-[#FAFAFA] font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Goals */}
      {goals.length > 0 && (
        <div className="bg-[#171717] border border-white/6 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-[#FAFAFA] mb-4">Goals</h3>
          <div className="space-y-3">
            {goals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#FAFAFA] truncate">{goal.title}</span>
                    <span className="text-xs text-[#A3A3A3] ml-2 flex-shrink-0">{goal.progress}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/6 overflow-hidden">
                    <div
                      className="h-full bg-[#FACC15] rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-md flex-shrink-0 ${
                  goal.status === "COMPLETED" ? "bg-green-500/10 text-green-400" :
                  goal.status === "IN_PROGRESS" ? "bg-[#FACC15]/10 text-[#FACC15]" :
                  "bg-white/4 text-[#A3A3A3]"
                }`}>
                  {goal.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
