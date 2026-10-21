export type CatalogIcon = {
    name: string;
    title: string;
    keywords: string;
    prefix: "simple-icons" | "logos";
    hex?: string;
};

export type Category = {
    id: string;
    title: string;
    names: string[];
};

export { CATEGORIES, ICONS } from "./catalog-data";
