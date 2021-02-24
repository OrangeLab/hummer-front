import { View, ViewStyle } from './View'

export interface CarouselStyle extends ViewStyle {}

export class Carousel extends View {
  protected _style: CarouselStyle
  addRegionChangedListener: Function

  constructor() {
    super()
    this._style = this._style = new Proxy(this._style, {
      get: (target, key) => {
        return target[key] || this.node.style[key]
      },
      set: (target, key, value) => {
        // 设置style
        target[key] = value
        this.node.style[key] = value
        return true
      }
    })
  }

  protected createNode() {
    this.node = document.createElement('div')
  }

  get style() {
    return this._style
  }

  set style(_style: CarouselStyle) {
    this._style = Object.assign(this._style, _style)
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
