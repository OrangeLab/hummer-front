import BScroll from 'better-scroll'
import { View, ViewStyle } from './View'
import { ScrollEvent, ScrollState } from '../event/ScrollEvent'
import { EventListener } from '../event/Event'
// import { Hummer } from '../../base/Global'
import { formatUnit } from '../../common/utils'
import { nodeObserver } from '../../common/utils'
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
  bounces?: boolean,
}

export class List extends View {
  refreshView!: View
  loadMoreView!: View
  showScrollBar: boolean = false // 滑动时是否显示滚动条
  bounces: boolean = true // 滑动到 边缘时是否有回弹效果
  isMoreData: boolean = true
  protected _style: ListStyle
  protected mode: 'list' | 'grid' | 'waterfall' = 'list'
  private rowCount: number = 0
  private _listRows: View[] = []
  private _gridRows: View[] = []
  private _waterfalls: View[] = []

  private wrapper: View
  private recyclerView: View
  // @ts-ignore
  private bscroll: BScroll

  constructor() {
    super()
    this.wrapper = new View()
    this.wrapper.node.classList.add('hm-list-content')
    this.appendChild(this.wrapper)
    this.recyclerView = new View()
    this.wrapper.appendChild(this.recyclerView)
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
            this.mode = value
            this.bscroll && this.refresh(this.rowCount)
            break
          case 'scrollDirection':
            if (value === 'vertical') {
              this.node.classList.remove('horizontal')
              this.node.classList.add(value)
            } else if (value === 'horizontal') {
              this.node.classList.remove('horizontal')
              this.node.classList.remove('vertical')
            }
            break
          case 'column':
            this.bscroll && this.refresh(this.rowCount)
            break
          case 'lineSpacing':
            this.recyclerView?.node?.childNodes?.forEach((element: Element, index: Number) => {
              if (this.style.scrollDirection === 'horizontal') {
                if (value && index > 0) {
                  // @ts-ignore
                  element.style.marginLeft = formatUnit(value)
                }
              } else {
                // 竖向滚动
                if (value && index > 0) {
                  // @ts-ignore
                  element.style.marginTop = formatUnit(value)
                }
              }
            });
            break
          case 'itemSpacing':
            this.bscroll && this.refresh(this.rowCount)
            break
          case 'bounces':
            if (this.bscroll) {
              this.bscroll.destroy()
              this.bscroll = null
              this.refresh(this.rowCount)
            }
            break
          case 'leftSpacing':
            this.recyclerView.style['paddingLeft'] = formatUnit(value)
            break
          case 'rightSpacing':
            this.recyclerView.style['paddingRight'] = formatUnit(value)
            break
          case 'topSpacing':
            this.recyclerView.style['paddingTop'] = formatUnit(value)
            break
          case 'bottomSpacing':
            this.recyclerView.style['paddingBottom'] = formatUnit(value)
            break
          default:
            this.node.style[key] = formatUnit(value)
            break
        }
        return true
      }
    })
    nodeObserver(this.wrapper.node, () => {
      this.refreshView && (this.refreshView.style = {
        position: 'absolute',
        top: '0',
        left: '0',
        transform: 'translateY(-100%) translateZ(0)',
        width: '100%',
      })
      if (this.bscroll) {
        this.refreshView && this.bscroll.openPullDown({
          stop: this.refreshView.node.offsetHeight
        });
        if (this.mode === 'waterfall' && this.recyclerView.node.offsetHeight) {
          this.computeElement()
        }
        this.bscroll.refresh()
      }
    })
  }

  onDestoryed() {
    this.bscroll.destroy()
  }

  protected defaultStyle() {
    this.node.classList.add('hm-list')
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
  onRefresh!: (state: 0 | 1 | 2 | 3) => void
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
    switch (this.mode) {
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
    this.rowCount = count
  }

  /**
   * 滚动到指定位置
   * @param position 要滚动到的位置
   */
  scrollToPosition(position: number) {
    if (this.bscroll) {
      if (this.mode == 'list') {
        const view = this._listRows[position]
        view && this.bscroll.scrollToElement(view.node)
      } else if (this.mode == 'grid') {
        // 计算行
        const row = Math.floor(position / (this.style.column as any))
        const view = this._gridRows[row]
        view && this.bscroll.scrollToElement(view.node)
      } else if (this.mode == 'waterfall') {
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
      this.bscroll.scrollTo(-x, -y, 300)
    }
  }

  /**
   * 滚动一定位置
   */
  scrollBy(dx: number, dy: number) {
    if (this.bscroll) {
      this.bscroll.scrollBy(dx, dy, 300)
    }
  }

  /**
   * 结束下拉刷新
   */
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

  /**
   * 设置上拉加载控件
   * @param enable 下次能否继续触发加载更多
   */
  stopLoadMore(enable?: boolean) {
    if (this.bscroll) {
      if (!enable) {
        this.isMoreData = false
        this.loadMoreView.style = {
          position: 'absolute',
          bottom: 0,
          left: 0,
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
    // 添加data row
    let types = []
    if ((count - this.rowCount) >= 0) {
      types = Array.from(new Array(Math.abs(count - this.rowCount))).map((value, index) => {
        if (this.onRegister) {
          return this.onRegister(index)
        } else {
          return 1;
        }
      })
    } else {
      this._listRows = []
      this.wrapper.removeChild(this.recyclerView)
      this.recyclerView.removeAll()
      this.loadMoreView ? this.wrapper.insertBefore(this.recyclerView, this.loadMoreView) : this.wrapper.appendChild(this.recyclerView);
      types = Array.from(new Array(count)).map((value, index) => {
        if (this.onRegister) {
          return this.onRegister(index)
        } else {
          return 1;
        }
      })
    }
    types.forEach((type, index) => {
      const cell: View = this.onCreate(type)
      this.onUpdate((count - this.rowCount) >= 0 ? (index + this.rowCount) : index, cell)
      const row = new View()
      if (this.style.lineSpacing) {
        if (index > 0) {
          if (this.style.scrollDirection === 'horizontal') {
            row.node.style.marginLeft = formatUnit(this.style.lineSpacing)
          } else {
            row.node.style.marginTop = formatUnit(this.style.lineSpacing)
          }
        }
      }
      //如果是水平滚动
      if (this.style.scrollDirection === 'horizontal') {
        this.recyclerView.node.classList.add('horizontal')
        this.wrapper.node.classList.add('hm-list-content-horizontal')
        this.node.style.width = '100%'
      }
      row.appendChild(cell)
      this.recyclerView.appendChild(row)
      this._listRows.push(row)
    })
    this.bscrollInit()
  }

  /**
   * hm-list
   *   hm-list-row
   *     hm-list-cell
   * @param {number} count
   */
  private refreshGridView(count: number) {
    this.wrapper.removeAll()
    this.recyclerView.removeAll()
    this.wrapper.appendChild(this.recyclerView)
    let types = Array.from(new Array(count)).map((value, index) => {
      if (this.onRegister) {
        return this.onRegister(index)
      } else {
        return 1;
      }
    })
    this._gridRows = [];
    const column = this.style.column || 2
    // 添加data row
    types.forEach((type, index) => {
      const cell: View = this.onCreate(type)
      this.onUpdate(index, cell)
      const col = new View()
      col.node.classList.add('hm-list-column')
      col.node.classList.add('hm-list-column-grid')
      col.style.width = `calc(${100 / column}% - ${parseFloat(formatUnit(this.style.itemSpacing || 0)) * (column - 1) / column}px)`;
      col.appendChild(cell)
      // @ts-ignore
      let row: View = null
      if (index % column === 0) {
        row = new View()
        row.node.classList.add('hm-list-row')
        if (this.style.lineSpacing && index > 0) {
          row.style.marginTop = `${this.style.lineSpacing}`
        }
        this._gridRows.push(row)
        row.appendChild(col)
        this.recyclerView.appendChild(row)
      } else {
        row = this._gridRows[Math.floor(index / column)]
        if (this.style.itemSpacing) {
          col.style.marginLeft = formatUnit(this.style.itemSpacing)
        }
        row.appendChild(col)
      }
    })
    this.bscrollInit()
  }

  /**
   * 瀑布流布局
   */
  private refreshWaterfallView(count: number) {
    this.wrapper.removeAll()
    this.recyclerView.removeAll()
    this.wrapper.appendChild(this.recyclerView)
    this._waterfalls = []
    this._gridRows = []
    let types = Array.from(new Array(count)).map((value, index) => {
      if (this.onRegister) {
        return this.onRegister(index)
      } else {
        return 1;
      }
    })
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
        this._gridRows.push(row)
        row.appendChild(col)
        this.recyclerView.appendChild(row)
      } else {
        row = this._gridRows[Math.floor(index / column)]
        if (this.style.itemSpacing) {
          console.log(this.style.itemSpacing)
          col.style.marginLeft = formatUnit(this.style.itemSpacing)
        }
        row.appendChild(col)
      }
    })
    this.bscrollInit()
  }
  // 计算绘制瀑布流
  computeElement() {
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
      const width = cols[minIndex].getBoundingClientRect().width
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
      // cols[index].parentNode['style'].position = 'static'
      index > column && (cols[index].parentNode['style'].marginTop = (-Math.max.apply(null, colsArr)) + 'px')
      // @ts-ignore
      cols[index].parentNode['style'].height =
        Math.max.apply(null, colsArr) + 'px'
    }
    // @ts-ignore
    // cols[0].parentElement.parentElement.style.height =
    //   Math.max.apply(null, colsArr) + 'px'
    // @ts-ignore
    cols[0].parentElement.parentElement.style.width = '100%'
    // this.bscroll.refresh()
  }
  private bscrollInit() {
    // 添加refresh view
    if (this.refreshView) {
      this.wrapper.node.insertBefore(this.refreshView.node, this.wrapper.node.children[0])
    }
    // 添加 loadmore view
    if (this.loadMoreView) {
      this.wrapper.node.appendChild(this.loadMoreView.node)
    }
    if (!this.bscroll) {
      this.bscroll = new BScroll(this.node, {
        bounce: this.bounces,
        stopPropagation: true,
        disableMouse: false,
        disableTouch: false,
        scrollX: this.style.scrollDirection === 'horizontal',
        scrollY: this.style.scrollDirection !== 'horizontal',
        pullUpLoad: this.loadMoreView ? true : false,
        pullDownRefresh: this.refreshView ? true : false,
        click: true,
        dblclick: true,
        tap: 'tap',
        probeType: 3,
        eventPassthrough: this.style.scrollDirection === 'horizontal' ? 'vertical' : 'horizontal',
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
          if (e.y > 0 && e.y < this.bscroll?.plugins?.pullDownRefresh?.options?.threshold) {
            if (pullflag === 'none') {
              this.onRefresh && this.onRefresh(1)
            }
            pullflag = 'center'
          } else if (e.y <= 0) {
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
}
