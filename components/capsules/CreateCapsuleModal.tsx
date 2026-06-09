"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createCapsule } from "@/actions/capsules";

const DURATIONS = [
  { value: "ONE_MONTH", label: "1 month", months: 1 },
  { value: "ONE_YEAR", label: "1 year", months: 12 },
  { value: "FIVE_YEARS", label: "5 years", months: 60 },
  { value: "TEN_YEARS", label: "10 years", months: 120 },
];

interface CreateCapsuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCapsuleModal({ open, onOpenChange }: CreateCapsuleModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [duration, setDuration] = useState("ONE_YEAR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createCapsule({ title, content, duration: duration as any, mood: "REFLECTIVE" });
      router.refresh();
      onOpenChange(false);
      setTitle("");
      setContent("");
      setDuration("ONE_YEAR");
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
          <DialogTitle>Create Time Capsule</DialogTitle>
          <p className="text-xs text-[#A3A3A3]">Seal a message to be opened at a future date.</p>
        </DialogHeader>

        <div className="mb-4">
          <Label className="mb-2 block">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A letter to myself in..."
          />
        </div>

        <div className="mb-4">
          <Label className="mb-2 block">Message</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write what you want your future self to remember..."
            className="min-h-[140px]"
          />
        </div>

        <div className="mb-5">
          <Label className="mb-2 block">Lock for</Label>
          <div className="grid grid-cols-4 gap-2">
            {DURATIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setDuration(value)}
                className={cn(
                  "py-2 rounded-xl border text-sm font-medium transition-all duration-150",
                  duration === value
                    ? "border-[#FACC15]/50 bg-[#FACC15]/10 text-[#FACC15]"
                    : "border-white/6 text-[#A3A3A3] hover:border-white/14 hover:text-[#FAFAFA]"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lock warning */}
        <div className="flex items-start gap-2.5 bg-[#262626] border border-white/6 rounded-xl p-3 mb-5">
          <Lock className="w-3.5 h-3.5 text-[#A3A3A3] mt-0.5 flex-shrink-0" />
          <p className="text-xs text-[#A3A3A3] leading-relaxed">
            Once sealed, this capsule cannot be read until the unlock date. Your Future Self will also leave a reflection when you open it.
          </p>
        </div>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || !content.trim() || loading}>
            {loading ? "Sealing..." : "Seal Capsule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
