import {useColorStore} from "../zustand/stores/colorStore.ts";
import {alphaToDecimal, alphaToHex, hexToRgb, rgbToCmyk, rgbToHsl, rgbToHsv} from "../models/color.ts";

export function useColorFormatsPanel() {
    const selectedColor = useColorStore((state) => state.selectedColor);
    const alpha = useColorStore((state) => state.alpha);

    const rgb = hexToRgb(selectedColor);

    if (!rgb) {
        return null;
    }

    const hsl = rgbToHsl(rgb);
    const hsv = rgbToHsv(rgb);
    const cmyk = rgbToCmyk(rgb);
    const alphaValue = alphaToDecimal(alpha);

    const formats = [
        {
            label: "HEX",
            value: selectedColor,
        },
        {
            label: "HEXA",
            value: `${selectedColor}${alphaToHex(alpha)}`,
        },
        {
            label: alpha === 100 ? "RGB" : "RGBA",
            value:
                alpha === 100
                    ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
                    : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alphaValue})`,
        },
        {
            label: alpha === 100 ? "HSL" : "HSLA",
            value:
                alpha === 100
                    ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
                    : `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alphaValue})`,
        },
        {
            label: "HSV",
            value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
        },
        {
            label: "CMYK",
            value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
        },
    ];

    return { formats };
}

