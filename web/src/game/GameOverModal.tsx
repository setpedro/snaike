import React, { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onRestart: () => void;
};

export default function GameOverModal({ children, onRestart }: Props) {
    return (
        <div
            className="absolute top-0 left-0 w-full h-full bg-black/70 text-white flex justify-center items-center cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                onRestart();
            }}
        >
            <div className="text-2xl bg-gray-800 p-4 rounded hover:bg-gray-700 active:scale-95 transition-all">
                {children}
            </div>
        </div>
    );
}
