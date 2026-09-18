import { invoke } from "@tauri-apps/api/core";
import { useCallback, useRef, useState } from "react";

type ColorPreviewPayload = {
    color: string;
    pixels: string[];
};

type Preview = {
    color: string;
    pixels: string[];
    x: number;
    y: number;
};

export function useScreenPickerPreview() {
    const [preview, setPreview] = useState<Preview | null>(null);

    const lastRequestTime = useRef(0);
    const isRequestPending = useRef(false);

    const updatePreview = useCallback(async (x: number, y: number) => {
        const now = Date.now();

        if (isRequestPending.current || now - lastRequestTime.current < 60) {
            return;
        }

        try {
            isRequestPending.current = true;
            lastRequestTime.current = now;

            const result = await invoke<ColorPreviewPayload>(
                "preview_screen_picker_color",
            );

            setPreview({
                color: result.color,
                pixels: result.pixels,
                x,
                y,
            });
        } catch (error) {
            console.error("Failed to preview screen color:", error);
        } finally {
            isRequestPending.current = false;
        }
    }, []);

    return {
        preview,
        updatePreview,
    };
}