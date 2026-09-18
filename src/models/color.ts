export type RgbColor = {
    r: number;
    g: number;
    b: number;
};

export type HslColor = {
    h: number;
    s: number;
    l: number;
};

export type HsvColor = {
    h: number;
    s: number;
    v: number;
};

export type CmykColor = {
    c: number;
    m: number;
    y: number;
    k: number;
};

export function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

export function normalizeHexColor(color: string) {
    const trimmedColor = color.trim();

    if (!/^#?[0-9a-fA-F]{6}$/.test(trimmedColor)) {
        return null;
    }

    return `#${trimmedColor.replace("#", "").toUpperCase()}`;
}

export function hexToRgb(color: string): RgbColor | null {
    const normalizedColor = normalizeHexColor(color);

    if (!normalizedColor) {
        return null;
    }

    const hex = normalizedColor.slice(1);

    return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
    };
}

export function rgbToHex({ r, g, b }: RgbColor) {
    const toHexValue = (value: number) =>
        clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");

    return `#${toHexValue(r)}${toHexValue(g)}${toHexValue(b)}`.toUpperCase();
}

export function normalizeAlpha(alpha: number) {
    return clamp(Math.round(alpha), 0, 100);
}

export function alphaToHex(alpha: number) {
    return Math.round((normalizeAlpha(alpha) / 100) * 255)
        .toString(16)
        .padStart(2, "0")
        .toUpperCase();
}

export function alphaToDecimal(alpha: number) {
    const value = normalizeAlpha(alpha) / 100;

    return Number(value.toFixed(2));
}

export function rgbToHsl({ r, g, b }: RgbColor): HslColor {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = 60 * (((green - blue) / delta) % 6);
        } else if (max === green) {
            hue = 60 * ((blue - red) / delta + 2);
        } else {
            hue = 60 * ((red - green) / delta + 4);
        }
    }

    if (hue < 0) {
        hue += 360;
    }

    const lightness = (max + min) / 2;
    const saturation =
        delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    return {
        h: Math.round(hue),
        s: Math.round(saturation * 100),
        l: Math.round(lightness * 100),
    };
}

export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    let hue = 0;

    if (delta !== 0) {
        if (max === red) {
            hue = 60 * (((green - blue) / delta) % 6);
        } else if (max === green) {
            hue = 60 * ((blue - red) / delta + 2);
        } else {
            hue = 60 * ((red - green) / delta + 4);
        }
    }

    if (hue < 0) {
        hue += 360;
    }

    return {
        h: Math.round(hue),
        s: Math.round(max === 0 ? 0 : (delta / max) * 100),
        v: Math.round(max * 100),
    };
}

export function rgbToCmyk({ r, g, b }: RgbColor): CmykColor {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;

    const black = 1 - Math.max(red, green, blue);

    if (black === 1) {
        return { c: 0, m: 0, y: 0, k: 100 };
    }

    return {
        c: Math.round(((1 - red - black) / (1 - black)) * 100),
        m: Math.round(((1 - green - black) / (1 - black)) * 100),
        y: Math.round(((1 - blue - black) / (1 - black)) * 100),
        k: Math.round(black * 100),
    };
}

export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
    const hue = ((h % 360) + 360) % 360;
    const saturation = clamp(s, 0, 100) / 100;
    const value = clamp(v, 0, 100) / 100;

    const chroma = value * saturation;
    const secondComponent =
        chroma * (1 - Math.abs(((hue / 60) % 2) - 1));

    const match = value - chroma;

    let red = 0;
    let green = 0;
    let blue = 0;

    if (hue < 60) {
        red = chroma;
        green = secondComponent;
    } else if (hue < 120) {
        red = secondComponent;
        green = chroma;
    } else if (hue < 180) {
        green = chroma;
        blue = secondComponent;
    } else if (hue < 240) {
        green = secondComponent;
        blue = chroma;
    } else if (hue < 300) {
        red = secondComponent;
        blue = chroma;
    } else {
        red = chroma;
        blue = secondComponent;
    }

    return {
        r: Math.round((red + match) * 255),
        g: Math.round((green + match) * 255),
        b: Math.round((blue + match) * 255),
    };
}