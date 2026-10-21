export type IconRef = {
    prefix: string;
    name: string;
    title: string;
    // Simple Icons' official colour, six upper-case hex digits without "#".
    hex?: string;
};

export type IconPick = IconRef & { svg: string };

export type IconSize = 32 | 64 | 128 | 256;

export type PlaceOptions = {
    size: IconSize;
    // "brand", "ink" or "#rrggbb".
    color: string;
    label: boolean;
};

export type PersistedState = {
    recent: IconRef[];
    options: PlaceOptions;
};

export type WebviewToDriver =
    | { type: "ready" }
    | { type: "drop-icon"; icon: IconPick; x: number; y: number }
    | { type: "insert-icon"; icon: IconPick }
    | { type: "persist"; recent: IconRef[]; options: PlaceOptions };

export type DriverToWebview =
    | { type: "init"; recent: IconRef[]; options: PlaceOptions }
    | { type: "theme"; cssVars: string };
