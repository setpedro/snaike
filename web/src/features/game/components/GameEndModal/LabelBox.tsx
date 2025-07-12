import { cn } from "@/shared/utils";
import { ReactNode } from "react";

type Props = {
    icon: ReactNode;
    label: string;
    value: number | string;
    badge?: ReactNode;
    gradient: string;
    valueColor: string;
    className?: string;
};

export function LabelBox({
    icon,
    label,
    value,
    badge,
    gradient,
    valueColor,
    className,
}: Props) {
    return (
        <div
            className={cn(
                "w-full px-3 py-2 sm:p-4 rounded-2xl border border-white/10",
                gradient,
                className
            )}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl">{icon}</span>
                    <span className="text-sm sm:text-base text-white/80">
                        {label}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={cn(
                            "text-xl sm:text-2xl font-bold",
                            valueColor
                        )}
                    >
                        {value}
                    </span>
                    {badge}
                </div>
            </div>
        </div>
    );
}
