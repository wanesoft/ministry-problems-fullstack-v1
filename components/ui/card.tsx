import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./button";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
	({ className, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className={cn(
					"rounded-2xl border border-stone-100 bg-white p-6 shadow-sm md:p-10",
					className,
				)}
				{...props}
			/>
		);
	},
);
Card.displayName = "Card";

export { Card };
