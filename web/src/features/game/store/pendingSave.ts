import { create, useStore } from "zustand";
import { persist } from "zustand/middleware";
import { GameEndCause, GameResult, GameViewMode, Platform } from "../types";

type PendingSave = {
    gameMode: GameViewMode;
    score: number;
    platform: Platform;
    result: GameResult;
    endCause: GameEndCause;
    duration: number; // TODO: get from wasm?
    replayData: any; // TODO
};

const getDefaultState = (): PendingSave => ({
    gameMode: "menu",
    score: 0,
    platform: "desktop",
    result: "lose",
    endCause: null,
    duration: 0,
    replayData: null,
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

// New getters
usePendingSave.getPlatform = () => {
    return internalStore.getState().platform;
};

usePendingSave.getResult = () => {
    return internalStore.getState().result;
};

usePendingSave.getGameEndCause = () => {
    return internalStore.getState().endCause;
};

usePendingSave.getDuration = () => {
    return internalStore.getState().duration;
};

usePendingSave.getReplayData = () => {
    return internalStore.getState().replayData;
};

usePendingSave.setGameMode = (gameMode: GameViewMode) => {
    internalStore.setState({ gameMode });
};

usePendingSave.setScore = (score: number) => {
    internalStore.setState({ score });
};

// New setters
usePendingSave.setPlatform = (platform: Platform) => {
    internalStore.setState({ platform });
};

usePendingSave.setResult = (result: GameResult) => {
    internalStore.setState({ result });
};

usePendingSave.setGameEndCause = (endCause: GameEndCause) => {
    internalStore.setState({ endCause });
};

usePendingSave.setDuration = (duration: number) => {
    internalStore.setState({ duration });
};

usePendingSave.setReplayData = (replayData: any) => {
    internalStore.setState({ replayData });
};

usePendingSave.reset = () => {
    internalStore.setState((state) => {
        return {
            ...getDefaultState(),
            gameMode: state.gameMode,
        };
    });
};
