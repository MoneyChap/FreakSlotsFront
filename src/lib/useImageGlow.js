import { useEffect, useState } from "react";

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function rgbToHex(r, g, b) {
    const to = (x) => x.toString(16).padStart(2, "0");
    return `#${to(r)}${to(g)}${to(b)}`;
}

// Samples a few points and averages the most "colorful" ones.
// Returns a hex color like "#ff7a00".
export function useImageGlow(src) {
    const [color, setColor] = useState("#ff7a00");

    useEffect(() => {
        if (!src) return;

        let cancelled = false;

        const img = new Image();
        img.decoding = "async";
        img.crossOrigin = "anonymous"; // works for your own hosted files; external needs CORS
        img.src = src;

        img.onload = () => {
            try {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d", { willReadFrequently: true });
                if (!ctx) return;

                // Downscale to small size for speed
                const w = 32;
                const h = 32;
                canvas.width = w;
                canvas.height = h;

                ctx.drawImage(img, 0, 0, w, h);

                const data = ctx.getImageData(0, 0, w, h).data;

                // pick "vibrant" pixels (high saturation-ish)
                let best = { score: -1, r: 255, g: 122, b: 0 };

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    if (a < 180) continue;

                    const max = Math.max(r, g, b);
                    const min = Math.min(r, g, b);
                    const sat = max - min; // rough saturation proxy
                    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

                    // ignore too dark / too bright pixels
                    if (lum < 30 || lum > 235) continue;

                    // score: prefer saturation, moderate brightness
                    const score = sat * 1.2 - Math.abs(lum - 140) * 0.35;

                    if (score > best.score) best = { score, r, g, b };
                }

                // slightly boost / clamp for nicer glow
                const rr = clamp(Math.round(best.r * 1.05), 0, 255);
                const gg = clamp(Math.round(best.g * 1.05), 0, 255);
                const bb = clamp(Math.round(best.b * 1.05), 0, 255);

                if (!cancelled) setColor(rgbToHex(rr, gg, bb));
            } catch {
                // If canvas is tainted (CORS), just keep default
            }
        };

        return () => {
            cancelled = true;
        };
    }, [src]);

    return color;
}
