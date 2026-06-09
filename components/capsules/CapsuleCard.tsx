"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Clock, Sparkles, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { format, formatDistanceToNow, isPast } from "date-fns";
import { cn } from "@/lib/utils";
import { unlockCapsule, deleteCapsule } from "@/actions/capsules";
import { useRouter } from "next/navigation";

interface CapsuleCardProps {
  capsule: {
    id: string;
    title: string;
    content: string;
    lockedUntil: Date;
    isUnlocked: boolean;
    aiReflection: string | null;
    createdAt: Date;
  };
}

export function CapsuleCard({ capsule }: CapsuleCardProps) {
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [localReflection, setLocalReflection] = useState(capsule.aiReflection);
  const [isUnlocked, setIsUnlocked] = useState(capsule.isUnlocked);

  const canUnlock = isPast(capsule.lockedUntil);

  const handleUnlock = async () => {
    if (!canUnlock || isUnlocked) return;
    setUnlocking(true);
    try {
      const result = await unlockCapsule(capsule.id);
      setIsUnlocked(true);
      setLocalReflection(result?.aiReflection ?? null);
      setShowContent(true);
      router.refresh();
    } finally {
      setUnlocking(false);
    }
  };

  const handleDelete = async () => {
    setDeleted(true);
    await deleteCapsule(capsule.id);
    router.refresh();
  };

  if (deleted) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "bg-[#171717] border rounded-xl p-5 transition-all duration-150 group",
        isUnlocked ? "border-[#FACC15]/20" : canUnlock ? "border-[#FACC15]/30 hover:border-[#FACC15]/50" : "border-white/6 hover:border-white/10"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
            isUnlocked ? "bg-[#FACC15]/15 text-[#FACC15]" : canUnlock ? "bg-[#FACC15]/10 text-[#FACC15]" : "bg-white/6 text-[#A3A3A3]"
          )}>
            {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#FAFAFA]">{capsule.title}</h3>
            <p className="text-xs text-[#A3A3A3]">
              {isUnlocked
                ? `Opened ${formatDistanceToNow(capsule.lockedUntil, { addSuffix: true })}`
                : canUnlock
                ? "Ready to unlock"
                : `Opens ${format(capsule.lockedUntil, "MMM d, yyyy")}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-500/8 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {!isUnlocked && (
        <div className="flex items-center gap-1.5 text-xs text-[#A3A3A3] mb-3">
          <Clock className="w-3 h-3" />
          {canUnlock ? "This capsule is ready to be opened" : `${formatDistanceToNow(capsule.lockedUntil)} remaining`}
        </div>
      )}

      {canUnlock && !isUnlocked && (
        <motion.button
          onClick={handleUnlock}
          disabled={unlocking}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2.5 rounded-xl bg-[#FACC15] text-black text-sm font-semibold hover:bg-[#EAB308] transition-colors mb-3 disabled:opacity-50"
        >
          {unlocking ? "Opening..." : "Open Capsule"}
        </motion.button>
      )}

      {isUnlocked && (
        <div className="mt-2">
          <button
            onClick={() => setShowContent(!showContent)}
            className="flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors mb-2"
          >
            {showContent ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showContent ? "Hide" : "Read"} capsule
          </button>
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-white/3 border border-white/6 p-4 mb-3">
                  <p className="text-sm text-[#FAFAFA]/80 leading-relaxed whitespace-pre-wrap">{capsule.content}</p>
                </div>
                {localReflection && (
                  <div className="rounded-xl bg-[#FACC15]/5 border border-[#FACC15]/15 p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                      <span className="text-xs font-medium text-[#FACC15]/80">Future Self reflection</span>
                    </div>
                    <p className="text-sm text-[#FAFAFA]/80 leading-relaxed whitespace-pre-wrap">{localReflection}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-[#A3A3A3]/50 mt-3 pt-3 border-t border-white/6">
        <span>Created {formatDistanceToNow(capsule.createdAt, { addSuffix: true })}</span>
        <span>Unlocks {format(capsule.lockedUntil, "MMM yyyy")}</span>
      </div>
    </motion.div>
  );
}
