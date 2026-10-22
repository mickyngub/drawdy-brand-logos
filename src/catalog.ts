export type CatalogIcon = {
    name: string;
    title: string;
    keywords: string;
    prefix: "simple-icons" | "logos";
    hex?: string;
    // Set when the mark nearly vanishes on the picker's tile in one theme.
    mark?: "dark" | "light";
};

export type Category = {
    id: string;
    title: string;
    names: string[];
};

export { CATEGORIES, ICONS } from "./catalog-data";
