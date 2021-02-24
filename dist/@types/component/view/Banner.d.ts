import { View, ViewStyle } from './View';
export interface BannerStyle extends ViewStyle {
    width?: string;
    height?: string;
    itemSpacing?: number;
    edgeSpacing?: number;
    canLoop?: boolean;
    autoPlay?: boolean;
    loopInterval?: number;
    scaleFactor?: number;
    alphaFactor?: number;
}
export declare class Banner extends View {
    protected _style: BannerStyle;
    data: Array<any>;
    itemViews: Array<View>;
    itemViewsArray: Array<any>;
    constructor();
    protected createNode(): void;
    get style(): BannerStyle;
    set style(_style: BannerStyle);
    setCurrentItem(position: number): void;
    onPageChange(callback: any): void;
    onItemClick(callback: any): void;
    onItemView(callback: any): void;
    onPageScroll(callback: any): void;
    onPageScrollStateChange(callback: any): void;
    setItemViewsArray(itemViewsInfo: any): void;
    updateItemViews(): void;
}
