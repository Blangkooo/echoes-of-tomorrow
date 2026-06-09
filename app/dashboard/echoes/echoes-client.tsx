"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EchoCard } from "@/components/echoes/EchoCard";
import { CreateEchoModal } from "@/components/echoes/CreateEchoModal";
import { cn } from "@/lib/utils";

const TYPE_FILTERS = [
  { value: "ALL", label: "All" },
  { value: "MESSAGE", label: "Messages" },
  { value: "GOAL", label: "Goals" },
  { value: "PREDICTION", label: "Predictions" },
  { value: "DREAM", label: "Dreams" },
  { value: "CHALLENGE", label: "Challenges" },
  { value: "MEMORY", label: "Memories" },
  { value: "QUESTION", label: "Questions" },
];

interface EchoesClientProps {
  echoes: {
    id: string;
    type: string;
    content: string;
    futureResponse: string | null;
    isPinned: boolean;
    targetDate: Date | null;
    createdAt: Date;
    tags: string[];
  }[];
}

export function EchoesClient({ echoes }: EchoesClientProps) {
  const [filter, setFilter] = useState("ALL");
  const [createOpen, setCreateOpen] = useState(false);

  const filtered = filter === "ALL" ? echoes : echoes.filter((e) => e.type === filter);

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {/* Toolbar */}
        <div className="sticky top-0 z-10 bg-[#0A0A0A]/90 backdrop-blur-sm border-b border-white/6 px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Filters */}
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
              {TYPE_FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150",
                    filter === value
                      ? "border-[#FACC15]/50 bg-[#FACC15]/10 text-[#FACC15]"
                      : "border-white/6 text-[#A3A3A3] hover:border-white/14 hover:text-[#FAFAFA]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setCreateOpen(true)}
              size="sm"
              className="flex-shrink-0 gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Echo
            </Button>
          </div>
        </div>

        {/* Grid */}
        <div className="px-6 py-6">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <p className="text-[#A3A3A3] text-sm mb-1">No echoes yet</p>
                <p className="text-[#A3A3A3]/50 text-xs mb-6">
                  {filter === "ALL" ? "Write your first echo below." : `No ${filter.toLowerCase()} echoes.`}
                </p>
                <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Write an echo
                </Button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((echo) => (
                  <EchoCard key={echo.id} echo={echo} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CreateEchoModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
