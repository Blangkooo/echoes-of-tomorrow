import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/20 px-2.5 py-0.5",
        secondary:
          "bg-white/6 text-[#A3A3A3] border border-white/8 px-2.5 py-0.5",
        outline:
          "border border-white/10 text-[#A3A3A3] px-2.5 py-0.5",
        green:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5",
        red:
          "bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-0.5",
        blue:
          "bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5",
        purple:
          "bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2.5 py-0.5",
        amber:
          "bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-0.5",
        ghost:
          "text-[#A3A3A3] px-0 py-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
