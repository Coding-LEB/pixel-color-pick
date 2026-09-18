import MainBody from "./components/layout/MainBody";
import TitleBar from "./components/layout/Titlebar.tsx";
import {getCurrentWindow} from "@tauri-apps/api/window";
import ScreenPickerOverlay from "./components/screen-picker/ScreenPickerOverlay.tsx";
import {useColorPickEvent} from "./hooks/ColorPickEventHook.ts";


function MainWindow() {
    useColorPickEvent();

    return (
        <div className="app-shell">
            <TitleBar />
            <MainBody />
        </div>
    );
}

function App() {
    const currentWindow = getCurrentWindow();

    if (currentWindow.label === "screen-picker") {
        return <ScreenPickerOverlay />;
    }

    return <MainWindow />;
}

export default App;