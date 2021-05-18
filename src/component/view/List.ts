import { View, ViewStyle } from './View'
import { EventListener } from '../event/Event'
export interface ListStyle extends ViewStyle {
  mode?: 'list' | 'grid' | 'waterfall'
  scrollDirection?: 'vertical' | 'horizontal'
  column?: number
  lineSpacing?: number | string
  itemSpacing?: number | string
  leftSpacing?: number | string
  rightSpacing?: number | string
  topSpacing?: number | string
  bottomSpacing?: number | string
}

export class List extends View {
  refreshView!: View
  loadMoreView!: View
  showScrollBar: boolean = false // 滑动时是否显示滚动条
  bounces: boolean = false // 滑动到 边缘时是否有回弹效果
  protected _style: ListStyle

  constructor() {
    super()
  }

  /**
   * @not support
   */
  onRegister!: (position: number) => number
  /**
   * @ignore
   */
  onCreate!: (type: number) => View
  /**
   * @not support
   */
  onUpdate!: (position: number, cell: View) => void

  /**
   * 下拉刷新时触发的回调
   * 0(正常状态) 1(即将刷新) 2(正在刷新)
   */
  onRefresh!: (state: 0 | 1 | 2) => void
  /**
   * 下拉刷新时触发的回调
   * 0(正常状态) 1(正在刷新) 2(无数据)
   */
  onLoadMore!: (state: 0 | 1 | 2) => void

  get style() {
    return this._style
  }

  set style(_style: ListStyle) {
    this._style = Object.assign(this._style, _style)
  }

  /**
   * @not support
   * @param count 
   */
  refresh(count: number) {
  }

  /**
   * 滚动到坐标
   */
  scrollTo(x: number, y: number) {
  }

  /**
   * 滚动一定位置
   */
  scrollBy(dx: number, dy: number) {
  }

  /**
   * 滚动到顶部
   */
  scrollToTop(){

  }

  /**
   * 滚动到底部
   */
  scrollToBottom(){

  }

  /**
   * 滚动到顶部事件监听
   */
  setOnScrollToTopListener(){

  }

  /**
   * 滚动到底部事件监听
   */
  setOnScrollToBottomListener(){

  }

  /**
   * 结束下拉刷新
   */
  stopPullRefresh() {
  }

  /**
   * 结束上拉加载更多
   * @param enable 下次能否继续触发加载更多，true不能、false 能
   */
  stopLoadMore(enable?: boolean) {
  }

  addEventListener(key: 'scroll', listener: EventListener) {
   
  }

  removeEventListener(key: 'scroll', listener: EventListener) {
  }

}
