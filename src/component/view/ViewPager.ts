import { View, ViewStyle } from './View'

export interface ViewPagerStyle extends ViewStyle {
  width?: string | number
  height?: string | number
  itemSpacing?: string | number
  edgeSpacing?: string | number
  canLoop?: boolean
  autoPlay?: boolean
  loopInterval?: number,
  borderRadius?: string | number,
  scaleFactor?: number,
  alphaFactor?: number
}

export class ViewPager extends View {
  protected _style: ViewPagerStyle
  data!: Array<any>
  itemViews!: Array<View>
  itemViewsArray!: Array<any>

  constructor() {
    super()
    // @ts-ignore
    this._style = this._style = new Proxy(this._style, {
      get: (target, key) => {
        // @ts-ignore
        return target[key] || this.node.style[key]
      },
      set: (target, key, value) => {
        // 设置style
        // @ts-ignore
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

  set style(_style: ViewPagerStyle) {
    this._style = Object.assign(this._style, _style)
  }

  // onPageChange: (current: number, total: number) => void

  // onItemClick: (position: number) => void

  // onItemView: (position: number, view: View) => View

  onPageChange(callback: any) {
    callback()
  }

  onItemClick(callback: any) {
    callback()
  }
  onItemView(callback: any) {
    callback()
  }

  setCurrentItem(position: number) {}

  setItemViewsArray(itemViewsInfo: any) {
    let { flag, components } = itemViewsInfo
    let hasExist = false
    this.itemViewsArray.forEach(element => {
      if (element.flag === flag) {
        hasExist = true
        element.components = components
      }
    })
    if (!hasExist) {
      this.itemViewsArray.push(itemViewsInfo)
    }
    this.updateItemViews()
  }

  updateItemViews() {
    let itemViews: any[] = []
    this.itemViewsArray.forEach(element => {
      itemViews = itemViews.concat(element.components)
    })
    this.itemViews = itemViews
    // @ts-ignore
    this.data = new Array[this.itemViews.length]()
  }
}
