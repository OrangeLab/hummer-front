import { Input, InputStyle } from './Input';
export interface TextAreaStyle extends InputStyle {
    textLineClamp?: number;
}
export declare class TextArea extends Input {
    protected _style: TextAreaStyle;
    constructor();
    protected createNode(): void;
    get style(): TextAreaStyle;
    set style(_style: TextAreaStyle);
}
