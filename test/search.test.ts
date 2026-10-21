import assert from "node:assert/strict";
import { test } from "node:test";
import type { CatalogIcon } from "../src/catalog";
import { rank, searchEntry, searchTerms } from "../src/search";

const icon = (name: string, title: string, keywords = ""): CatalogIcon => ({
    name,
    title,
    keywords,
    prefix: "simple-icons",
});

const POOL = [
    icon("light-bulb-idea", "Light bulb idea", "essentials"),
    icon("creativity-idea-bulb", "Creativity idea bulb", "work"),
    icon("idea", "Idea", "work"),
    icon("cash-payment-bill", "Cash payment bill", "money"),
].map(searchEntry);

const names = (query: string) =>
    rank(POOL, searchTerms(query)).map((entry) => entry.icon.name);

test("an exact name ranks first, then names that start with the term", () => {
    assert.deepEqual(names("idea"), [
        "idea",
        "light-bulb-idea",
        "creativity-idea-bulb",
    ]);
});

test("every term must match, in any order", () => {
    assert.deepEqual(names("bulb creativity"), ["creativity-idea-bulb"]);
    assert.deepEqual(names("bulb cash"), []);
});

test("a topic keyword finds icons whose names do not say it", () => {
    assert.deepEqual(names("money"), ["cash-payment-bill"]);
});

test("search terms are trimmed, lower-cased and split on spaces", () => {
    assert.deepEqual(searchTerms("  Light   BULB "), ["light", "bulb"]);
    assert.deepEqual(searchTerms("   "), []);
});

test("a short form or alias typed in full ranks ahead of names that merely start with it", () => {
    const brands = [
        icon("igdb", "IGDB"),
        icon("instagram", "Instagram", "ig insta social"),
        icon("x", "X", "Twitter social"),
        icon("twitch", "Twitch", "video  streaming"),
    ].map(searchEntry);
    const found = (query: string) =>
        rank(brands, searchTerms(query)).map((entry) => entry.icon.name);
    assert.deepEqual(found("ig"), ["instagram", "igdb"]);
    assert.deepEqual(found("insta"), ["instagram"]);
    assert.deepEqual(found("twitter"), ["x"]);
    assert.deepEqual(found("twit"), ["twitch", "x"]);
});
