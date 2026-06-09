"use client";

import { useState } from "react";
import { Plus, Lock } from "lucide-react";
import { isPast } from "date-fns";
import { Button } from "@/components/ui/button";
import { CapsuleCard } from "@/components/capsules/CapsuleCard";
import { CreateCapsuleModal } from "@/components/capsules/CreateCapsuleModal";

interface CapsulesClientProps {
  capsules: {
    id: string;
    title: string;
    content: string;
    lockedUntil: Date;
    isUnlocked: boolean;
    aiReflection: string | null;
    createdAt: Date;
  }[];
}

export function CapsulesClient({ capsules }: CapsulesClientProps) {
  const [createOpen, setCreateOpen] = useState(false);

  const ready = capsules.filter((c) => !c.isUnlocked && isPast(c.lockedUntil));
  const locked = capsules.filter((c) => !c.isUnlocked && !isPast(c.lockedUntil));
  const opened = capsules.filter((c) => c.isUnlocked);

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div />
          <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
            <Plus className="w-3.5 h-3.5" />
            New Capsule
          </Button>
        </div>

        {capsules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#171717] border border-white/8 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-[#A3A3A3]" />
            </div>
            <h3 className="text-base font-semibold text-[#FAFAFA] mb-2">No capsules yet</h3>
            <p className="text-sm text-[#A3A3A3] max-w-xs leading-relaxed mb-6">
              Seal a message, memory, or letter to be opened at a future date.
            </p>
            <Button onClick={() => setCreateOpen(true)} size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Create your first capsule
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {ready.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-[#FACC15] uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
                  Ready to open ({ready.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ready.map((c) => <CapsuleCard key={c.id} capsule={c} />)}
                </div>
              </section>
            )}
            {locked.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-[#A3A3A3] uppercase tracking-wider mb-3">
                  Sealed ({locked.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {locked.map((c) => <CapsuleCard key={c.id} capsule={c} />)}
                </div>
              </section>
            )}
            {opened.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-[#A3A3A3]/50 uppercase tracking-wider mb-3">
                  Opened ({opened.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {opened.map((c) => <CapsuleCard key={c.id} capsule={c} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
      <CreateCapsuleModal open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
