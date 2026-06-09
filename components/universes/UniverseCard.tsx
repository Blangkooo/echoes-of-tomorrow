"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Globe, Lock, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { deleteUniverse, toggleUniverseVisibility } from "@/actions/universes";
import { useRouter } from "next/navigation";

interface UniverseCardProps {
  universe: {
    id: string;
    title: string;
    description: string;
    decisionPoint: string;
    divergenceYear: number;
    probability: number;
    isPublic: boolean;
    createdAt: Date;
  };
}

export function UniverseCard({ universe }: UniverseCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [isPublic, setIsPublic] = useState(universe.isPublic);
  const [deleted, setDeleted] = useState(false);

  const handleToggle = async () => {
    setIsPublic(!isPublic);
    await toggleUniverseVisibility(universe.id);
  };

  const handleDelete = async () => {
    setDeleted(true);
    await deleteUniverse(universe.id);
    router.refresh();
  };

  if (deleted) return null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#171717] border border-white/6 rounded-xl overflow-hidden hover:border-white/10 transition-colors group"
    >
      <div className="h-1 bg-gradient-to-r from-[#FACC15]/40 via-[#FACC15]/20 to-transparent" />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#FACC15]/10 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-3.5 h-3.5 text-[#FACC15]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#FAFAFA]">{universe.title}</h3>
              <p className="text-xs text-[#A3A3A3]">Diverges in {universe.divergenceYear}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggle}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                isPublic ? "text-[#FACC15] bg-[#FACC15]/10" : "text-[#A3A3A3] hover:text-[#FAFAFA] hover:bg-white/6"
              )}
              title={isPublic ? "Make private" : "Make public"}
            >
              {isPublic ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-[#A3A3A3] hover:text-red-400 hover:bg-red-500/8 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <p className="text-sm text-[#A3A3A3] leading-relaxed mb-3">{universe.description}</p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors"
        >
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {expanded ? "Less" : "Decision point"}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-xl bg-white/3 border border-white/6 p-3">
                <p className="text-xs font-medium text-[#A3A3A3] mb-1.5">The fork in the road</p>
                <p className="text-sm text-[#FAFAFA]/80 leading-relaxed whitespace-pre-wrap">{universe.decisionPoint}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between text-xs text-[#A3A3A3]/50 mt-4 pt-3 border-t border-white/6">
          <span>{formatDistanceToNow(universe.createdAt, { addSuffix: true })}</span>
          <span>{universe.probability}% likely · {isPublic ? "Public" : "Private"}</span>
        </div>
      </div>
    </motion.div>
  );
}
