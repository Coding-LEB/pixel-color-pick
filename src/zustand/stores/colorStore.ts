import { create } from "zustand";
import {normalizeAlpha, normalizeHexColor, RgbColor, rgbToHex} from "../../models/color.ts";


type ColorStore = {
    selectedColor: string;
    alpha: number;

    setSelectedColor: (color: string) => void;
    setRgbColor: (rgb: RgbColor) => void;
    setAlpha: (alpha: number) => void;
};

export const useColorStore = create<ColorStore>((set) => ({
    selectedColor: "#7C3AED",
    alpha: 100,

    setSelectedColor: (color) => {
        const normalizedColor = normalizeHexColor(color);

        if (!normalizedColor) {
            return;
        }

        set({ selectedColor: normalizedColor });
    },

    setRgbColor: (rgb) => {
        set({
            selectedColor: rgbToHex(rgb),
        });
    },

    setAlpha: (alpha) => {
        set({
            alpha: normalizeAlpha(alpha),
        });
    },
}));