"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import { deleteEcho, pinEcho } from "@/actions/echoes";

const ECHO_TYPE_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  MESSAGE: { label: "Message", emoji: "💬", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  PREDICTION: { label: "Prediction", emoji: "🔮", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  DREAM: { label: "Dream", emoji: "✨", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  CHALLENGE: { label: "Challenge", emoji: "⚡", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  GOAL: { label: "Goal", emoji: "🎯", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  MEMORY: { label: "Memory", emoji: "📸", color: "text-pink-400 bg-pink-400/10 border-pink-400/20" },
  QUESTION: { label: "Question", emoji: "❓", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
};

interface EchoCardProps {
  echo: {
    id: string;
    type: string;
    content: string;
    futureResponse: string | null;
    isPinned: boolean;
    targetDate: Date | null;
    createdAt: Date;
    tags: string[];
  };
}

export function EchoCard({ echo }: EchoCardProps) {
  const [showResponse, setShowResponse] = useState(false);
  const [isPinned, setIsPinned] = useState(echo.isPinned);
  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);

  const config = ECHO_TYPE_CONFIG[echo.type] ?? ECHO_TYPE_CONFIG.MESSAGE;

  const handlePin = async () => {
    setIsPinned(!isPinned);
    await pinEcho(echo.id);
  };

  const handleDelete = async () => {
    setLoading(true);
    setDeleted(true);
    await deleteEcho(echo.id);
  };

  if (deleted) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#171717] border border-white/6 rounded-xl p-5 hover:border-white/10 transition-colors group"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border",
              config.color
            )}
          >
            <span>{config.emoji}</span>
            {config.label}
          </span>
          {isPinned && (
            <span className="text-xs text-[#FACC15]/70 font-medium">Pinned</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePin}
            className={cn(
              "p-1.5 rounded-lg transition-colors",
              isPinned
                ? "text-[#FACC15] bg-[#FACC15]/10"
                : "text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-white/6"
            )}
            title={isPinned ? "Unpin" : "Pin"}
          >
            <Pin className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-500/8 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-[#FAFAFA]/90 leading-relaxed mb-3 whitespace-pre-wrap">
        {echo.content}
      </p>

      {/* Tags */}
      {echo.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {echo.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#A3A3A3] bg-white/4 border border-white/6 rounded-md px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-[#A3A3A3]/60 mt-3 pt-3 border-t border-white/6">
        <span>{formatDistanceToNow(echo.createdAt, { addSuffix: true })}</span>
        {echo.targetDate && (
          <span>Opens {format(echo.targetDate, "MMM yyyy")}</span>
        )}
      </div>

      {/* Future response */}
      {echo.futureResponse && (
        <div className="mt-3">
          <button
            onClick={() => setShowResponse(!showResponse)}
            className="flex items-center gap-1.5 text-xs text-[#FACC15]/80 hover:text-[#FACC15] transition-colors font-medium"
          >
            {showResponse ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {showResponse ? "Hide" : "Show"} future response
          </button>
          <AnimatePresence>
            {showResponse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-3 rounded-xl bg-[#FACC15]/5 border border-[#FACC15]/15">
                  <p className="text-xs font-medium text-[#FACC15]/80 mb-1.5">From your future self</p>
                  <p className="text-sm text-[#FAFAFA]/80 leading-relaxed whitespace-pre-wrap">
                    {echo.futureResponse}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
