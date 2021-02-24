import { View, ViewStyle } from './View';
export interface ScrollerStyle extends ViewStyle {
    showScrollBar?: boolean;
}
export declare class Scroller extends View {
    protected _style: ScrollerStyle;
    refreshView?: any;
    loadMoreView?: any;
    constructor();
    protected createNode(): void;
    get style(): ScrollerStyle;
    set style(_style: ScrollerStyle);
    scrollTo(x: number, y: number): void;
    scrollBy(dx: number, dy: number): void;
    scrollToTop(): void;
    onRefresh(callback: Function): void;
    onLoadMore(callback: Function): void;
    scrollToBottom(): void;
    setOnScrollToTopListener(callback: Function): void;
    setOnScrollToBottomListener(callback: Function): void;
    updateContentSize(): void;
}
