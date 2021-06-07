import * as BScroll from 'better-scroll'
import { View, ViewStyle } from './View'
import { ScrollEvent, ScrollState } from '../event/ScrollEvent'
import { EventListener } from '../event/Event'
// import { Hummer } from '../../base/Global'
// import { formatUnit } from '../../common/utils'



export interface ScrollerStyle extends ViewStyle {
  // 滑动时是否显示滚动条
  showScrollBar?: boolean
}

export class Scroller extends View {
  
  refreshView!: View
  loadMoreView!: View
  showScrollBar: boolean = false // 滑动时是否显示滚动条
  bounces: boolean = true // 滑动到 边缘时是否有回弹效果
  protected _style: ScrollerStyle

  // @ts-ignore
  private rowCount!: number
  // private _listRows: View[] = []s
  // private _gridRows: View[] = []
  // private _waterfalls: View[] = []

  private wrapper: View
  // @ts-ignore
  private bscroll: BScroll

  
  constructor() {
    super()
    // this.wrapper = new View()
    // this.wrapper.node.classList.add('hm-list-content')
    // this.appendChild(this.wrapper)

    // Todo: add style to this node

    // @ts-ignore
    this._style = new Proxy(this._style, {
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
    // this.refresh(this.rowCount)
  }

  refresh(count: number) {
    this.rowCount = count
    this.refreshListView(count)
  }

  /**
   *  init hm-list-row
   */
  private refreshListView(count: number) {
    this.wrapper.removeAll()
    // add refresh view
    if (this.refreshView) {
      this.wrapper.appendChild(this.refreshView)
      this.refreshView.style.display = 'none'
    }

    // let types = Array.apply(new Array(count)).map((value, index) => {
    //   this.onRegister(index)
    // })

    // Todo: add logic for what ?

    // 添加 loadmore view
    if (this.loadMoreView) {
      this.wrapper.appendChild(this.loadMoreView)
      this.loadMoreView.style.display = 'none'
    }

    this.bscroll = new BScroll(this.node, {
      scrollX: false,
      scrollY: true,
      pullUpLoad: true,
      pullDownRefresh: true,
      click: true,
      dblclick: true,
      tap: true,
      probeType: 3
    })

    // 上拉刷新
    this.bscroll.on('pullingUp', () => {
      this.loadMoreView && (this.loadMoreView.style.display = 'inline')
      // this.onLoadMore && this.onLoadMore(1)
    })

    // 下拉加载更多
    this.bscroll.on('pullingDown', () => {
      this.refreshView && (this.refreshView.style.display = 'inline')
      this.onRefresh && this.onRefresh(2)
    })

    // 判断是否要注册bs-scroll事件
    if (
      this.listeners['scroll'] &&
      this.listeners['scroll'].length > 0 &&
      !this.eventListeners['scroll']
    ) {
      this.registerBsScrollEvent()
    }
  }


  private registerBsScrollEvent() {
    if (this.bscroll) {
      // 如果存在better-scroll对象
      const scrollStart = () => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.BEGAN
        ev.timestamp = `${Date.now()}`
        this.listeners['scroll'].forEach(listener => listener(ev))
      }
      const scroll = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.SCROLL
        ev.timestamp = `${Date.now()}`
        ev.dx = e.x
        ev.dy = e.y
        this.listeners['scroll'].forEach(listener => listener(ev))
      }
      const scrollEnd = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.ENDED
        ev.timestamp = `${Date.now()}`
        ev.dx = e.x
        ev.dy = e.y
        this.listeners['scroll'].forEach(listener => listener(ev))
      }

      this.bscroll.on('scrollStart', scrollStart)
      this.bscroll.on('scroll', scroll)
      this.bscroll.on('scrollEnd', scrollEnd)
      this.eventListeners['scroll'] = { scrollStart, scroll, scrollEnd }
    }
  }


  addEventListener(key: 'scroll', listener: EventListener) {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    // 将事件callback加入到事件队列
    this.listeners[key].push(listener)
    // 注册better-scroll事件监听
    if (!this.eventListeners[key]) {
      // 如果没有监听scroll事件
      this.registerBsScrollEvent()
    }
  }

  removeEventListener(key: 'scroll', listener: EventListener) {
    if (this.listeners[key]) {
      // 将事件从事件队列中删除
      this.listeners[key] = this.listeners[key].filter(
        _listener => _listener !== listener
      )
      // 如果事件队列为空，取消事件监听
      if (this.listeners[key].length === 0) {
        if (this.eventListeners[key]) {
          const { scrollStart, scroll, scrollEnd } = this.eventListeners[key]
          this.bscroll.off('scrollStart', scrollStart)
          this.bscroll.off('scroll', scroll)
          this.bscroll.off('scrollEnd', scrollEnd)
          // @ts-ignore
          this.eventListeners[key] = null
        }
      }
    }
  }


  /**
   * @not support
   */
  onRegister!: (position: number) => number

  /**
   * 滚动到坐标
   */
  scrollTo(x: number, y: number) {
    if (this.bscroll) {
      this.bscroll.scrollTo(x, y)
    }
  }

  /**
   * 滚动一定距离
   */
  scrollBy(dx: number, dy: number) {
    if (this.bscroll) {
      this.bscroll.scrollBy(dx, dy)
    }
  }

  /**
   * 滚动到顶部
   */
  scrollToTop() {}

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
