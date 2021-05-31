import { View, ViewStyle } from './View';
export interface ImageStyle extends ViewStyle {
    resize?: 'origin' | 'contain' | 'cover' | 'stretch';
}
export declare class Image extends View {
    protected _style: ImageStyle;
    protected _src: string;
    protected _gifSrc: string;
    constructor();
    protected createNode(): void;
    protected defaultStyle(): void;
    private setImageResizeMode;
    get src(): string;
    set src(src: string);
    get gifSrc(): string;
    set gifSrc(gifSrc: string);
    get gifRepeatCount(): number;
    set gifRepeatCount(gifRepeatCount: number);
    set onload(onload: Function);
    get onload(): Function;
    get style(): ImageStyle;
    set style(_style: ImageStyle);
}
