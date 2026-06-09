"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { createEcho } from "@/actions/echoes";

const ECHO_TYPES = [
  { value: "MESSAGE", label: "Message", emoji: "💬", desc: "A note to your future self" },
  { value: "PREDICTION", label: "Prediction", emoji: "🔮", desc: "What you think will happen" },
  { value: "DREAM", label: "Dream", emoji: "✨", desc: "A vision or aspiration" },
  { value: "CHALLENGE", label: "Challenge", emoji: "⚡", desc: "A difficulty you're facing" },
  { value: "GOAL", label: "Goal", emoji: "🎯", desc: "Something you're working toward" },
  { value: "MEMORY", label: "Memory", emoji: "📸", desc: "Capture this moment" },
  { value: "QUESTION", label: "Question", emoji: "❓", desc: "Ask your future self" },
];

interface CreateEchoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateEchoModal({ open, onOpenChange }: CreateEchoModalProps) {
  const router = useRouter();
  const [type, setType] = useState("MESSAGE");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t) && tags.length < 5) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createEcho({ type: type as any, content, tags, mood: "HOPEFUL", title: "", isPinned: false });
      router.refresh();
      onOpenChange(false);
      setContent("");
      setTags([]);
      setType("MESSAGE");
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
          <DialogTitle>New Echo</DialogTitle>
          <p className="text-xs text-[#A3A3A3]">Send a message across time to your future self.</p>
        </DialogHeader>

        {/* Type selector */}
        <div className="mb-4">
          <Label className="mb-2 block">Type</Label>
          <div className="grid grid-cols-4 gap-1.5">
            {ECHO_TYPES.map(({ value, label, emoji }) => (
              <button
                key={value}
                onClick={() => setType(value)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border text-xs transition-all duration-150",
                  type === value
                    ? "border-[#FACC15]/50 bg-[#FACC15]/8 text-[#FACC15]"
                    : "border-white/6 text-[#A3A3A3] hover:border-white/14 hover:text-[#FAFAFA]"
                )}
              >
                <span className="text-base">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Label className="mb-2 block">Message</Label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              type === "QUESTION"
                ? "Ask your future self anything..."
                : type === "GOAL"
                ? "I want to achieve..."
                : type === "PREDICTION"
                ? "I predict that by..."
                : "Write to your future self..."
            }
            className="min-h-[120px]"
          />
          <p className="text-xs text-[#A3A3A3]/50 mt-1 text-right">{content.length} / 2000</p>
        </div>

        {/* Tags */}
        <div className="mb-5">
          <Label className="mb-2 block">Tags <span className="text-[#A3A3A3]/50">(optional)</span></Label>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              placeholder="Add tag..."
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={addTag} type="button">Add</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-[#A3A3A3] bg-white/4 border border-white/6 rounded-md px-2 py-0.5"
                >
                  #{tag}
                  <button onClick={() => setTags(tags.filter((t) => t !== tag))}>
                    <X className="w-3 h-3 hover:text-red-400" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!content.trim() || loading}>
            {loading ? "Sending..." : "Send Echo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
