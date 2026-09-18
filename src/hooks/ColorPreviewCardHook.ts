import {useColorStore} from "../zustand/stores/colorStore.ts";
import {hexToRgb} from "../models/color.ts";

export function useColorPreviewCard() {
    const selectedColor = useColorStore((state) => state.selectedColor);
    const alpha = useColorStore((state) => state.alpha);

    const rgb = hexToRgb(selectedColor);

    const previewColor = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha / 100})`
        : selectedColor;

    return { previewColor, selectedColor, alpha };
}

