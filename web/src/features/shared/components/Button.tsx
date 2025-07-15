import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";
import { WithClassName } from "../types";

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
    WithClassName & {
        size?: "sm" | "md" | "lg";
        color?: "primary" | "secondary" | "ghost" | "link" | "custom";
    };

const classes = {
    base: "w-full inline-flex items-center justify-center gap-2 font-bold text-white transition-all duration-200 transform",
    variants: {
        sizes: {
            sm: "px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base",
            md: "px-4 py-2 sm:px-6 sm:py-3 rounded-xl",
            lg: "px-6 py-3 sm:px-8 sm:py-4 rounded-2xl text-lg sm:text-xl",
        },
        colors: {
            primary:
                "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 shadow-lg border border-emerald-400/20 hover:scale-[1.02] active:scale-[0.98]",
            secondary:
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg border border-blue-400/20 hover:scale-[1.02] active:scale-[0.98]",
            ghost: "bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white font-medium hover:scale-[1.02] active:scale-[0.98]",
            link: "bg-transparent border-0 shadow-none hover:text-emerald-400 underline-offset-2 hover:underline",
            custom: "shadow-lg",
        },
    },
} as const;

export function Button({
    children,
    className,
    size = "lg",
    color = "primary",
    ...restProps
}: Props) {
    return (
        <button
            className={cn(
                classes.base,
                classes.variants.sizes[size],
                classes.variants.colors[color],
                className
            )}
            {...restProps}
        >
            {children}
        </button>
    );
}
