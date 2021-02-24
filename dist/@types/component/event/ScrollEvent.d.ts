import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum ScrollState {
    NORMAL = 0,
    BEGAN = 1,
    SCROLL = 2,
    ENDED = 3,
    SCROLL_UP = 4
}
export declare class ScrollEvent extends Event {
    state: ScrollState;
    offsetX: number;
    offsetY: number;
    dx: number;
    dy: number;
    timestamp: string;
    get type(): EventType;
}
