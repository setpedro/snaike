import React from "react";
import GameContainer from "./game/components/GameContainer";

export default function App() {
    return (
        <div className="w-full min-h-screen overflow-hidden touch-none select-none">
            <GameContainer />
        </div>
    );
}
