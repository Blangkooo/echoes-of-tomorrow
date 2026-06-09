"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type AIMode, useUIStore } from "@/store/useUIStore";

const PERSONALITIES: { mode: AIMode; label: string; desc: string; emoji: string }[] = [
  { mode: "MENTOR", label: "Mentor", desc: "Warm & thoughtful", emoji: "🧭" },
  { mode: "OPTIMISTIC", label: "Optimistic", desc: "Hopeful & energized", emoji: "☀️" },
  { mode: "REALISTIC", label: "Realistic", desc: "Direct & grounded", emoji: "⚖️" },
  { mode: "ENTREPRENEUR", label: "Builder", desc: "Systems & leverage", emoji: "🚀" },
  { mode: "CREATIVE", label: "Creative", desc: "Lyrical & meaning-driven", emoji: "🎨" },
];

export function PersonalitySelector() {
  const { aiMode, setAIMode } = useUIStore();

  return (
    <div className="flex gap-2 flex-wrap">
      {PERSONALITIES.map(({ mode, label, desc, emoji }) => {
        const active = aiMode === mode;
        return (
          <motion.button
            key={mode}
            onClick={() => setAIMode(mode)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-150",
              active
                ? "border-[#FACC15]/50 bg-[#FACC15]/10 text-[#FACC15]"
                : "border-white/8 text-[#A3A3A3] hover:border-white/16 hover:text-[#FAFAFA]"
            )}
            title={desc}
          >
            <span>{emoji}</span>
            {label}
          </motion.button>
        );
      })}
    </div>
  );
}
