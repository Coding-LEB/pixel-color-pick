import "../../styles/RgbInputs.css";
import {useRgbInput} from "../../hooks/RgbInputHook.ts";

export type Channel = "r" | "g" | "b";

export default function RgbInputs() {
    const { rgb, handleChannelChange } = useRgbInput()

    return (
        <div className="rgb-inputs">
            <span className="rgb-inputs__label">RGB</span>

            <div className="rgb-inputs__grid">
                {(["r", "g", "b"] as Channel[]).map((channel) => (
                    <label className="rgb-inputs__field" key={channel}>
                        <span>{channel.toUpperCase()}</span>

                        <input
                            type="number"
                            min="0"
                            max="255"
                            value={rgb[channel]}
                            onChange={(event) =>
                                handleChannelChange(channel, event.target.value)
                            }
                        />
                    </label>
                ))}
            </div>
        </div>
    );
}