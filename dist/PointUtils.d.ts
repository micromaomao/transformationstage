export declare type Point = [number, number];
export interface Boundable {
    getBoundingClientRect: () => TopLeft;
}
interface TopLeft {
    top: number;
    left: number;
}
export declare function getClientOffset(view: Boundable): Point;
export declare function client2view(point: Point, view: Boundable): Point;
export declare function view2client(point: Point, view: Boundable): Point;
export declare function pointDistance(a: Point, b: Point): number;
export {};
