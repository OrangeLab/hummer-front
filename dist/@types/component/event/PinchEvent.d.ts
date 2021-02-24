import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum PinchState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3,
    CANCELLED = 4
}
export declare class PinchEvent extends Event {
    state: PinchState;
    scale: number;
    timestamp: string;
    get type(): EventType;
}
