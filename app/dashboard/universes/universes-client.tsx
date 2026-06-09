"use client";

import { useState } from "react";
import { Plus, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UniverseCard } from "@/components/universes/UniverseCard";
import { CreateUniverseModal } from "./create-universe-modal";

interface UniversesClientProps {
  universes: {
    id: string;
    title: string;
    description: string;
    decisionPoint: string;
    divergenceYear: number;
    probability: number;
    isPublic: boolean;
    createdAt: Date;
  }[];
}

export function UniversesClient({ universes }: UniversesClientProps) {
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-[#A3A3A3]">
            Each path is a &quot;what if&quot; — a life you could have lived, or might still.
          </p>
          <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5 flex-shrink-0 ml-4">
            <Plus className="w-3.5 h-3.5" />
            New Path
          </Button>
        </div>

        {universes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-white/8 flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6 text-[#A3A3A3]" />
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA] mb-2">No parallel paths yet</h3>
            <p className="text-sm text-[#A3A3A3] max-w-xs leading-relaxed mb-6">
              Explore alternate versions of your future. What if you took a different path?
            </p>
            <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Create your first path
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {universes.map((u) => (
              <UniverseCard key={u.id} universe={u} />
            ))}
          </div>
        )}
      </div>
      <CreateUniverseModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
