import { Event } from './Event';
import { EventType } from '../view/View';
export declare enum InputState {
    NORMAL = 0,
    BEGAN = 1,
    CHANGED = 2,
    ENDED = 3
}
export declare class InputEvent extends Event {
    text: string;
    state: InputState;
    get type(): EventType;
}
