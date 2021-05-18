import { View, ViewStyle } from './View';
export interface ButtonStyle extends ViewStyle {
    textAlign?: 'left' | 'center' | 'right';
    fontFamily?: string;
    fontSize?: string | number;
    color?: string;
}
export declare class Button extends View {
    private _beforeDisabledStyle;
    private _disabled;
    private _beforePressedStyle;
    pressed: ButtonStyle;
    protected _style: ButtonStyle;
    constructor();
    protected defaultStyle(): void;
    private init;
    protected createNode(): void;
    get text(): string;
    set text(text: string);
    get enabled(): boolean;
    set enabled(_enabled: boolean);
    get disabled(): ButtonStyle;
    set disabled(_disabled: ButtonStyle);
}
