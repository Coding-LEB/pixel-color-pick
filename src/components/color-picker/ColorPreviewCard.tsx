import "../../styles/ColorPreviewCard.css";
import {useColorPreviewCard} from "../../hooks/ColorPreviewCardHook.ts";

export default function ColorPreviewCard() {
    const {
        previewColor, selectedColor, alpha
    } = useColorPreviewCard();

    return (
        <section className="color-preview-card">
            <div className="color-preview-card__swatch">
                <div
                    className="color-preview-card__swatch-color"
                    style={{ backgroundColor: previewColor }}
                >
          <span className="color-preview-card__hex">
            {selectedColor} · {alpha}%
          </span>
                </div>
            </div>

            <div className="color-preview-card__footer">
                <span>Current Color</span>
            </div>
        </section>
    );
}