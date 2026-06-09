import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-white/8 bg-[#262626] px-3 py-2",
          "text-sm text-[#FAFAFA] placeholder:text-[#A3A3A3]/50",
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
Input.displayName = "Input";

export { Input };
