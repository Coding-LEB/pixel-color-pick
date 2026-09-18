import ColorPreviewCard from "../color-picker/ColorPreviewCard";
import "../../styles/MainBody.css";
import ColorPickerControls from "../color-picker/ColorPickerControls.tsx";
import ColorFormatsPanel from "../color-formats/ColorFormatsPanel.tsx";


export default function MainBody() {
    return (
        <main className="app-main">
            <div className="color-workspace">
                <div className="color-workspace__right">
                    <ColorPickerControls />
                </div>

                <div className="color-workspace__left">
                    <ColorPreviewCard />
                    <ColorFormatsPanel />
                </div>
            </div>
        </main>
    );
}