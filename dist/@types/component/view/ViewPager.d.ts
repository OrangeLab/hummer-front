import { View, ViewStyle } from './View';
export interface ViewPagerStyle extends ViewStyle {
    width?: string | number;
    height?: string | number;
    itemSpacing?: string | number;
    edgeSpacing?: string | number;
    canLoop?: boolean;
    autoPlay?: boolean;
    loopInterval?: number;
    borderRadius?: string | number;
    scaleFactor?: number;
    alphaFactor?: number;
}
export declare class ViewPager extends View {
    protected _style: ViewPagerStyle;
    data: Array<any>;
    itemViews: Array<View>;
    itemViewsArray: Array<any>;
    constructor();
    protected createNode(): void;
    get style(): ViewPagerStyle;
    set style(_style: ViewPagerStyle);
    onPageChange(callback: any): void;
    onItemClick(callback: any): void;
    onItemView(callback: any): void;
    setCurrentItem(position: number): void;
    setItemViewsArray(itemViewsInfo: any): void;
    updateItemViews(): void;
}
