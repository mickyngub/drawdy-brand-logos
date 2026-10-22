import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
// @ts-expect-error plain JS
import * as catalogScript from "../scripts/build-catalog.mjs";
import { CATEGORIES, ICONS } from "../src/catalog";

const NAME = /^[a-z0-9-]+$/;
const HEX = /^[0-9A-F]{6}$/;
const json = (path: string) =>
    JSON.parse(
        readFileSync(
            new URL(`../node_modules/${path}`, import.meta.url),
            "utf8"
        )
    );
const SIMPLE_ICONS = json("simple-icons/data/simple-icons.json");
const SI_ICONIFY = json("@iconify-json/simple-icons/icons.json");
const LOGOS_ICONIFY = json("@iconify-json/logos/icons.json");
const { buildCatalog, CURATED } = catalogScript;
const byName = new Map(ICONS.map((icon) => [icon.name, icon]));

test("the committed catalog matches the pinned packages and curated lists", () => {
    const built = buildCatalog(
        SIMPLE_ICONS,
        SI_ICONIFY,
        LOGOS_ICONIFY,
        CURATED
    );
    assert.deepEqual(built.icons, ICONS, "run npm run catalog");
    assert.deepEqual(built.categories, CATEGORIES, "run npm run catalog");
});

test("a curated name that no package has stops the build", () => {
    const broken = {
        ...CURATED,
        categories: [{ id: "x", title: "X", names: ["not-a-brand"] }],
    };
    assert.throws(
        () => buildCatalog(SIMPLE_ICONS, SI_ICONIFY, LOGOS_ICONIFY, broken),
        /no brand not-a-brand/
    );
});

test("a fallback that Simple Icons already has stops the build", () => {
    const duplicate = { ...CURATED, fallbacks: [["instagram", "Instagram"]] };
    const logos = {
        icons: { ...LOGOS_ICONIFY.icons, instagram: { body: "" } },
    };
    assert.throws(
        () => buildCatalog(SIMPLE_ICONS, SI_ICONIFY, logos, duplicate),
        /instagram is in Simple Icons/
    );
});

test("every brand has a plain unique name, a title and a known source", () => {
    const seen = new Set<string>();
    for (const icon of ICONS) {
        assert.match(icon.name, NAME);
        assert.ok(icon.title.length > 0, icon.name);
        assert.ok(!seen.has(icon.name), `${icon.name} is listed twice`);
        seen.add(icon.name);
        if (icon.prefix === "simple-icons") {
            assert.match(icon.hex ?? "", HEX, icon.name);
        } else {
            assert.equal(icon.prefix, "logos", icon.name);
            assert.equal(icon.hex, undefined, icon.name);
        }
    }
});

test("brands Simple Icons removed upstream stay out; LinkedIn comes from SVG Logos", () => {
    const current = new Set(
        SIMPLE_ICONS.map((brand: { slug: string }) => brand.slug)
    );
    for (const icon of ICONS) {
        if (icon.prefix === "simple-icons") {
            assert.ok(current.has(icon.name), `${icon.name} was removed`);
        }
    }
    assert.ok(SI_ICONIFY.icons.linkedin, "Iconify still serves linkedin");
    assert.equal(byName.get("linkedin"), undefined);
    assert.equal(byName.get("linkedin-icon")?.prefix, "logos");
    assert.equal(byName.get("slack-icon")?.prefix, "logos");
});

test("every category has 15 or more brands, all in the brand list", () => {
    assert.equal(
        new Set(CATEGORIES.map((group) => group.id)).size,
        CATEGORIES.length
    );
    for (const group of CATEGORIES) {
        assert.ok(group.names.length >= 15, `${group.id} is short`);
        assert.equal(new Set(group.names).size, group.names.length, group.id);
        for (const name of group.names) {
            assert.ok(byName.has(name), `${group.id}: ${name}`);
        }
    }
});

test("All lists every brand by title", () => {
    const titles = ICONS.map((icon) => icon.title.toLowerCase());
    assert.deepEqual(titles, [...titles].sort());
});

test("marks that fade into a theme's tile ask for a contrasting plate", () => {
    assert.equal(byName.get("1and1")?.mark, "dark");
    assert.equal(byName.get("dotenv")?.mark, "light");
    assert.equal(byName.get("adobe-xd")?.mark, "dark");
    assert.equal(byName.get("facebook")?.mark, undefined);
    // Pure black brands are drawn in the board's ink, which never fades.
    assert.equal(byName.get("x")?.mark, undefined);
});
