import { View, ViewStyle } from './View'
import Swiper from '../../common/swiper'
import { nodeObserver } from '../../common/utils'
import { formatUnit } from '../../common/utils'
export interface ViewPagerStyle extends ViewStyle {
  width?: string | number
  height?: string | number
  itemSpacing?: number
  edgeSpacing?: number
  canLoop?: boolean
  autoPlay?: boolean
  loopInterval?: number,
  borderRadius?: string | number,
  scaleFactor?: number,
  alphaFactor?: number
}

export class ViewPager extends View {
  protected _style: ViewPagerStyle
  _data: Array<any> = []
  itemViews!: Array<View>
  itemViewsArray!: Array<any>
  listeners:{ [key: string]: Array<any> }
  private swiper: any
  private wrapper: Element
  // swiperFrame
  constructor() {
    super()
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('swiper-wrapper')
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
        switch (key) {
          case 'canLoop':
            this.swiper && (this.swiper.params.loop = value, this.swiper.update());
            break
          case 'autoPlay':
            this.swiper && (value ? (this.swiper.params.autoplay = {
              delay: this.style.loopInterval,
              stopOnLastSlide: false,
              disableOnInteraction: false,
            }, this.swiper.update(), this.swiper.autoplay.start()) : this.swiper.autoplay.running && this.swiper.autoplay.stop());
            break
          case 'loopInterval':
            this.swiper && this.style.autoPlay && (this.swiper.params.autoplay = {
              delay: value,
              stopOnLastSlide: false,
              disableOnInteraction: false,
            }, this.swiper.update())
            break
          default:
            this.node.style[key] = formatUnit(value)
        }
        return true
      }
    })
    this._data = new Proxy(this._data, {
      get: (target, key) => {
        return Reflect.get(target, key);
      },
      set: (target, key, value) => {
        Reflect.set(target, key, value);
        this.removeAll()
        if (this.listeners['onItemView'] && this.listeners['onItemView'].length > 0) {
          this.listeners['onItemView'].forEach(listener => {
            this.wrapper.innerHTML = ''
            for (let index = 0; index < this._data.length; index++) {
              // @ts-ignore
              let element: View = listener(index, this._data[index]) || false
              this._data[index] && (this._data[index] = element)
              if (element) {
                element.node.classList.add('swiper-slide')
                element.node.style.width = `calc(100% - ${this.style.edgeSpacing * 2}px)`
                this.wrapper.appendChild(element.node)
              }
            }
          })
          this.node.appendChild(this.wrapper)
          this.init();
        }
        return true;
      }
    })
    nodeObserver(this.node, () => {
      if (this.node.offsetWidth) {
        this.init();
      }
    })
  }

  init() {
    let that = this;
    let translateX = (this.node.offsetWidth - this.style.edgeSpacing * 2) * (this.style.scaleFactor || 0.85) + (this.node.offsetWidth - this.style.edgeSpacing * 2) * ((1 - (this.style.scaleFactor || 0.85)) / 2) + this.style.itemSpacing;
    let transitionFlag = false;
    if (this.swiper) {
      this.swiper.destroy();
    }
    this.swiper = new Swiper(this.node, {
      loop: this.style.canLoop, // 是否可以无限循环
      autoplay: this.style.autoPlay ? {
        delay: this.style.loopInterval,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      } : false,
      watchSlidesProgress : true,
      spaceBetween: this.style.itemSpacing as number,
      centeredSlides: true,
      loopedSlides: 2,
      slidesPerView: "auto",
      effect: "creative",
      observer: true,
      creativeEffect: {
        limitProgress: 2,
        prev: {
          translate: [-translateX, 0, 0],
          scale: this.style.scaleFactor || 0.85,
          opacity: this.style.alphaFactor || 0.5
        },
        next: {
          translate: [translateX, 0, 0],
          scale: this.style.scaleFactor || 0.85,
          opacity: this.style.alphaFactor || 0.5
        }
      },
      on: {
        slideChange: function (swiper) {
          if (that.listeners['onPageChange'] && that.listeners['onPageChange'].length > 0) {
            that.listeners['onPageChange'].forEach(listener => listener(this.realIndex, that.data.length))
          }
        },
        tap: function (swiper, event) {
          if (that.listeners['onItemClick'] && that.listeners['onItemClick'].length > 0) {
            that.listeners['onItemClick'].forEach(listener => listener(this.realIndex))
          }
        },
        transitionStart: function (swiper) {
          if (that.listeners['onPageScrollStateChange'] && that.listeners['onPageScrollStateChange'].length > 0) {
            that.listeners['onPageScrollStateChange'].forEach(listener => listener(2))
          }
        },
        transitionEnd: function (swiper) {
          if (that.listeners['onPageScrollStateChange'] && that.listeners['onPageScrollStateChange'].length > 0) {
            that.listeners['onPageScrollStateChange'].forEach(listener => listener(0))
          }
          transitionFlag = false;
        },
        sliderMove: function(swiper,event){
          if(!transitionFlag){
            transitionFlag = true;
            if (that.listeners['onPageScrollStateChange'] && that.listeners['onPageScrollStateChange'].length > 0) {
              that.listeners['onPageScrollStateChange'].forEach(listener => listener(1))
            }
          }
        }, 
      },
    })
  }

  // swiperRuning(){
  //   if(this.swiper) {
  //     console.log(this.swiper.getTranslate(),this.swiper.realIndex)
  //     this.swiperFrame = window.requestAnimationFrame(this.swiperRuning.bind(this))
  //   }
  // }
  protected createNode() {
    this.node = document.createElement('div')
  }

  get style() {
    return this._style
  }

  set style(_style: ViewPagerStyle) {
    this._style = Object.assign(this._style, _style)
  }
  get data() {
    return this._data
  }
  set data(_data: Array<any>) {
    this._data.length = _data.length
  }

  // onPageChange!: (current: number, total: number) => void

  // onItemClick!: (position: number) => void

  // onItemView!: (position: number, view: View) => View

  // onPageScrollStateChange!: (state: number) => void

  // onPageScroll!: (position: number,percent: number) => void
  onItemView(callback) {
    if (!this.listeners['onItemView']) {
      this.listeners['onItemView'] = []
    }
    this.listeners['onItemView'].push(callback)
  }
  onPageScroll(callback: any) {
    // callback()
    if (!this.listeners['onPageScroll']) {
      this.listeners['onPageScroll'] = []
    }
    this.listeners['onPageScroll'].push(callback)
  }
  onPageScrollStateChange(callback: any) {
    // callback()
    if (!this.listeners['onPageScrollStateChange']) {
      this.listeners['onPageScrollStateChange'] = []
    }
    this.listeners['onPageScrollStateChange'].push(callback)
  }
  onPageChange(callback: any) {
    // callback()
    if (!this.listeners['onPageChange']) {
      this.listeners['onPageChange'] = []
    }
    this.listeners['onPageChange'].push(callback)
  }

  onItemClick(callback: any) {
    // callback()
    if (!this.listeners['onItemClick']) {
      this.listeners['onItemClick'] = []
    }
    this.listeners['onItemClick'].push(callback)
  }

  setCurrentItem(position: number) {
    this.style.canLoop?this.swiper.slideToLoop(position):this.swiper.slideTo(position)
  }

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
