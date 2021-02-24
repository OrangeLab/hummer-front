import { View, ViewStyle } from './View'

export interface HorizontalScrollerStyle extends ViewStyle {
  showScrollBar?: boolean
}

export class HorizontalScroller extends View {
  protected _style: HorizontalScrollerStyle

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
    this.node = document.createElement('span')
  }

  get style() {
    return this._style
  }

  set style(_style: HorizontalScrollerStyle) {
    this._style = Object.assign(this._style, _style)
  }
  

  /**
   * 滚动到坐标
   */
  scrollTo(x: number, y: number) {}

  /**
   * 滚动一定距离
   */
  scrollBy(dx: number, dy: number) {}

  /**
   * 滚动到顶部
   */
  scrollToTop() {}

  /**
   * 滚动到底部
   */
  scrollToBottom() {}

  /**
   * 滚动到顶部事件监听
   */
  setOnScrollToTopListener(callback: Function) {}

  /**
   * 滚动到底部事件监听
   */
  setOnScrollToBottomListener(callback: Function) {}

  /**
   * 更新滚动视图大小（iOS独有方法）
   */
  updateContentSize() {}  
}
