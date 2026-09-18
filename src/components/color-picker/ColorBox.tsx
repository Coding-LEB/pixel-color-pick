import "../../styles/ColorBox.css";
import {useColorBox} from "../../hooks/ColorBoxHook.ts";

export default function ColorBox() {
    const {
        activeHue, colorBoxRef, handlePointerDown,
        handlePointerMove, handlePointerEnd, hsv, handleHueChange
    } = useColorBox();

    return (
        <section className="color-box">
            <div className="color-box__header">
                <span>Color Box</span>
                <span>Hue {Math.round(activeHue)}°</span>
            </div>

            <div
                ref={colorBoxRef}
                className="color-box__surface"
                style={{ backgroundColor: `hsl(${activeHue}, 100%, 50%)` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
            >
                <span
                    className="color-box__indicator"
                    style={{
                        left: `${hsv.s}%`,
                        top: `${100 - hsv.v}%`,
                    }}
                />
            </div>

            <input
                className="color-box__hue-slider"
                type="range"
                min="0"
                max="360"
                value={activeHue}
                aria-label="Hue"
                onChange={(event) => handleHueChange(Number(event.target.value))}
            />
        </section>
    );
}