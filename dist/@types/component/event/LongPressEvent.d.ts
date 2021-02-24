import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum LongPressState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3,
    CANCELLED = 4
}
export declare class LongPressEvent extends Event {
    state: LongPressState;
    timestamp: string;
    get type(): EventType;
}
