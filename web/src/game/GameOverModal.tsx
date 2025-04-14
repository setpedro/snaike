import React from "react";

type Props = {
    onRestart: () => void;
};

export default function GameOverModal({ onRestart }: Props) {
    return (
        <div
            className="absolute top-0 left-0 w-full h-full bg-black/70 text-white flex justify-center items-center cursor-pointer"
            onClick={(e) => {
                e.stopPropagation();
                onRestart();
            }}
        >
            <div className="text-2xl bg-gray-800 p-4 rounded hover:bg-gray-700 active:scale-95 transition-all">
                Game Over! Click to Restart
            </div>
        </div>
    );
}
