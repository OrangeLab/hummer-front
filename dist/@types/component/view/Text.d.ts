import { View, ViewStyle } from './View';
export interface TextStyle extends ViewStyle {
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    textDecoration?: 'none' | 'underline' | 'line-through';
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textOverflow?: 'clip' | 'ellipsis';
    textLineClamp?: number;
    letterSpacing?: number;
    lineSpacingMulti?: number;
}
export declare class Text extends View {
    protected _style: TextStyle;
    constructor();
    protected defaultStyle(): void;
    protected createNode(): void;
    get text(): string;
    set text(value: string);
    get richText(): any;
    set richText(value: any);
    get formattedText(): string;
    set formattedText(value: string);
}
