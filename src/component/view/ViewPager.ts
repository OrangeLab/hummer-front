import { View, ViewStyle } from './View'
import Swiper from '../../common/swiper'
import { nodeObserver } from '../../common/utils'
import { styleTransformer } from '../../common/style'
import Tween from "@tweenjs/tween.js"
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
  listeners: { [key: string]: Array<any> }
  private swiper: any
  private observe: any
  private wrapper: Element
  private activeProgress: number
  private endProgress: number
  private tween: any
  private swipeDirection: any
  // swiperFrame
  constructor() {
    super()
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('swiper-wrapper')
    this.node.appendChild(this.wrapper)
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
            this.node.style[key] = value
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
          if (this.node.offsetWidth) {
            this.init();
          }
        }
        return true;
      }
    })
    this.observe = nodeObserver(this.node, () => {
      if (this.node.offsetWidth) {
        this.init();
        this.observe.unobserve(this.node);
      }
    })
  }

  init() {
    let initSuccess = false
    let that = this;
    let translateX = (this.node.offsetWidth - this.style.edgeSpacing * 2) * (this.style.scaleFactor || 0.85) + (this.node.offsetWidth - this.style.edgeSpacing * 2) * ((1 - (this.style.scaleFactor || 0.85)) / 2) + this.style.itemSpacing;
    let transitionFlag = false;
    this.swiper = new Swiper(this.node, {
      loop: this.style.canLoop, // 是否可以无限循环
      autoplay: this.style.autoPlay ? {
        delay: this.style.loopInterval,
        stopOnLastSlide: false,
        disableOnInteraction: false,
      } : false,
      observer: true,
      observeParents: true,
      watchSlidesProgress: true,
      spaceBetween: this.style.itemSpacing as number,
      centeredSlides: true,
      mousewheel: true,
      loopedSlides: 2,
      slidesPerView: "auto",
      effect: "creative",
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
          if (initSuccess) {
            if (that.listeners['onPageChange'] && that.listeners['onPageChange'].length > 0) {
              that.listeners['onPageChange'].forEach(listener => listener(this.realIndex, that.data.length))
            }
          }
        },
        tap: function (swiper, event) {
          if (that.listeners['onItemClick'] && that.listeners['onItemClick'].length > 0) {
            that.listeners['onItemClick'].forEach(listener => listener(this.realIndex))
          }
        },
        slidePrevTransitionStart: function (swiper) {
          that.swipeDirection = 'prev'
        },
        slideNextTransitionStart: function (swiper) {
          that.swipeDirection = 'next'
        },
        transitionStart: function (swiper) {
          if (initSuccess) {
            if (that.listeners['onPageScrollStateChange'] && that.listeners['onPageScrollStateChange'].length > 0) {
              that.listeners['onPageScrollStateChange'].forEach(listener => listener(2))
            }
            let previousIndex = parseInt(swiper?.slides[swiper.previousIndex]?.dataset?.swiperSlideIndex)
            swiper.realIndex === previousIndex && (that.swipeDirection = 'invariant')
            that.tween = new Tween.Tween({
              number: transitionFlag ? that.activeProgress : previousIndex
            }).to({
              number: that.endProgress >= 1 ? that.endProgress : (that.swipeDirection === 'next' ? Math.ceil(that.activeProgress) : Math.floor(that.activeProgress))
            }, 300).onUpdate(tween => {
              let progress
              if (tween.number >= 1) {
                progress = tween.number - Math.floor(tween.number)
              } else {
                progress = tween.number
              }
              if (that.listeners['onPageScroll'] && that.listeners['onPageScroll'].length > 0) {
                that.listeners['onPageScroll'].forEach(listener => listener(swiper.realIndex, progress))
              }
            }).start();
            function animate() {
              if (Tween.update()) {
                requestAnimationFrame(animate);
              }
            }
            animate()
          }
        },
        transitionEnd: function (swiper) {
          if (initSuccess) {
            if (that.listeners['onPageScrollStateChange'] && that.listeners['onPageScrollStateChange'].length > 0) {
              that.listeners['onPageScrollStateChange'].forEach(listener => listener(0))
            }
            transitionFlag = false;
          }
        },
        sliderMove: function (swiper, event) {
          if (initSuccess) {
            that.tween && Tween.remove(that.tween);
            if (!transitionFlag) {
              transitionFlag = true;
              if (that.listeners['onPageScrollStateChange'] && that.listeners['onPageScrollStateChange'].length > 0) {
                that.listeners['onPageScrollStateChange'].forEach(listener => listener(1))
              }
            }
          }
        },
        touchEnd: function (swiper, event) {
          if (initSuccess) {
            let activeProgress
            if (swiper.slides[swiper.activeIndex].progress >= 0) {
              activeProgress = swiper.slides[swiper.activeIndex].progress
            } else {
              activeProgress = 1 + swiper.slides[swiper.activeIndex].progress
            }
            activeProgress !== 0 && (that.activeProgress = activeProgress)
          }
        },
        progress: function (swiper, progress) {
          if (initSuccess) {
            let activeProgress
            if (swiper.slides.length <= 0) {
              return;
            }
            if (swiper.slides[swiper.activeIndex].progress >= 0) {
              activeProgress = swiper.slides[swiper.activeIndex].progress
            } else {
              activeProgress = 1 + swiper.slides[swiper.activeIndex].progress
            }
            if (!/^-?\d+$/.test(activeProgress)) {
              if (that.listeners['onPageScroll'] && that.listeners['onPageScroll'].length > 0) {
                that.listeners['onPageScroll'].forEach(listener => listener(swiper.realIndex, activeProgress))
              }
            }
            that.endProgress = activeProgress
          }
        },
      },
    })
    initSuccess = true
  }

  protected createNode() {
    this.node = document.createElement('div')
  }

  get style() {
    return this._style
  }

  set style(_style: ViewPagerStyle) {
    let standardStyle = styleTransformer.transformStyle(_style);
    this._style = Object.assign(this._style, standardStyle)
  }
  get data() {
    return this._data
  }
  set data(_data: Array<any>) {
    this._data.length = _data.length
  }

  onItemView(callback) {
    if (!this.listeners['onItemView']) {
      this.listeners['onItemView'] = []
    }
    this.listeners['onItemView'].push(callback)
  }
  onPageScroll(callback: any) {
    if (!this.listeners['onPageScroll']) {
      this.listeners['onPageScroll'] = []
    }
    this.listeners['onPageScroll'].push(callback)
  }
  onPageScrollStateChange(callback: any) {
    if (!this.listeners['onPageScrollStateChange']) {
      this.listeners['onPageScrollStateChange'] = []
    }
    this.listeners['onPageScrollStateChange'].push(callback)
  }
  onPageChange(callback: any) {
    if (!this.listeners['onPageChange']) {
      this.listeners['onPageChange'] = []
    }
    this.listeners['onPageChange'].push(callback)
  }

  onItemClick(callback: any) {
    if (!this.listeners['onItemClick']) {
      this.listeners['onItemClick'] = []
    }
    this.listeners['onItemClick'].push(callback)
  }

  setCurrentItem(position: number) {
    this.style.canLoop ? this.swiper.slideToLoop(position) : this.swiper.slideTo(position)
  }
}
