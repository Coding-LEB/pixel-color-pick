import {useColorStore} from "../zustand/stores/colorStore.ts";
import {useEffect, useState} from "react";
import {normalizeHexColor} from "../models/color.ts";

export function useColorPickerControl() {
    //region Store, State
    const selectedColor = useColorStore((state) => state.selectedColor);
    const setSelectedColor = useColorStore(
        (state) => state.setSelectedColor,
    );

    const [hexValue, setHexValue] = useState(selectedColor);

    useEffect(() => {
        setHexValue(selectedColor);
    }, [selectedColor]);
    //endregion

    //region Methods
    function handleHexChange(value: string) {
        setHexValue(value);

        const validColor = normalizeHexColor(value);

        if (validColor) {
            setSelectedColor(validColor);
        }
    }

    function handleHexBlur() {
        const validColor = normalizeHexColor(hexValue);

        if (!validColor) {
            setHexValue(selectedColor);
            return;
        }

        setSelectedColor(validColor);
    }
    //endregion

    return {
        hexValue, handleHexChange,
        handleHexBlur, selectedColor,
        setSelectedColor
    };
}

