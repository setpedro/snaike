import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";
import { WithClassName } from "../types";

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
    WithClassName & {
        size?: "sm" | "lg";
        color?: "primary" | "secondary" | "ghost" | "link";
    };

const classes = {
    base: "w-full font-bold text-white transition-all duration-200 transform",
    variants: {
        sizes: {
            sm: "px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base",
            lg: "px-6 py-3 sm:px-8 sm:py-4 rounded-2xl text-lg sm:text-xl",
        },
        colors: {
            primary:
                "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 active:from-emerald-700 active:to-emerald-800 shadow-lg border border-emerald-400/20",
            secondary:
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg border border-blue-400/20",
            ghost: "bg-transparent hover:bg-white/10 shadow-lg border border-white/20",
            link: "hover:text-emerald-400",
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
