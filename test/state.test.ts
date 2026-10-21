import assert from "node:assert/strict";
import { test } from "node:test";
import { readState } from "../src/index";

const DEFAULT_OPTIONS = { size: 64, color: "brand", label: true };

test("readState falls back to the defaults: brand colours, labels on", () => {
    const empty = { recent: [], options: DEFAULT_OPTIONS };
    assert.deepEqual(readState(undefined), empty);
    assert.deepEqual(readState({}), empty);
});

test("readState keeps brand, ink and hex colours", () => {
    for (const color of ["brand", "ink", "#698cf9"]) {
        const options = { size: 128, color, label: false };
        assert.deepEqual(readState({ options }).options, options);
    }
});

test("readState rejects a bad size, colour and label", () => {
    const state = readState({
        options: { size: 100, color: "red", label: "true" },
    });
    assert.deepEqual(state.options, DEFAULT_OPTIONS);
    assert.equal(
        readState({ options: { color: "#12345" } }).options.color,
        "brand"
    );
});

test("readState keeps recent logos with and without a hex", () => {
    const recent = [
        {
            prefix: "simple-icons",
            name: "instagram",
            title: "Instagram",
            hex: "FF0069",
        },
        { prefix: "logos", name: "linkedin-icon", title: "LinkedIn" },
    ];
    assert.deepEqual(readState({ recent }).recent, recent);
});

test("readState drops recent logos with a bad hex, another set or an odd name", () => {
    const kept = {
        prefix: "simple-icons",
        name: "visa",
        title: "Visa",
        hex: "1A1F71",
    };
    const state = readState({
        recent: [
            { ...kept, hex: "1a1f71" },
            { ...kept, hex: "#1A1F71" },
            { ...kept, hex: 0x1a1f71 },
            { prefix: "streamline-freehand", name: "camera", title: "Camera" },
            { prefix: "logos", name: "Slack", title: "Slack" },
            kept,
        ],
    });
    assert.deepEqual(state.recent, [kept]);
});
