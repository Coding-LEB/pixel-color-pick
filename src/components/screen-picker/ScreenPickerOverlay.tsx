import "../../styles/ScreenPickerOverlay.css";
import {useScreenPicker} from "../../hooks/ScreenPickerHook.ts";
import React, {useEffect} from "react";
import {useScreenPickerPreview} from "../../hooks/ScreenPickerPreviewHook.ts";

export default function ScreenPickerOverlay() {
    const {
        isCompleting,
        closeScreenPicker,
        completeScreenPick,
    } = useScreenPicker();

    const {preview, updatePreview} = useScreenPickerPreview();

    useEffect(() => {
        document.body.classList.add("screen-picker-body");

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                void closeScreenPicker();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.classList.remove("screen-picker-body");
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [closeScreenPicker]);

    function handlePick() {
        if (!isCompleting) {
            void completeScreenPick();
        }
    }

    function handleMouseMove(event: React.MouseEvent<HTMLElement>) {
        void updatePreview(event.clientX, event.clientY);
    }

    return (
        <main
            className="screen-picker-overlay"
            onClick={handlePick}
            onMouseMove={handleMouseMove}
        >
            {preview && (
                <div
                    className="screen-picker-overlay__lens"
                    style={{
                        left: Math.min(preview.x + 18, window.innerWidth - 220),
                        top: Math.min(preview.y + 18, window.innerHeight - 235),
                    }}
                >
                    <div className="screen-picker-overlay__pixel-grid">
                        {preview.pixels.map((pixelColor, index) => (
                            <span
                                className={`screen-picker-overlay__pixel ${
                                    index === 60
                                        ? "screen-picker-overlay__pixel--center"
                                        : ""
                                }`}
                                key={`${pixelColor}-${index}`}
                                style={{ backgroundColor: pixelColor }}
                            />
                        ))}
                    </div>

                    <div className="screen-picker-overlay__lens-details">
                        <span
                            className="screen-picker-overlay__preview-swatch"
                            style={{ backgroundColor: preview.color }}
                        />

                        <strong>{preview.color}</strong>
                    </div>

                    <span className="screen-picker-overlay__lens-help">
      Click to pick · Esc to cancel
    </span>
                </div>
            )}

            {!preview && (
                <div className="screen-picker-overlay__hint">
                    <strong>Pick a color</strong>
                    <span>Move the cursor to preview a color</span>
                </div>
            )}
        </main>
    );
}