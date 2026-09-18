import React, {useEffect, useRef, useState} from "react";
import {hexToRgb, hsvToRgb, rgbToHsv} from "../models/color.ts";
import {clamp} from "@mantine/hooks";
import {useColorStore} from "../zustand/stores/colorStore.ts";

export function useColorBox() {
    //region State & Store
    const selectedColor = useColorStore((state) => state.selectedColor);
    const setRgbColor = useColorStore((state) => state.setRgbColor);

    const colorBoxRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const rgb = hexToRgb(selectedColor) ?? { r: 0, g: 0, b: 0 };
    const hsv = rgbToHsv(rgb);

    const [activeHue, setActiveHue] = useState(hsv.h);

    useEffect(() => {
        if (hsv.s > 0) {
            setActiveHue(hsv.h);
        }
    }, [hsv.h, hsv.s]);
    //endregion

    //region Methods
    function updateSaturationAndValue(
        event: React.PointerEvent<HTMLDivElement>,
    ) {
        const colorBox = colorBoxRef.current;

        if (!colorBox) {
            return;
        }

        const bounds = colorBox.getBoundingClientRect();

        const saturation = clamp(
            ((event.clientX - bounds.left) / bounds.width) * 100,
            0,
            100,
        );

        const value = clamp(
            (1 - (event.clientY - bounds.top) / bounds.height) * 100,
            0,
            100,
        );

        setRgbColor(
            hsvToRgb({
                h: activeHue,
                s: saturation,
                v: value,
            }),
        );
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
        event.currentTarget.setPointerCapture(event.pointerId);
        setIsDragging(true);
        updateSaturationAndValue(event);
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
        if (isDragging) {
            updateSaturationAndValue(event);
        }
    }

    function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        setIsDragging(false);
    }

    function handleHueChange(value: number) {
        setActiveHue(value);

        setRgbColor(
            hsvToRgb({
                h: value,
                s: hsv.s,
                v: hsv.v,
            }),
        );
    }
    //endregion

    return {
        activeHue, colorBoxRef, handlePointerDown,
        handlePointerMove, handlePointerEnd, hsv, handleHueChange
    };
}

