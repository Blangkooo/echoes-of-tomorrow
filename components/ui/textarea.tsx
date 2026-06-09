import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-lg border border-white/8 bg-[#262626] px-3 py-2.5",
          "text-sm text-[#FAFAFA] placeholder:text-[#A3A3A3]/50 resize-none",
          "transition-colors duration-150",
          "focus:outline-none focus:border-[#FACC15]/40 focus:ring-1 focus:ring-[#FACC15]/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
