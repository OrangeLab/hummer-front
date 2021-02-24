import { View, ViewStyle } from './View';
import { SwitchEventListener } from '../event/SwitchEvent';
export interface SwitchStyle extends ViewStyle {
    onColor?: string;
    offColor?: string;
    thumbColor?: string;
}
export declare class Switch extends View {
    private switchBtn;
    private circle;
    private addChangeEvent;
    disabled: boolean;
    protected _style: SwitchStyle;
    constructor();
    protected createNode(): void;
    private bindEvents;
    addEventListener(key: 'switch', listener: SwitchEventListener): void;
    set checked(val: boolean);
    get checked(): boolean;
    get style(): SwitchStyle;
    set style(_style: SwitchStyle);
}
