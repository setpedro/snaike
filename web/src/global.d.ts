declare global {
    interface Window {
        game: Phaser.Game | undefined;
        onGameOver: () => void;
        onGameWin: () => void;
        onGameDraw: () => void;
        onScoreUpdate: (score: number) => void;
    }
}

export {};
