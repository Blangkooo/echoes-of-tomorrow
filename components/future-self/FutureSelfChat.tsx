"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PersonalitySelector } from "./PersonalitySelector";
import { useUIStore } from "@/store/useUIStore";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface FutureSelfChatProps {
  conversationId?: string;
  futureYear?: number;
}

const STARTER_PROMPTS = [
  "Am I on the right path?",
  "What should I focus on right now?",
  "What do you wish I'd done differently?",
  "How do I look back on this chapter of my life?",
];

export function FutureSelfChat({ conversationId, futureYear }: FutureSelfChatProps) {
  const { aiMode } = useUIStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading, reload, error } = useChat({
    api: "/api/chat",
    body: {
      mode: aiMode,
      conversationId,
    },
    id: conversationId ?? "default",
  });

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  const displayMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex flex-col h-full">
      {/* Personality bar */}
      <div className="px-6 py-3 border-b border-white/6 flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
          <span className="text-xs text-[#A3A3A3]">Future Self mode:</span>
        </div>
        <PersonalitySelector />
        {displayMessages.length > 0 && (
          <button
            onClick={() => reload()}
            className="ml-auto text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors"
            title="Regenerate last response"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {displayMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-2xl bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#FACC15]" />
            </div>
            <h3 className="text-sm font-semibold text-[#FAFAFA] mb-1.5">
              Your Future Self is listening
            </h3>
            <p className="text-xs text-[#A3A3A3] mb-6 max-w-xs leading-relaxed">
              {futureYear
                ? `Speak from ${new Date().getFullYear()}. Your Future Self in ${futureYear} will respond.`
                : "Ask anything. Your Future Self understands where you've been."}
            </p>
            {/* Starter prompts */}
            <div className="flex flex-col gap-2 w-full max-w-xs">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="text-left text-xs text-[#A3A3A3] px-3.5 py-2.5 rounded-xl border border-white/6 hover:border-white/12 hover:text-[#FAFAFA] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {displayMessages.map((message) => {
              const isUser = message.role === "user";
              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                      isUser
                        ? "bg-[#262626] border border-white/8"
                        : "bg-[#FACC15]/10 border border-[#FACC15]/20"
                    )}
                  >
                    {isUser ? (
                      <User className="w-3.5 h-3.5 text-[#A3A3A3]" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      isUser
                        ? "bg-[#262626] text-[#FAFAFA] rounded-tr-sm"
                        : "bg-[#171717] border border-white/6 text-[#FAFAFA]/90 rounded-tl-sm"
                    )}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={cn("text-xs mt-1.5", isUser ? "text-[#A3A3A3]/50 text-right" : "text-[#A3A3A3]/50")}>
                      {message.createdAt
                        ? formatDistanceToNow(message.createdAt, { addSuffix: true })
                        : "just now"}
                    </p>
                  </div>
                </motion.div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#FACC15]" />
                </div>
                <div className="bg-[#171717] border border-white/6 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center h-4">
                    {[0, 0.15, 0.3].map((delay) => (
                      <motion.div
                        key={delay}
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay }}
                        className="w-1.5 h-1.5 rounded-full bg-[#A3A3A3]"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {error && (
          <div className="text-center">
            <p className="text-xs text-red-400">Something went wrong. Try again.</p>
            <button
              onClick={() => reload()}
              className="text-xs text-[#A3A3A3] hover:text-[#FAFAFA] mt-1 transition-colors"
            >
              Retry
            </button>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-white/6 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write to your future self..."
            className="min-h-[52px] max-h-[140px] resize-none"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-[52px] w-[52px] flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        <p className="text-xs text-[#A3A3A3]/40 mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
