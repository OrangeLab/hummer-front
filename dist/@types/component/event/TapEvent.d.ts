import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum TapState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3,
    CANCELLED = 4
}
export declare class TapEvent extends Event {
    position: {
        x: number | string;
        y: number | string;
    };
    state: TapState;
    timestamp: string;
    get type(): EventType;
}
