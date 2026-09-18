import { listen } from "@tauri-apps/api/event";
import { useEffect } from "react";
import { useColorStore } from "../zustand/stores/colorStore";

type ColorPickedPayload = {
    color: string;
    alpha: number;
};

export function useColorPickEvent() {
    const setSelectedColor = useColorStore(
        (state) => state.setSelectedColor,
    );

    const setAlpha = useColorStore((state) => state.setAlpha);

    useEffect(() => {
        let unlisten: (() => void) | undefined;

        async function registerListener() {
            unlisten = await listen<ColorPickedPayload>(
                "color-picked",
                (event) => {
                    setSelectedColor(event.payload.color);
                    setAlpha(event.payload.alpha);
                },
            );
        }

        void registerListener();

        return () => {
            unlisten?.();
        };
    }, [setAlpha, setSelectedColor]);
}