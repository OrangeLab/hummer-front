import { Event } from './Event';
import { EventType } from '../view/View';
export interface SwitchEventListener {
    (event?: SwitchEvent): void;
}
export declare class SwitchEvent extends Event {
    state: Boolean;
    get type(): EventType;
}
