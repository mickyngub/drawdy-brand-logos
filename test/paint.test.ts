import assert from "node:assert/strict";
import { test } from "node:test";
import { paint } from "../src/paint";

const INK = "#1e1e1e";
const instagram = { prefix: "simple-icons", hex: "FF0069" };
const x = { prefix: "simple-icons", hex: "000000" };
const linkedin = { prefix: "logos" };

test("Brand paints a Simple Icons logo in its colour, with an ink label", () => {
    assert.deepEqual(paint(instagram, "brand", INK), {
        recolor: { currentcolor: "#FF0069" },
        label: INK,
    });
});

test("Brand draws pure black and pure white logos in ink", () => {
    assert.deepEqual(paint(x, "brand", INK).recolor, { currentcolor: INK });
    assert.deepEqual(
        paint({ prefix: "simple-icons", hex: "FFFFFF" }, "brand", INK).recolor,
        { currentcolor: INK }
    );
    assert.deepEqual(paint({ prefix: "simple-icons" }, "brand", INK).recolor, {
        currentcolor: INK,
    });
});

test("Ink and a chosen colour paint the logo and its label alike", () => {
    assert.deepEqual(paint(instagram, "ink", INK), {
        recolor: { currentcolor: INK },
        label: INK,
    });
    assert.deepEqual(paint(instagram, "#b3e000", INK), {
        recolor: { currentcolor: "#b3e000" },
        label: "#b3e000",
    });
});

test("SVG Logos entries keep their colours whatever is chosen", () => {
    for (const color of ["brand", "ink", "#ff4d4d"]) {
        assert.deepEqual(paint(linkedin, color, INK), {
            recolor: {},
            label: INK,
        });
    }
});
