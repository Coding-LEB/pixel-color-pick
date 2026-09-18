import {useEffect, useRef, useState} from "react";
import {writeText} from "@tauri-apps/plugin-clipboard-manager";


export function useColorFormatRow(color: string) {
    const [isCopied, setIsCopied] = useState(false);
    const resetTimer = useRef<number | undefined>(undefined);


    useEffect(() => {
        return () => {
            if (resetTimer.current) {
                window.clearTimeout(resetTimer.current);
            }
        };
    }, []);

    async function handleCopy() {
        try {
            setIsCopied(true);
            await writeText(color);

            if (resetTimer.current) {
                window.clearTimeout(resetTimer.current);
            }

            resetTimer.current = window.setTimeout(() => {
                setIsCopied(false);
            }, 1600);
        } catch (error) {
            console.error("Failed to copy color value:", error);
        }
    }

    return { isCopied, handleCopy };
}

