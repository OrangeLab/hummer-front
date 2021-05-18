import { View, ViewStyle } from './View';
export interface CarouselStyle extends ViewStyle {
}
export declare class Carousel extends View {
    protected _style: CarouselStyle;
    addRegionChangedListener: Function;
    constructor();
    protected createNode(): void;
    onPageChange(callback: any): void;
    onItemClick(callback: any): void;
    onItemView(callback: any): void;
}
