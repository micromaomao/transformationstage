import { Point, Boundable } from './PointUtils.js';
export declare type EvtName = "mousedown" | "touchstart" | "touchend" | "touchmove" | "touchcancel" | "wheel" | "mousewheel" | "gesturestart" | "gestureend" | "gesturechange";
export interface EventMap extends GlobalEventHandlersEventMap {
    "mousewheel": Event;
    "gesturestart": Event;
    "gesturechange": IOSGestureEvent;
    "gestureend": Event;
}
interface IOSGestureEvent {
    clientX: number;
    clientY: number;
    scale: number;
}
export interface EventTarget extends Boundable {
    addEventListener(eventName: EvtName, listener: (evt: EventMap[EvtName]) => void, noPassiveEventsArgument: boolean | {
        passive: boolean;
    }): void;
    removeEventListener(eventName: EvtName, listener: (evt: EventMap[EvtName]) => void): void;
}
/**
 * An utility for dealing with dragging and pinch-zooming
 */
export declare class TransformationStage {
    /** which viewport coordinate should the 0,0 point on stage maps to? */
    translate: Point;
    /** one stage pixel = how much viewport pixel? */
    scale: number;
    destroyed: boolean;
    viewportSize: Point;
    contentSize: Point;
    currentAnimation: PendingTransform | TransformVelocity;
    pressState: any;
    lastTapTime: number;
    lastTransformTime: number;
    handleWheel_userInteractionTimeout: number;
    /** Handle returned by requestAnimationFrame.
     *
     * The call to requestAnimationFrame is to only re-calculate tranformations in handleMove once per frame.
     */
    moveEventFrame: number;
    eventTarget: EventTarget;
    /** Called when mousedown / touchstart.
     *
     * Return false to cancel event handling. (for example because you would like to do your own thing in response to some user action)
     */
    onDownEvent: (evt: MouseEvent | TouchEvent) => boolean;
    /** Called when mousemove / touchmove.
     *
     * Return false to cancel event handling and abort user interaction (onAfterUserInteration won't be called).
     */
    onMoveEvent: (evt: MouseEvent | TouchEvent) => boolean;
    /** Called when, for example, user drags/pinches and release their finger(s). */
    onAfterUserInteration: () => void;
    /** Called when the transformation stage has changed. Application typically need to redraw their canvas when this happens.
     *
     * This function will usually only be called once per frame (as implemented by requestAnimationFrame)
    */
    onUpdate: () => void;
    minScale: number;
    maxScale: number;
    constructor();
    destroy(): void;
    /**
     * Map a coordinate on canvas into stage
     */
    view2stage(point: Point): Point;
    /**
     * Map a coordinate out of stage into the canvas space
     */
    stage2view(point: Point): Point;
    setViewportSize(w: number, h: number): void;
    setContentSize(w: number, h: number): void;
    animationGetFinalState(): PendingTransform;
    /**
     * Return a PendingTransform that will make a rect: [x, y, w, h] in the stage space be displayed at the center of the viewport.
     *
     * @example
     * stage.putOnCenter([0, 0, 1, 1]).applyImmediate()
     */
    putOnCenter(rect: [number, number, number, number]): PendingTransform;
    /**
     * Return a new transform with a translation that will make the point pStage on stage map to pCanvas on canvas after
     * applying the stage transform.
     *
     * @param {Array<number>} pStage
     * @param {Array<number>} pCanvas
     * @return {PendingTransform} new transform
     */
    mapPointToPoint(pStage: Point, pCanvas: Point): PendingTransform;
    /** Simillar to mapPointToPoint, but return a transform with a scale of scale. */
    scaleAndmapPointToPoint(pStage: Point, pCanvas: Point, scale: number): PendingTransform;
    bindEvents(element: EventTarget): void;
    removeEvents(element: EventTarget): void;
    handleMouseWheel(evt: Event): void;
    handleDown(evt: MouseEvent | TouchEvent): void;
    initMove(t: any): void;
    initMove_Mouse(clientPoint: any): void;
    initPinch(tA: any, tB: any): void;
    handleMove(evt: MouseEvent | TouchEvent): void;
    handleUp(evt: MouseEvent | TouchEvent): void;
    handleDoubleTap(point: any): void;
    handleWheel(evt: any): void;
    handleGestureStart(evt: any): void;
    handleGestureChange(evt: any): void;
    handleGestureEnd(evt: any): void;
}
/**
 * Representation of a transformation.
 */
export declare class PendingTransform {
    static LINEAR(x: number): number;
    static EASEOUT(x: number): number;
    readonly stage: TransformationStage;
    readonly nTranslate: Point;
    readonly nScale: number;
    readonly time: number;
    /** requestAnimationFrame handle */
    animationFrame: number;
    constructor(nTranslate: Point, nScale: number, stage: TransformationStage, time?: number);
    /** Immediately transform the stage to be this, discarding all pervious animation. */
    applyImmediate(): void;
    simillarTo(other: PendingTransform): boolean;
    /** Stop the animation, if the stage's current animation is this one. The state of the stage will stay frozen at its current value. */
    stop(): void;
    /** Start transforming the stage gradually from its current state to this. */
    startAnimation(duration?: number, easing?: typeof PendingTransform.EASEOUT): void;
    /**
     * @see TransformationStage.view2stage
     */
    view2stage(point: Point): Point;
    /**
     * @see TransformationStage.stage2view
     */
    stage2view(point: Point): Point;
    /** Return a new PendingTransform that is the same as this transform, except that if the
     * new transform could results in the content box getting out of the viewport, in which case
     * it is "pushed" back in. Typically used after user action to make sure content box stays in view.
     */
    boundInContentBox(): PendingTransform;
    shift([dx, dy]: Point): PendingTransform;
}
declare class TransformVelocity {
    vX: number;
    vY: number;
    uX: number;
    uY: number;
    animationFrameId: number;
    stage: TransformationStage;
    lastFrameTime: number;
    currentX: number;
    currentY: number;
    readonly nTranslate: Point;
    readonly nScale: number;
    readonly time: number;
    onDone: () => void;
    constructor(transformList: PendingTransform[], stage: TransformationStage);
    toString(): string;
    applyInertia(): Promise<{}>;
    nextFrame(): void;
    stop(): void;
}
export { Point };
