import { View, ViewStyle } from './View';
export declare const INPUT_SIZE_STYLE: Array<any>;
export interface InputStyle extends ViewStyle {
    type?: 'default' | 'number' | 'tel' | 'email' | 'password';
    color?: string;
    placeholderColor?: string;
    cursorColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    fontFamily?: string;
    maxLength?: number;
    fontSize?: string | number;
    returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
}
export declare class Input extends View {
    protected _style: InputStyle;
    protected _randomPlaceholderClass: string;
    protected _placeholderCssIndex: number;
    constructor();
    protected defaultStyle(): void;
    protected changePlaceholder({ fontSize, color }: {
        fontSize: any;
        color: any;
    }): void;
    protected createNode(): void;
    get text(): any;
    set text(value: any);
    get focused(): boolean;
    set focused(focused: boolean);
    get placeholder(): any;
    set placeholder(value: any);
    get style(): InputStyle;
    set style(_style: InputStyle);
    clear(): void;
}
