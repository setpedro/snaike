declare global {
    interface Window {
        game: Phaser.Game;
        onGameOver: () => void;
    }
}

export {};
