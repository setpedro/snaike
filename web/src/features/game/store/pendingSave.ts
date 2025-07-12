import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { GameState, GameViewMode } from "../types";

type PendingSave = {
    gameState: GameState;
    gameMode: GameViewMode;
    score: number;
};

const getDefaultState = (): PendingSave => ({
    gameState: "playing",
    gameMode: "menu",
    score: 0,
});

const internalStore = create(
    persist<PendingSave>(getDefaultState, {
        name: "pendingOAuthSave",
    })
);

export function usePendingSave<ReturnValue>(
    selector: (state: PendingSave) => ReturnValue
) {
    return useStore(internalStore, selector);
}

usePendingSave.getGameMode = () => {
    return internalStore.getState().gameMode;
};

usePendingSave.getScore = () => {
    return internalStore.getState().score;
};

usePendingSave.setGameState = (gameState: GameState) => {
    internalStore.setState({ gameState });
};

usePendingSave.setGameMode = (gameMode: GameViewMode) => {
    internalStore.setState({ gameMode });
};

usePendingSave.setScore = (score: number) => {
    internalStore.setState({ score });
};

usePendingSave.reset = () => {
    internalStore.setState((state) => {
        return {
            ...getDefaultState(),
            gameMode: state.gameMode,
        };
    });
};
