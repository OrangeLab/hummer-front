export declare type KeyPath = 'position' | 'scale' | 'scaleX' | 'scaleY' | 'rotationX' | 'rotationY' | 'rotationZ' | 'opacity' | 'backgroundColor';
export declare type EasingType = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
export interface PointValue {
    x: string | number;
    y: string | number;
}
export declare type ValueType = string | number | PointValue;
export declare class BasicAnimation {
    path: KeyPath;
    duration: number;
    delay: number;
    repeatCount: number;
    value: ValueType;
    easing: EasingType;
    onstart: Function;
    onend: Function;
    on(type: string, callback: Function): void;
    removeAnimation: Function;
    constructor(path: KeyPath);
}
