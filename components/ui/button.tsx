import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FACC15]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#FACC15] text-[#0A0A0A] font-semibold rounded-xl hover:bg-[#EAB308] hover:scale-[1.02] active:scale-[0.98] shadow-gold-sm",
        secondary:
          "bg-[#262626] text-[#FAFAFA]/80 border border-white/8 rounded-xl hover:bg-[#303030] hover:text-[#FAFAFA]",
        outline:
          "border border-white/10 bg-transparent text-[#FAFAFA]/70 rounded-xl hover:bg-white/5 hover:border-white/20 hover:text-[#FAFAFA]",
        ghost:
          "text-[#FAFAFA]/60 rounded-xl hover:bg-white/5 hover:text-[#FAFAFA]/90",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl hover:bg-red-500/20",
        link:
          "text-[#FACC15] underline-offset-4 hover:underline p-0 h-auto",
        glass:
          "glass text-[#FAFAFA]/80 rounded-xl hover:bg-white/8 hover:text-[#FAFAFA]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-base",
        xl: "h-13 rounded-2xl px-8 text-base font-semibold",
        icon: "h-9 w-9 rounded-lg",
        "icon-sm": "h-7 w-7 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
