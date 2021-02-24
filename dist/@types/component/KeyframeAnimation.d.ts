import { KeyPath, ValueType, EasingType } from './BasicAnimation';
export declare class KeyframeAnimation {
    path: KeyPath;
    duration: number;
    repeatCount: number;
    keyframes: Array<{
        percent?: number;
        value: ValueType;
        easing?: EasingType;
    }>;
    easing?: EasingType;
    onstart: Function;
    onend: Function;
    on(type: string, callback: Function): void;
    removeAnimation: Function;
    constructor(path: KeyPath);
}
