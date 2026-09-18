import ColorFormatRow from "./ColorFormatRow";
import "../../styles/ColorFormatsPanel.css";
import {useColorFormatsPanel} from "../../hooks/ColorFormatsPanelHook.ts";


export default function ColorFormatsPanel() {
    const colorFormatsData = useColorFormatsPanel();
    if (!colorFormatsData) return null;
    const { formats } = colorFormatsData;

    return (
        <section className="color-formats-panel">
            <div className="color-formats-panel__header">
                <div>
                    <h2>Color Formats</h2>
                    <p>Values update as you change the color.</p>
                </div>
            </div>

            <div className="color-formats-panel__grid">
                {formats.map((format) => (
                    <ColorFormatRow
                        key={format.label}
                        label={format.label}
                        value={format.value}
                    />
                ))}
            </div>
        </section>
    );
}