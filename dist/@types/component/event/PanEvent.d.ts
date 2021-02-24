import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum PanState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3,
    CANCELLED = 4
}
export declare class PanEvent extends Event {
    state: PanState;
    translation: {
        deltaX: number | string;
        deltaY: number | string;
    };
    timestamp: string;
    get type(): EventType;
}
