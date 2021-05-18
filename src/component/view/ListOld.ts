import * as BScroll from 'better-scroll'
import { View, ViewStyle } from './View'
import { ScrollEvent, ScrollState } from '../event/ScrollEvent'
import { EventListener } from '../event/Event'
import { Hummer } from '../../base/Global'
import { formatUnit } from '../../common/utils'

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

  private rowCount!: number
  private _listRows: View[] = []
  private _gridRows: View[] = []
  private _waterfalls: View[] = []

  private wrapper: View
  // @ts-ignore
  private bscroll: BScroll

  constructor() {
    super()

    this.wrapper = new View()
    this.wrapper.node.classList.add('hm-list-content')
    this.appendChild(this.wrapper)

    this.node.classList.add('hm-list')
    this.node.classList.add('vertical')
    this.node.classList.add('hm-list-wrapper')

    // @ts-ignore
    this._style = new Proxy(this._style, {
      get: (target, key) => {
        // 获取style
        // @ts-ignore
        return target[key] || this.node.style[key]
      },
      set: (target, key, value) => {
        // 设置style
        // @ts-ignore
        target[key] = value
        switch (key) {
          case 'mode':
            this.refresh(this.rowCount)
            break
          case 'scrollDirection':
            if (value === 'vertical') {
              this.node.classList.remove('horizontal')
              this.node.classList.add(value)
            } else if (value === 'horizontal') {
              this.node.classList.remove('vertical')
              this.node.classList.add(value)
            }
            break
          case 'column':
            this.refresh(this.rowCount)
            break
          case 'lineSpacing':
            this.refresh(this.rowCount)
            break
          case 'itemSpacing':
            break
          default:
            this.node.style[key] = value
            break
        }
        return true
      }
    })
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

  refresh(count: number) {
    this.rowCount = count
    switch (this.style.mode) {
      case 'grid':
        this.refreshGridView(count)
        break
      case 'waterfall':
        this.refreshWaterfallView(count)
        break
      case 'list':
      default:
        this.refreshListView(count)
        break
    }
  }

  /**
   * 滚动到指定位置
   * @param position 要滚动到的位置
   */
  scrollToPosition(position: number) {
    if (this.bscroll) {
      if (this.style.mode == 'list') {
        const view = this._listRows[position]
        view && this.bscroll.scrollToElement(view.node)
      } else if (this.style.mode == 'grid') {
        // 计算行
        const row = Math.floor(position / (this.style.column as any))
        const view = this._gridRows[row]
        view && this.bscroll.scrollToElement(view.node)
      } else if (this.style.mode == 'waterfall') {
        const view = this._waterfalls[position]
        view && this.bscroll.scrollToElement(view.node)
      }
    }
  }

  /**
   * 滚动到坐标
   */
  scrollTo(x: number, y: number) {
    if (this.bscroll) {
      this.bscroll.scrollTo(x, y)
    }
  }

  /**
   * 滚动一定位置
   */
  scrollBy(dx: number, dy: number) {
    if (this.bscroll) {
      this.bscroll.scrollBy(dx, dy)
    }
  }

  /**
   * 结束下拉刷新
   */
  stopPullRefresh() {
    this.refreshView && (this.refreshView.style.display = 'none')
    this.bscroll.finishPullDown()
  }

  /**
   * 设置上拉加载控件
   * @param enable 下次能否继续触发加载更多
   */
  stopLoadMore(enable?: boolean) {
    this.loadMoreView && (this.loadMoreView.style.display = 'none')
    this.bscroll.finishPullUp()
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
   * hm-list
   *   hm-list-row
   */
  private refreshListView(count: number) {
    this.wrapper.removeAll()

    // 添加refresh view
    if (this.refreshView) {
      this.wrapper.appendChild(this.refreshView)
      this.refreshView.style.display = 'none'
    }

    // 添加data row
    let types = Array.from(new Array(count)).map((value, index) =>
      this.onRegister(index)
    )
    types.forEach((type, index) => {
      const cell: View = this.onCreate(type)
      this.onUpdate(index, cell)
      const row = new View()
      row.node.classList.add('hm-list-row')
      //如果是水平滚动
      if (this.style.scrollDirection === 'horizontal') {
        row.style.width = this.style.width

        if (this.style.lineSpacing && index > 0) {
          row.style.marginLeft = `${this.style.lineSpacing}`
        }
      } else {
        // 竖向滚动
        if (this.style.lineSpacing && index > 0) {
          row.style.marginTop = `${this.style.lineSpacing}`
        }
      }
      row.appendChild(cell)
      this.wrapper.appendChild(row)
      this._listRows.push(row)
    })

    // 添加 loadmore view
    if (this.loadMoreView) {
      this.wrapper.appendChild(this.loadMoreView)
      this.loadMoreView.style.display = 'none'
    }

    this.bscroll = new BScroll(this.node, {
      scrollX: this.style.scrollDirection === 'horizontal',
      scrollY: this.style.scrollDirection !== 'horizontal',
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
      this.onLoadMore && this.onLoadMore(1)
    })

    // 下来加载更多
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

  /**
   * hm-list
   *   hm-list-row
   *     hm-list-cell
   * @param {number} count
   */
  private refreshGridView(count: number) {
    this.wrapper.removeAll()

    // 添加refresh view
    if (this.refreshView) {
      this.wrapper.appendChild(this.refreshView)
      this.refreshView.style.display = 'none'
    }
    const cellClientwidth = this.style.width
      ? +`${this.style.width}`.replace('px', '')
      : +Hummer.env.availableWidth.replace('dp', '')
    let types = Array.from(new Array(count)).map((value, index) =>
      this.onRegister(index)
    )
    const column = this.style.column || 2

    // 添加data row
    types.forEach((type, index) => {
      const cell: View = this.onCreate(type)
      this.onUpdate(index, cell)

      const col = new View()
      col.node.classList.add('hm-list-column')
      col.appendChild(cell)
      // @ts-ignore
      let row: View = null
      if (index % column === 0) {
        row = new View()
        row.node.classList.add('hm-list-row')
        //如果是水平滚动
        if (this.style.scrollDirection === 'horizontal') {
          row.style.width = this.style.width
          if (this.style.lineSpacing && index > 0) {
            // row.node.style.boxSizing = 'border-box'
            row.style.marginLeft = `${this.style.lineSpacing}`
          }
        } else {
          // 竖向滚动
          row.style.height = cellClientwidth / column + 'dp'
          if (this.style.lineSpacing && index > 0) {
            // row.node.style.boxSizing = 'border-box'
            row.style.marginTop = `${this.style.lineSpacing}`
          }
        }
        this._gridRows.push(row)
      } else {
        row = this._gridRows[Math.floor(index / column)]

        if (this.style.itemSpacing) {
          // col.node.style.boxSizing = 'border-box'
          col.style.marginLeft = `${this.style.itemSpacing}`
        }
      }
      row.appendChild(col)
      this.wrapper.appendChild(row)
    })

    // 添加 loadmore view
    if (this.loadMoreView) {
      this.wrapper.appendChild(this.loadMoreView)
      this.loadMoreView.style.display = 'none'
    }

    this.bscroll = new BScroll(this.node, {
      scrollX: this.style.scrollDirection === 'horizontal',
      scrollY: this.style.scrollDirection !== 'horizontal',
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
      this.onLoadMore && this.onLoadMore(1)
    })

    // 下来加载更多
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

  /**
   * 瀑布流布局
   */
  private refreshWaterfallView(count: number) {
    this.wrapper.removeAll()

    // 添加refresh view
    if (this.refreshView) {
      this.wrapper.appendChild(this.refreshView)
      this.refreshView.node.classList.add('hm-list-refresh-view')
      this.refreshView.style.display = 'none'
    }

    const cellClientwidth = this.style.width
      ? +Hummer.env.availableWidth.replace('dp', '')
      : +`${this.style.width}`.replace('dp', '')
    let types = Array.from(new Array(count)).map((value, index) =>
      this.onRegister(index)
    )
    const column = this.style.column || 2

    // 添加data row
    types.forEach((type, index) => {
      const cell: View = this.onCreate(type)
      this.onUpdate(index, cell)

      const col = new View()
      col.node.classList.add('hm-list-column')
      col.node.classList.add('hm-list-column-waterfall')
      col.appendChild(cell)

      this._waterfalls.push(cell)

      cell.node.classList.add('cell')

      // @ts-ignore
      let row: View = null

      if (index % column === 0) {
        row = new View()
        row.node.classList.add('hm-list-row')
        //如果是水平滚动
        if (this.style.scrollDirection === 'horizontal') {
          row.style.width = this.style.width
        }
        this._gridRows.push(row)
      } else {
        row = this._gridRows[Math.floor(index / column)]
        if (this.style.itemSpacing) {
          col.style.marginLeft = `${this.style.itemSpacing}`
        }
      }
      col.style.width = cellClientwidth + 'dp'
      row.appendChild(col)

      this.wrapper.appendChild(row)
    })

    // 添加 loadmore view
    if (this.loadMoreView) {
      this.wrapper.appendChild(this.loadMoreView)
      this.loadMoreView.node.classList.add('hm-list-loadMore-view')
      this.loadMoreView.style.display = 'none'
    }

    this.bscroll = new BScroll(this.node, {
      scrollX: this.style.scrollDirection === 'horizontal',
      scrollY: this.style.scrollDirection !== 'horizontal',
      pullUpLoad: true,
      pullDownRefresh: true,
      click: true,
      dblclick: true,
      tap: true,
      probeType: 3
    })

    // 重新绘制瀑布流
    window.addEventListener('render-ready', () => {
      const cols = document.getElementsByClassName('hm-list-column-waterfall')
      // @ts-ignore
      const parentOffsetTop = cols[0].parentElement.getBoundingClientRect().top
      // @ts-ignore
      const parentOffsetLeft = cols[0].parentElement.getBoundingClientRect()
        .left

      const column = this.style.column || 2
      let colsArr = new Array(column)
      const posArr = []

      for (let index = 0; index < cols.length; index++) {
        let top = 0
        const offset = cols[index].getBoundingClientRect()
        let marginTop = this.style.lineSpacing
          ? +formatUnit(this.style.lineSpacing).replace('px', '')
          : 0
        const height = cols[index].children[0].clientHeight + marginTop
        let minIndex = 0

        if (index < column) {
          colsArr[index] = height
          top = offset.top - parentOffsetTop
          minIndex = index % column
        } else {
          const min = Math.min.apply(null, colsArr)
          top = min
          minIndex = colsArr.indexOf(min)
          colsArr[minIndex] += height
        }
        const width = cols[index].getBoundingClientRect().width
        posArr.push({
          left: cols[minIndex].getBoundingClientRect().left - parentOffsetLeft,
          top: top,
          width: width
        })
      }
      
      for (let index = 0; index < cols.length; index++) {
        // @ts-ignore
        cols[index]['style'].position = 'absolute'
        // @ts-ignore
        cols[index]['style'].top = posArr[index]['top'] + 'px'
        // @ts-ignore
        cols[index]['style'].left = posArr[index]['left'] + 'px'
        // @ts-ignore
        cols[index]['style'].width = posArr[index]['width'] + 'px'
        // @ts-ignore
        cols[index]['style'].marginLeft = '0px'
        // @ts-ignore
        cols[index].parentNode['style'].position = 'static'
        // @ts-ignore
        cols[index].parentNode['style'].height =
          Math.max.apply(null, colsArr) + 'px'
      }
      // @ts-ignore
      cols[0].parentElement.parentElement.style.height =
        Math.max.apply(null, colsArr) + 'px'
      // @ts-ignore
      cols[0].parentElement.parentElement.style.width = '100%'

      this.bscroll.refresh()
    })

    // 上拉刷新
    this.bscroll.on('pullingUp', () => {
      this.loadMoreView && (this.loadMoreView.style.display = 'inline')
      this.onLoadMore && this.onLoadMore(1)
    })

    // 下来加载更多
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
}
