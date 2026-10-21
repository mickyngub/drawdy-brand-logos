export type Paint = {
    recolor: Record<string, string>;
    label: string;
};

// Pure black and pure white brand colours would vanish on a dark or a light
// board, so they draw in the board's ink instead.
const INVISIBLE_ON_SOME_BOARD = new Set(["000000", "FFFFFF"]);

// Simple Icons logos are one shape in currentColor: Brand paints it in the
// brand's colour, Ink in the board's ink, anything else in that colour. SVG
// Logos entries are full colour and never change.
export function paint(
    icon: { prefix: string; hex?: string },
    color: string,
    ink: string
): Paint {
    if (icon.prefix !== "simple-icons") return { recolor: {}, label: ink };
    if (color === "brand") {
        const hex = icon.hex;
        const fill =
            hex === undefined || INVISIBLE_ON_SOME_BOARD.has(hex)
                ? ink
                : `#${hex}`;
        return { recolor: { currentcolor: fill }, label: ink };
    }
    const chosen = color === "ink" ? ink : color;
    return { recolor: { currentcolor: chosen }, label: chosen };
}
