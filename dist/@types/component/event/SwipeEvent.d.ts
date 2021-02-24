import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum SwipeState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3,
    CANCELLED = 4
}
export declare class SwipeEvent extends Event {
    state: SwipeState;
    direction: 'left' | 'right' | 'up' | 'down';
    timestamp: string;
    get type(): EventType;
}
