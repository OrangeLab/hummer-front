import { View, ViewStyle } from './View'
import BScroll from 'better-scroll'
import { ScrollEvent, ScrollState } from '../event/ScrollEvent'
import { EventListener } from '../event/Event'
import { nodeObserver } from '../../common/utils'
import { formatUnit } from '../../common/utils'
export class HorizontalScroller extends View {
  _bounces: boolean = true // 滑动到 边缘时是否有回弹效果
  _showScrollBar: boolean = false // 滑动时是否显示滚动条
  protected _style: ViewStyle
  // @ts-ignore
  private bscroll: BScroll
  private wrapper: Element
  constructor() {
    super()
    this.wrapper = document.createElement('span');
    this.wrapper.classList.add('hm-default-horizontal')
    this.node.appendChild(this.wrapper)
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
        switch (key) {
          default:
            this.node.style[key] = formatUnit(value)
        }
        return true
      }
    })
    nodeObserver(this.node, () => {
      this.bscroll && this.bscroll.refresh();
    })
  }
  get style() {
    return this._style
  }

  set style(_style: ViewStyle) {
    this._style = Object.assign(this._style, _style)
  }

  get showScrollBar() {
    return this._showScrollBar
  }

  set showScrollBar(value: boolean) {
    this._showScrollBar = value
    if (this.bscroll) {
      this.bscroll.destroy()
      this.bscroll = null
      this.refresh()
    }
  }

  get bounces() {
    return this._bounces
  }

  set bounces(value: boolean) {
    this._bounces = value
    if (this.bscroll) {
      this.bscroll.destroy()
      this.bscroll = null
      this.refresh()
    }
  }

  protected defaultStyle() {
    this.node.classList.add('hm-default-horizontal')
  }

  onMounted() {
    this.refresh()
  }
  onDestoryed() {
    this.bscroll.destroy()
  }
  appendChild(subview: any) {
    this.wrapper.appendChild(subview.node)
    subview._onMounted();
    this.bscroll && this.bscroll.refresh()
  }

  removeChild(subview: any) {
    this.wrapper.removeChild(subview.node)
    this.bscroll && this.bscroll.refresh()
  }

  insertBefore(subview: any, existingView: View) {
    this.wrapper.insertBefore(subview.node, existingView.node)
    subview._onMounted();
  }

  refresh() {
    this.refreshListView()
  }

  /**
   *  init hm-list-row
   */
  private refreshListView() {
    if (!this.bscroll) {
      this.bscroll = new BScroll(this.node, {
        bounce: this._bounces,
        stopPropagation: true,
        disableMouse: false,
        disableTouch: false,
        scrollX: true,
        scrollY: false,
        pullUpLoad: false,
        pullDownRefresh: false,
        click: true,
        dblclick: true,
        scrollbar: this._showScrollBar,
        tap: 'tap',
        probeType: 3,
        eventPassthrough: 'vertical',
      })
      if (
        this.listeners['scroll'] &&
        this.listeners['scroll'].length > 0 &&
        !this.eventListeners['scroll']
      ) {
        this.registerBsScrollEvent()
      }

      if ((this.listeners['scrollToTop'] && this.listeners['scrollToTop'].length > 0) ||
        (this.listeners['scrollToBottom'] && this.listeners['scrollToBottom'].length > 0)) {
        let direction = 'none'
        this.bscroll.on('scroll', (e: any) => {
          if (e.x >= 0) {
            if (direction === 'none') {
              this.listeners['scrollToTop'].forEach(listener => listener())
            }
            direction = 'center'
          } else if (e.x <= this.bscroll.maxScrollX) {
            if (direction === 'none') {
              this.listeners['scrollToBottom'].forEach(listener => listener())
            }
            direction = 'center'
          } else if (e.x > this.bscroll.maxScrollX && e.x < 0) {
            direction = 'none'
          }
        })
      }
    } else {
      this.bscroll.refresh();
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
      let oldOffsetY = 0, oldOffsetX = 0;
      const scroll = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.SCROLL
        ev.timestamp = `${Date.now()}`
        ev.offsetY = 0
        ev.offsetX = -e.x
        ev.dx = ev.offsetX - oldOffsetX
        ev.dy = ev.offsetY - oldOffsetY
        oldOffsetY = 0
        oldOffsetX = -e.x
        this.listeners['scroll'].forEach(listener => listener(ev))
      }
      const scrollEnd = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.ENDED
        ev.timestamp = `${Date.now()}`
        ev.offsetY = 0
        ev.offsetX = -e.x
        ev.dx = ev.offsetX - oldOffsetX
        ev.dy = ev.offsetY - oldOffsetY
        oldOffsetY = 0
        oldOffsetX = -e.x
        this.listeners['scroll'].forEach(listener => listener(ev))
      }
      const touchEnd = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.SCROLL_UP
        ev.timestamp = `${Date.now()}`
        ev.offsetY = 0
        ev.offsetX = -e.x
        ev.dx = ev.offsetX - oldOffsetX
        ev.dy = ev.offsetY - oldOffsetY
        oldOffsetY = 0
        oldOffsetX = -e.x
        this.listeners['scroll'].forEach(listener => listener(ev))
      }

      this.bscroll.on('touchEnd', touchEnd)
      this.bscroll.on('scrollStart', scrollStart)
      this.bscroll.on('scroll', scroll)
      this.bscroll.on('scrollEnd', scrollEnd)
      this.eventListeners['scroll'] = { scrollStart, scroll, scrollEnd, touchEnd }
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
   * 滚动到坐标
   */
  scrollTo(x: number, y: number) {
    if (this.bscroll) {
      this.bscroll.scrollTo(-x, -y, 300)
    }
  }

  /**
   * 滚动一定距离
   */
  scrollBy(dx: number, dy: number) {
    if (this.bscroll) {
      this.bscroll.scrollBy(dx, dy, 300)
    }
  }

  /**
   * 滚动到顶部
   */
  scrollToTop() {
    if (this.bscroll) {
      this.bscroll.scrollTo(0, 0, 300)
    }
  }

  /**
   * 滚动到底部
   */
  scrollToBottom() {
    if (this.bscroll) {
      this.bscroll.scrollTo(this.bscroll.maxScrollX, 0, 300)
    }
  }

  /**
   * 滚动到顶部事件监听
   */
  setOnScrollToTopListener(callback: EventListener) {
    if (!this.listeners['scrollToTop']) {
      this.listeners['scrollToTop'] = []
    }
    this.listeners['scrollToTop'].push(callback)
  }

  /**
   * 滚动到底部事件监听
   */
  setOnScrollToBottomListener(callback: EventListener) {
    if (!this.listeners['scrollToBottom']) {
      this.listeners['scrollToBottom'] = []
    }
    this.listeners['scrollToBottom'].push(callback)
  }

  /**
   * 更新滚动视图大小（iOS独有方法）
   */
  updateContentSize() {
    if (this.bscroll) {
      this.bscroll.refresh()
    }
  }
}
