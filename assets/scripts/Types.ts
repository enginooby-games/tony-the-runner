export type PlatformData = {
    shape: PlatformShape;
    tilesCount: number;
    speed: number;
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
