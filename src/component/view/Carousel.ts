import { View, ViewStyle } from './View'

export interface CarouselStyle extends ViewStyle {}

export class Carousel extends View {
  protected _style: CarouselStyle
  addRegionChangedListener: Function

  constructor() {
    super()
  }

  protected createNode() {
    this.node = document.createElement('div')
  }
  onPageChange(callback) {
    callback()
  }

  onItemClick(callback) {
    callback()
  }
  onItemView(callback) {
    callback()
  }
}
