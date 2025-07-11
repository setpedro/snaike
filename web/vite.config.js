import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from 'path';

export default defineConfig({
    plugins: [react(), wasm()],
    server: {
        port: 3000,
    },
    build: {
        outDir: "dist",
        target: "esnext",
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
    },
    optimizeDeps: {
        exclude: ["@/pkg/snake_spark"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
