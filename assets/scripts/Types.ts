export type PlatformData = {
    shape: PlatformShape;
    tilesCount: number;
    x: number;
    y: number;
}

export enum PlatformShape {
    HORIZONTAL,
    VERTICAL,
    DIAGONAL_UP,
    DIAGONAL_DOWN,
    ZIC_ZAC
}

export enum RunnerMode {
    AUTO,
    MANUAL
}
