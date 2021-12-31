import BScroll from 'better-scroll'
import { View, ViewStyle } from './View'
import { ScrollEvent, ScrollState } from '../event/ScrollEvent'
import { EventListener } from '../event/Event'
import { nodeObserver } from '../../common/utils'
import { formatUnit } from '../../common/utils'

export class Scroller extends View {

  refreshView!: View
  loadMoreView!: View
  _showScrollBar: boolean = false // 滑动时是否显示滚动条
  _bounces: boolean = true // 滑动到 边缘时是否有回弹效果
  isMoreData: boolean = true
  protected _style: ViewStyle

  config = {
    // 页面元素监听配置
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  }
  observer: ResizeObserver
  private wrapper: View
  // @ts-ignore
  private bscroll: BScroll


  constructor() {
    super()
    this.wrapper = new View()
    this.wrapper.node.classList.add('hm-scroller-content')
    this.node.appendChild(this.wrapper.node)
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
        // this.node.style[key] = value
        switch (key) {
          default:
            this.node.style[key] = formatUnit(value)
        }
        return true
      }
    })
    // 监听元素是否渲染
    nodeObserver(this.node, () => {
      this.refreshView && (this.refreshView.style = {
        position: 'absolute',
        transform: 'translateY(-100%) translateZ(0)',
        width: '100%',
      })
      if (this.bscroll) {
        this.refreshView && this.bscroll.openPullDown({
          stop: this.refreshView.node.offsetHeight
        });
        this.bscroll.refresh()
      }
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
  onMounted() {
    this.refresh()
  }
  onDestoryed(){
    this.bscroll.destroy()
  }

  appendChild(subview: any) {
    this.wrapper.node.appendChild(subview.node)
    subview._onMounted();
    this.bscroll && this.bscroll.refresh()
  }
  removeChild(subview: any) {
    this.wrapper.node.removeChild(subview.node)
    this.bscroll && this.bscroll.refresh()
  }
  insertBefore(subview: any, existingView: View) {
    this.wrapper.node.insertBefore(subview.node, existingView.node)
    subview._onMounted();
  }

  protected defaultStyle() {
    this.node.classList.add('hm-default-vertical')
  }

  refresh() {
    this.refreshListView()
  }

  /**
   *  init hm-list-row
   */
  private refreshListView() {
    // this.wrapper.removeAll();
    // add refresh view
    if (this.refreshView) {
      this.wrapper.node.insertBefore(this.refreshView.node, this.wrapper.node.children[0])
    }
    // add loadmore view
    if (this.loadMoreView) {
      this.wrapper.node.appendChild(this.loadMoreView.node)
    }

    if (!this.bscroll) {
      this.bscroll = new BScroll(this.node, {
        bounce: this._bounces,
        stopPropagation: true,
        disableMouse: false,
        disableTouch: false,
        scrollX: false,
        scrollY: true,
        pullUpLoad: this.loadMoreView ? true : false,
        pullDownRefresh: this.refreshView ? true : false,
        click: true,
        dblclick: true,
        scrollbar: this._showScrollBar,
        tap: 'tap',
        probeType: 3,
        eventPassthrough: 'horizontal',
      })
      // 上拉加载更多
      if (this.loadMoreView) {
        this.bscroll.on('pullingUp', () => {
          if (!this.isMoreData) {
            return;
          }
          this.onLoadMore(1)
        })
      }
      // 下拉刷新
      if (this.refreshView) {
        let pullflag = 'none'
        this.bscroll.on('pullingDown', () => {
          this.onRefresh && this.onRefresh(2)
        })
        this.bscroll.on('leaveThreshold', () => {
          this.onRefresh && this.onRefresh(3)
        })
        this.bscroll.on('scroll', (e: any) => {
          if (e.y > 0 && e.y<this.bscroll?.plugins?.pullDownRefresh?.options?.threshold) {
            if (pullflag === 'none') {
              this.onRefresh && this.onRefresh(1)
            }
            pullflag = 'center'
          } else if (e.y <= 0 ) {
            pullflag = 'none'
          }
        })
      }

      // 判断是否要注册bs-scroll事件
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
          if (e.y >= 0) {
            if (direction === 'none') {
              this.listeners['scrollToTop'].forEach(listener => listener())
            }
            direction = 'center'
          } else if (e.y <= this.bscroll.maxScrollY) {
            if (direction === 'none') {
              this.listeners['scrollToBottom'].forEach(listener => listener())
            }
            direction = 'center'
          } else if (e.y > this.bscroll.maxScrollY && e.y < 0) {
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
        ev.offsetY = -e.y
        ev.offsetX = 0
        ev.dx = ev.offsetX - oldOffsetX
        ev.dy = ev.offsetY - oldOffsetY
        oldOffsetY = -e.y
        oldOffsetX = 0
        this.listeners['scroll'].forEach(listener => listener(ev))
      }
      const scrollEnd = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.ENDED
        ev.timestamp = `${Date.now()}`
        ev.offsetY = -e.y
        ev.offsetX = 0
        ev.dx = ev.offsetX - oldOffsetX
        ev.dy = ev.offsetY - oldOffsetY
        oldOffsetY = -e.y
        oldOffsetX = 0
        this.listeners['scroll'].forEach(listener => listener(ev))
      }

      const touchEnd = (e: any) => {
        const ev = new ScrollEvent()
        ev.target = this
        ev.state = ScrollState.SCROLL_UP
        ev.timestamp = `${Date.now()}`
        ev.offsetY = -e.y
        ev.offsetX = 0
        ev.dx = ev.offsetX - oldOffsetX
        ev.dy = ev.offsetY - oldOffsetY
        oldOffsetY = -e.y
        oldOffsetX = 0
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
   * @not support
   */
  onRegister!: (position: number) => number

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
      this.bscroll.scrollTo(0, this.bscroll.maxScrollY, 300)
    }
  }

  /**
   * 下拉刷新时触发的回调
   * 0(正常状态) 1(即将刷新) 2(正在刷新)
   */
  onRefresh!: (state: 0 | 1 | 2 | 3) => void

  /**
   * 下拉刷新时触发的回调
   * 0(正常状态) 1(正在刷新) 2(无数据)
   */
  onLoadMore!: (state: 0 | 1 | 2) => void

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
  stopPullRefresh() {
    this.isMoreData = true
    this.bscroll.finishPullUp()
    this.loadMoreView.style = {
      position: 'static',
      transform: 'none',
    }
    this.bscroll && this.bscroll.finishPullDown()
    this.onRefresh && this.onRefresh(0)
    this.bscroll && this.bscroll.refresh()
  }
  stopLoadMore(enable: boolean) {
    if (this.bscroll) {
      if (!enable) {
        this.isMoreData = false
        this.loadMoreView.style = {
          position: 'absolute',
          bottom: 0,
          transform: 'translateY(100%) translateZ(0)',
          width: '100%',
        }
        this.bscroll.finishPullUp()
      } else {
        this.bscroll.finishPullUp()
      }
      this.onLoadMore && this.onLoadMore(enable ? 0 : 2)
      this.bscroll.refresh()
    }
  }
}

