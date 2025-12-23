import { type ClassValue, clsx } from "clsx";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "default" | "lg" | "xl";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          {
            "bg-stone-900 text-stone-50 hover:bg-stone-800 shadow-lg hover:shadow-xl":
              variant === "primary",
            "bg-stone-200 text-stone-900 hover:bg-stone-300": variant === "secondary",
            "hover:bg-stone-100 text-stone-600 hover:text-stone-900": variant === "ghost",
            "h-10 px-4 py-2 text-sm": size === "default",
            "h-14 px-8 text-lg": size === "lg",
            "h-16 px-10 text-xl w-full sm:w-auto": size === "xl",
          },
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, cn };
