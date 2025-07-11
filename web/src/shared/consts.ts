import { getGridConstants } from "@/pkg/snake_spark";

export const GRID = getGridConstants();

export const VISUAL = {
    gap: 4,
} as const;

export const COLORS = {
    grid: {
        darkTile1: 0x121212, // Very dark charcoal gray
        darkTile2: 0x1c1c1c, // Almost black
        border: 0x00d4df, // Fluorescent green
    },
    snake: {
        human: 0x39ff14, // Darker fluorescent green
        ai: 0xbd33a4, // Neon purple
    },
    food: 0xff0011, // Neon red
} as const;
