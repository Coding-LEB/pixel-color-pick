import "../../styles/ColorPickerControls.css";
import {useColorPickerControl} from "../../hooks/ColorPickerControlHook.ts";
import RgbInputs from "./RgbInputs.tsx";
import AlphaControl from "./AlphaControl.tsx";
import ColorBox from "./ColorBox.tsx";

export default function ColorPickerControls() {
    const { hexValue, handleHexChange, handleHexBlur } = useColorPickerControl();

    return (
        <section className="color-picker-controls">
            <div className="color-picker-controls__header">
                <h2>Color Value</h2>
                <p>Enter a HEX value or adjust the channels.</p>
            </div>

            <ColorBox />

            <label className="color-picker-controls__field">
                <span>HEX</span>

                <input
                    type="text"
                    value={hexValue}
                    maxLength={7}
                    placeholder="#7C3AED"
                    onChange={(event) => handleHexChange(event.target.value)}
                    onBlur={handleHexBlur}
                />
            </label>

            <RgbInputs />
            <AlphaControl />
        </section>
    );
}