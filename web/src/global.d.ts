declare global {
    interface Window {
        game: Phaser.Game | undefined;
        onGameOver: () => void;
    }
}

export {};
