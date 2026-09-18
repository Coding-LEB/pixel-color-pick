import { invoke } from "@tauri-apps/api/core";
import {useCallback, useState} from "react";

export function useScreenPicker() {
    const [isOpening, setIsOpening] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const openScreenPicker = useCallback(async () => {
        try {
            setIsOpening(true);
            await invoke("open_screen_picker");
        } catch (error) {
            console.error("Failed to open screen picker:", error);
        } finally {
            setIsOpening(false);
        }
    }, []);

    const closeScreenPicker = useCallback(async () => {
        try {
            await invoke("close_screen_picker");
        } catch (error) {
            console.error("Failed to close screen picker:", error);
        }
    }, []);

    const completeScreenPick = useCallback(async () => {
        try {
            setIsCompleting(true);
            await invoke("complete_screen_pick");
        } catch (error) {
            console.error("Failed to complete screen pick:", error);
        } finally {
            setIsCompleting(false);
        }
    }, []);

    return {
        isOpening,
        isCompleting,
        openScreenPicker,
        closeScreenPicker,
        completeScreenPick,
    };
}