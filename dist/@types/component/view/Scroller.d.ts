import { View, ViewStyle } from './View';
import { EventListener } from '../event/Event';
export interface ScrollerStyle extends ViewStyle {
    showScrollBar?: boolean;
}
export declare class Scroller extends View {
    refreshView: View;
    loadMoreView: View;
    showScrollBar: boolean;
    bounces: boolean;
    protected _style: ScrollerStyle;
    private rowCount;
    private wrapper;
    private bscroll;
    constructor();
    refresh(count: number): void;
    private refreshListView;
    private registerBsScrollEvent;
    addEventListener(key: 'scroll', listener: EventListener): void;
    removeEventListener(key: 'scroll', listener: EventListener): void;
    onRegister: (position: number) => number;
    scrollTo(x: number, y: number): void;
    scrollBy(dx: number, dy: number): void;
    scrollToTop(): void;
    onRefresh: (state: 0 | 1 | 2) => void;
    onLoadMore: (state: 0 | 1 | 2) => void;
    scrollToBottom(): void;
    setOnScrollToTopListener(callback: Function): void;
    setOnScrollToBottomListener(callback: Function): void;
    updateContentSize(): void;
}
