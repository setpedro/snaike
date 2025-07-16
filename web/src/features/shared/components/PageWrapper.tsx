import { ReactNode } from "react";
import { cn } from "@/features/shared/utils/cn";

type Props = {
    children: ReactNode;
    className?: string;
};

export function PageWrapper({ children, className }: Props) {
    return (
        <div
            className={cn(
                "flex justify-center items-center min-h-screen p-4 bg-gradient-default",
                className
            )}
        >
            {children}
        </div>
    );
}
