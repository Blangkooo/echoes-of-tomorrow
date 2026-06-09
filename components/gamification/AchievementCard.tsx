"use client";

import { motion } from "framer-motion";
import {
  Zap, Eye, Clock, GitBranch, Flame, BookOpen, Layers, Star,
} from "lucide-react";
import { Achievement } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, calculateProgress } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Zap, Eye, Clock, GitBranch, Flame, BookOpen, Layers, Star,
};

const tierConfig = {
  bronze: { label: "Bronze", color: "text-orange-700", bg: "bg-orange-700/20", border: "border-orange-700/30", glow: "" },
  silver: { label: "Silver", color: "text-slate-300", bg: "bg-slate-300/20", border: "border-slate-300/30", glow: "" },
  gold: { label: "Gold", color: "text-yellow-400", bg: "bg-yellow-400/20", border: "border-yellow-400/30", glow: "shadow-glow-gold" },
  platinum: { label: "Platinum", color: "text-cyan-300", bg: "bg-cyan-300/20", border: "border-cyan-300/30", glow: "shadow-glow-blue" },
  cosmic: { label: "Cosmic", color: "text-violet-300", bg: "bg-violet-300/20", border: "border-violet-300/30", glow: "shadow-glow-purple" },
};

interface AchievementCardProps {
  achievement: Achievement;
  index?: number;
}

export function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
  const tier = tierConfig[achievement.tier];
  const IconComponent = iconMap[achievement.icon] || Star;
  const progress = calculateProgress(achievement.progress, achievement.maxProgress);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className={cn(
        "transition-all duration-300",
        achievement.isUnlocked
          ? `${tier.glow} border-white/15 hover:border-white/25`
          : "opacity-60 grayscale"
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
              tier.bg, tier.border
            )}>
              <IconComponent className={cn("w-5 h-5", tier.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-semibold text-sm text-white/90 truncate">{achievement.title}</h4>
                <span className={cn("text-xs font-medium shrink-0", tier.color)}>
                  {tier.label}
                </span>
              </div>
              <p className="text-xs text-white/40 mb-2">{achievement.description}</p>

              {!achievement.isUnlocked && (
                <div>
                  <div className="flex justify-between text-xs text-white/30 mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              )}

              {achievement.isUnlocked && achievement.unlockedAt && (
                <p className="text-xs text-white/30">
                  Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
