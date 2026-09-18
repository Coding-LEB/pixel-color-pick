import "../../styles/ColorFormatRow.css";
import {useColorFormatRow} from "../../hooks/ColorFormatRowHook.ts";

type ColorFormatRowProps = {
    label: string;
    value: string;
};

export default function ColorFormatRow({label, value}: ColorFormatRowProps) {
    const { isCopied, handleCopy } = useColorFormatRow(value);

    return (
        <button
            className={`color-format-row ${isCopied ? "color-format-row--copied" : ""}`}
            type="button"
            onClick={handleCopy}
            aria-label={`Copy ${label} value: ${value}`}
        >
            <span className="color-format-row__label">{label}</span>

            <code className="color-format-row__value">{value}</code>

            <span className="color-format-row__action">
                {isCopied ? "Copied" : "Copy"}
            </span>
        </button>
    );
}