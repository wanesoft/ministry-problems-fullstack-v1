import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "./button";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-14 w-full rounded-xl border border-stone-200 bg-white px-6 py-2 text-lg ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-shadow focus:shadow-md",
        className,
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
