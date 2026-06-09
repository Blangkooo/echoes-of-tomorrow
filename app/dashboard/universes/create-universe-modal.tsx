"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createUniverse } from "@/actions/universes";

const CURRENT_YEAR = new Date().getFullYear();

interface CreateUniverseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateUniverseModal({ open, onOpenChange }: CreateUniverseModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [decisionPoint, setDecisionPoint] = useState("");
  const [divergenceYear, setDivergenceYear] = useState(String(CURRENT_YEAR));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !decisionPoint.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createUniverse({
        title,
        description: description || title,
        decisionPoint,
        divergenceYear: parseInt(divergenceYear) || CURRENT_YEAR,
      });
      router.refresh();
      onOpenChange(false);
      setTitle(""); setDescription(""); setDecisionPoint(""); setDivergenceYear(String(CURRENT_YEAR));
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Parallel Path</DialogTitle>
          <p className="text-xs text-[#A3A3A3]">Explore a &quot;what if&quot; scenario for your life.</p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What if I moved to Berlin?" />
          </div>
          <div>
            <Label className="mb-2 block">Brief description <span className="text-[#A3A3A3]/50">(optional)</span></Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A short summary of this path" />
          </div>
          <div>
            <Label className="mb-2 block">The decision or divergence point</Label>
            <Textarea
              value={decisionPoint}
              onChange={(e) => setDecisionPoint(e.target.value)}
              placeholder="What choice or event marks the fork in this path? What changes?"
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label className="mb-2 block">Year of divergence</Label>
            <Input
              type="number"
              min={1900}
              max={2075}
              value={divergenceYear}
              onChange={(e) => setDivergenceYear(e.target.value)}
              placeholder={String(CURRENT_YEAR)}
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-400 mt-3">{error}</p>}

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !decisionPoint.trim() || loading}>
            {loading ? "Creating..." : "Create Path"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
