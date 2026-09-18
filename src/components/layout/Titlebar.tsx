import {useScreenPicker} from "../../hooks/ScreenPickerHook.ts";

export default function TitleBar() {
    const { isOpening, openScreenPicker } = useScreenPicker();

    return (
        <header className="app-header">
            <div className="app-brand">
                <span className="brand-dot" />
                <span>AF Color Picker</span>
            </div>

            <button
                className="screen-pick-button"
                type="button"
                onClick={openScreenPicker}
                disabled={isOpening}>
                {isOpening ? "Opening..." : "Pick from Screen"}
            </button>
        </header>
    );
}