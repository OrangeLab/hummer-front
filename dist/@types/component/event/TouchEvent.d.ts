import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum TouchState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3,
    CANCELLED = 4
}
export declare class TouchEvent extends Event {
    position: {
        x: number;
        y: number;
    };
    state: TouchState;
    timestamp: string;
    get type(): EventType;
}
