import { EventType, View } from '../view/View';
export declare abstract class Event {
    target: View;
    abstract get type(): EventType;
}
export interface EventListener {
    (event?: Event): void;
}
