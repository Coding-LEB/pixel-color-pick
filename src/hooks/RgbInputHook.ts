import {useColorStore} from "../zustand/stores/colorStore.ts";
import {clamp, hexToRgb} from "../models/color.ts";
import {Channel} from "../components/color-picker/RgbInputs.tsx";

export function useRgbInput() {
    const selectedColor = useColorStore((state) => state.selectedColor);
    const setRgbColor = useColorStore((state) => state.setRgbColor);

    const rgb = hexToRgb(selectedColor) ?? { r: 0, g: 0, b: 0 };

    function handleChannelChange(channel: Channel, value: string) {
        const nextValue = clamp(Number(value), 0, 255);

        setRgbColor({
            ...rgb,
            [channel]: nextValue,
        });
    }

    return { rgb, handleChannelChange };
}

