import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import wasm from "vite-plugin-wasm";
import path from "path";

export default defineConfig({
    plugins: [react(), wasm()],
    server: {
        port: 3000,
    },
    build: {
        target: "esnext",
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ["phaser"],
                },
            },
        },
    },
    // TODO: externalize package
    optimizeDeps: {
        exclude: ["@/pkg/snaike"],
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
