import { View, ViewStyle } from './View';
export interface HorizontalScrollerStyle extends ViewStyle {
    showScrollBar?: boolean;
}
export declare class HorizontalScroller extends View {
    protected _style: HorizontalScrollerStyle;
    constructor();
    protected createNode(): void;
    get style(): HorizontalScrollerStyle;
    set style(_style: HorizontalScrollerStyle);
    scrollTo(x: number, y: number): void;
    scrollBy(dx: number, dy: number): void;
    scrollToTop(): void;
    scrollToBottom(): void;
    setOnScrollToTopListener(callback: Function): void;
    setOnScrollToBottomListener(callback: Function): void;
    updateContentSize(): void;
}
