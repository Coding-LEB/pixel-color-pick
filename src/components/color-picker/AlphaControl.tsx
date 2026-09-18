
import "../../styles/AlphaControl.css";
import {useColorStore} from "../../zustand/stores/colorStore.ts";

export default function AlphaControl() {
    const alpha = useColorStore((state) => state.alpha);
    const setAlpha = useColorStore((state) => state.setAlpha);

    return (
        <div className="alpha-control">
            <div className="alpha-control__header">
                <label htmlFor="alpha-range">Alpha</label>
                <span>{alpha}%</span>
            </div>

            <input
                id="alpha-range"
                type="range"
                min="0"
                max="100"
                value={alpha}
                onChange={(event) => setAlpha(Number(event.target.value))}
            />
        </div>
    );
}