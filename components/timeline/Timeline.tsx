"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { FutureTimelineEntry } from "@/types";
import { cn } from "@/lib/utils";

const categoryConfig = {
  career: { color: "text-violet-400", bg: "bg-violet-500/20", border: "border-violet-500/30" },
  personal: { color: "text-pink-400", bg: "bg-pink-500/20", border: "border-pink-500/30" },
  health: { color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
  finance: { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  adventure: { color: "text-cyan-400", bg: "bg-cyan-500/20", border: "border-cyan-500/30" },
  relationships: { color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/30" },
};

interface TimelineProps {
  entries: FutureTimelineEntry[];
}

export function Timeline({ entries }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-blue-500/30 to-transparent" />

      <div className="space-y-6">
        {entries.map((entry, i) => {
          const cat = categoryConfig[entry.category];
          const isPast = entry.year <= new Date().getFullYear();

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-4 group"
            >
              {/* Node */}
              <div className="relative shrink-0 flex flex-col items-center">
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300",
                    entry.isAchieved
                      ? "bg-green-500/30 border-green-500/60 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
                      : isPast
                      ? "bg-violet-500/20 border-violet-500/40"
                      : "bg-white/5 border-white/20 group-hover:border-white/40"
                  )}
                >
                  {entry.isAchieved ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      isPast ? "bg-violet-400" : "bg-white/20"
                    )} />
                  )}
                </motion.div>
              </div>

              {/* Content */}
              <div className={cn(
                "flex-1 pb-2 group-hover:translate-x-1 transition-transform duration-200"
              )}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded-full border",
                    cat.bg, cat.border, cat.color
                  )}>
                    {entry.year}
                  </span>
                  <span className={cn("text-xs capitalize", cat.color)}>
                    {entry.category}
                  </span>
                  <span className="text-xs text-white/30 ml-auto">
                    {entry.probability}% likely
                  </span>
                </div>

                <h3 className="font-semibold text-white/90 text-sm mb-1">{entry.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{entry.description}</p>

                {/* Probability bar */}
                <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${entry.probability}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 + 0.3 }}
                    className={cn("h-full rounded-full", cat.bg.replace("/20", "/60"))}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
