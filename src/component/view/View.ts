import Hammer from 'hammerjs'
import { EventListener } from '../event/Event'
import { InputEvent, InputState } from '../event/InputEvent'
import { PanEvent, PanState } from '../event/PanEvent'
import { PinchEvent, PinchState } from '../event/PinchEvent'
import { SwipeEvent, SwipeState } from '../event/SwipeEvent'
import { TapEvent, TapState } from '../event/TapEvent'
import { TouchEvent, TouchState } from '../event/TouchEvent'
import { LongPressEvent, LongPressState } from '../event/LongPressEvent'
import { ScrollEvent } from '../event/ScrollEvent'
import { BasicAnimation } from '../BasicAnimation'
import { KeyframeAnimation } from '../KeyframeAnimation'
import { formatUnit, getQueryVariable } from '../../common/utils'
import { isNeedUnitTrasform } from '../../common/style/transformer/unit'
import { styleTransformer } from '../../common/style'
export const SIZE_STYLE: Array<any> = [
  'top',
  'left',
  'bottom',
  'right',
  'margin',
  'marginTop',
  'marginLeft',
  'marginBottom',
  'marginRight',
  'padding',
  'paddingTop',
  'paddingLeft',
  'paddingBottom',
  'paddingRight',
  'width',
  'height',
  'minWidth',
  'minHeight',
  'maxWidth',
  'maxHeight',
  'borderRadius',
  'borderWidth'
]
export interface ViewStyle {
  top?: string | number
  left?: string | number
  bottom?: string | number
  right?: string | number
  margin?: string | number
  marginTop?: string | number
  marginLeft?: string | number
  marginBottom?: string | number
  marginRight?: string | number
  padding?: string | number
  paddingTop?: string | number
  paddingLeft?: string | number
  paddingBottom?: string | number
  paddingRight?: string | number
  width?: string | number
  height?: string | number
  minWidth?: string | number
  minHeight?: string | number
  maxWidth?: string | number
  maxHeight?: string | number
  flexDirection?: 'row' | 'column'
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  justifyContent?:
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'space-evenly'
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  alignContent?:
  | 'flex-start'
  | 'flex-end'
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'stretch'
  order?: number
  flexGrow?: number
  flexShrink?: number
  flexBasis?: string
  alignSelf?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky' | 'static' | 'inherit'
  backgroundColor?: string
  backgroundImage?: string
  opacity?: number
  visibility?: 'hidden' | 'visible'
  display?: 'none' | 'flex' | 'block' | 'inline' | 'inline-block  '
  borderColor?: string
  borderLeftColor?: string
  borderTopColor?: string
  borderRightColor?: string
  borderBottomColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderLeftStyle?: 'solid' | 'dashed' | 'dotted'
  borderTopStyle?: 'solid' | 'dashed' | 'dotted'
  borderRightStyle?: 'solid' | 'dashed' | 'dotted'
  borderBottomStyle?: 'solid' | 'dashed' | 'dotted'
  borderWidth?: string | number
  borderLeftWidth?: string | number
  borderTopWidth?: string | number
  borderRightWidth?: string | number
  borderBottomWidth?: string | number
  borderRadius?: string | number
  borderTopLeftRadius?: string | number
  borderTopRightRadius?: string | number
  borderBottomLeftRadius?: string | number
  borderBottomRightRadius?: string | number
  shadow?: string
  overflow?: 'hidden' | 'visible'
  zIndex?: number,
  transform?: string,
  transitionDelay?: string | number,
  transitionProperty?: string,
  transitionDuration?: string | number,
  transitionTimingFunction?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'

}

export type EventType =
  | 'longPress'
  | 'pan'
  | 'pinch'
  | 'swipe'
  | 'tap'
  | 'touch'
  | 'touchDown'
  | 'input'
  | 'scroll'
  | 'switch'

export class View {
  // 公共属性
  public node:
    | HTMLElement
    | HTMLImageElement
    | HTMLButtonElement
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSpanElement
    | any

  public hmNode?: any
  public basicAnimationArray: Array<any> = []
  // 子类可访问属性
  protected _enabled: boolean // 是否响应交互
  protected subViews: Set<View>
  protected _style: ViewStyle
  protected listeners: { [key: string]: Array<EventListener> }
  protected eventListeners: {
    [key: string]: { hammer?: any; listener?: Function;[key: string]: any }
  }
  protected animations: { [key: string]: Animation }
  protected onCreate?: Function // 页面首次加载时触发
  protected onAppear?: Function // 页面显示
  protected onDisappear?: Function // 页面隐藏
  protected onDestroy?: Function // 页面销毁
  protected onBack?: Function // 页面返回
  isHighlight?: Boolean

  layout!: () => void

  constructor(public viewID?: string) {
    let backgroundUrl
    let urlReg = /url\("?'?.((?!\,).)*"?'?\)/g
    let ColorReg = /linear-gradient\([^(]*(\([^)]*\)[^(]*)*[^)]*\)/g
    this.createNode()
    this._enabled = true
    this.subViews = new Set<View>()
    this.listeners = {}
    this.eventListeners = {}
    this.animations = {}
    this._style = new Proxy(
      {},
      {
        get: (target, key) => {
          return target[key] || this.node.style[key]
        },
        set: (target, key, value) => {
          switch (key) {
            case 'flexShrink':
              if(value === 1){
                this.node.style['overflow'] = 'hidden'
              }
              this.node.style[key] = value
              break;
            case 'backgroundColor':
              backgroundUrl = this.node.style['backgroundImage'].match(urlReg)?.[0] || 'none'
              this.node.style['backgroundImage'] = backgroundUrl
              this.node.style[key] = value
              break;
            case 'backgroundImage':
              let newBackgroundUrl = value.match(urlReg)
              let newBackgroundColor = value.match(ColorReg)
              let backgroundColor = this.node.style['backgroundImage'].match(ColorReg)
              backgroundUrl = this.node.style['backgroundImage'].match(urlReg)
              if (backgroundUrl && newBackgroundUrl) {
                this.node.style['backgroundImage'].replaceAll(urlReg, newBackgroundUrl[0])
              }
              if (newBackgroundColor && backgroundColor) {
                this.node.style['backgroundImage'].replaceAll(ColorReg, newBackgroundColor[0])
              }
              if (!backgroundUrl && !backgroundColor) {
                this.node.style['backgroundImage'] = value
              } else {
                this.node.style['backgroundImage'] = `${this.node.style['backgroundImage']},${value}`
              }
              break;
            default:
              this.node.style[key] = value
              break;
          }
          return true
        }
      }
    )
    this.defaultStyle()
    this.initialize()
    window.addEventListener('render-ready', () => {
      // this.formatBasicAnimation()
      this?.onCreate && this.onCreate()
      this?.onAppear && this.onAppear()
      if (this?.onAppear || this?.onDisappear) {
        document.addEventListener("visibilitychange", this.visibilityChange.bind(this));
      }
      if (this?.onBack) {
        if (window.history && window.history.pushState) {
          history.pushState(null, null, document.URL);
          window.addEventListener('popstate', this.interceptBack.bind(this), false);
        }
      }
      if (this?.onCreate && getQueryVariable('navBar') && this.node.parentNode.tagName === 'BODY') {
        let navBar = new View
        let navBarTitle = new View
        let navBarBack = new View
        navBar.node.className = 'hm-default-navbar'
        navBarTitle.node.className = 'hm-default-nav-title'
        navBarBack.node.className = 'hm-default-nav-back'
        navBar.node.onclick = () => {
          history.go(-1);
        }
        navBarTitle.node.innerHTML = window.location.pathname.split('/')[1]
        if (document.referrer !== '') {
          navBar.appendChild(navBarBack)
        }
        navBar.appendChild(navBarTitle)
        this.node.childNodes[0].style.flex = 1
        this.node.insertBefore(navBar.node, this.node.childNodes[0])
      }
    })
  }
  visibilityChange() {
    if (document.visibilityState === 'visible') {
      this.onAppear()
    } else {
      this.onDisappear()
    }
  }
  interceptBack() {
    console.log('123123');
    let isIntercept = this?.onBack()
    if (isIntercept) {
      history.pushState(null, null, document.URL);
    } else {
      this._onDestoryed();
      history.go(-1);
    }
  }
  //   /**
  //    * 页面首次加载时触发
  //    */
  //   onCreate() { }
  //   /**
  //   * 页面显示周期
  //   */
  //   onAppear() { }
  //   /**
  //    * 页面隐藏
  //    */
  //   onDisappear() { }
  //   /**
  //   * 页面销毁
  //   */
  //   onDestroy() { }
  //   /**
  //  * 页面返回
  //  */
  //   onBack() { }
  private playBasicAnimation(animation) {
    const {
      keyframes,
      options
    } = this.getBasicAnimationKeyFrameAnimationOptions(animation)
    const animate: Animation = this.node.animate(keyframes, options)
    // this.animations[key] = animate
    animation.onstart && animation.onstart()
    animate.onfinish = () => {
      this.basicAnimationArray.shift()
      animation.onend && animation.onend()
      if (this.basicAnimationArray.length >= 1) {
        this.playBasicAnimation(this.basicAnimationArray[this.basicAnimationArray.length - 1])
      }
    }
    animate.play()
  }

  private formatBasicAnimation() {
    let newBasicAnimationArray: Array<Array<any>> = []
    let numSize = -1
    let oldKeyNum
    this.basicAnimationArray.forEach(item => {
      let keyNum = parseInt(Object.keys(item)[0].split('_')[Object.keys(item)[0].split('_').length - 2]);
      if (oldKeyNum !== keyNum) {
        numSize++
      }
      oldKeyNum = keyNum
      !newBasicAnimationArray[numSize] && (newBasicAnimationArray[numSize] = [])
      newBasicAnimationArray[numSize].push(item[Object.keys(item)[0]])
    });
    this.basicAnimationArray = newBasicAnimationArray
    if (this.basicAnimationArray.length > 0) {
      this.playBasicAnimation(this.basicAnimationArray[0])
    }
  }

  protected defaultStyle() {
    this.node.classList.add('hm-default-view')
  }

  protected createNode() {
    this.node = document.createElement('view')
  }

  get enabled() {
    return this._enabled
  }

  set enabled(_enabled: boolean) {
    this._enabled = _enabled
    if (!_enabled) {
      this.node.disabled = true
    } else {
      this.node.disabled = false
    }
  }

  get style() {
    return this._style
  }

  set style(_style: ViewStyle) {
    let deepStyle = JSON.parse(JSON.stringify(_style))
    let standardStyle = styleTransformer.transformStyle(deepStyle)
    this._style = Object.assign(this._style, standardStyle)
  }

  /**
   * 初始化生命周期函数，目前在前端SDK上没用，兼容端的代码
   */
  initialize() { }

  /**
   * 销毁时机
   */
  finalize() { }

  // Mounted 生命周期
  // @ts-ignore
  private _onMounted() {
    this.onMounted();
  }

  protected onMounted() {

  }
  // @ts-ignore
  private _onDestoryed() {
    this.onDestoryed();
    this?.onDestroy && this.onDestroy();
    this?.onAppear && document.removeEventListener('visibilityChange', this.visibilityChange.bind(this))
    this?.onBack && window.removeEventListener('popstate', this.visibilityChange.bind(this))
  }

  protected onDestoryed() { }

  appendChild(subview: any) {
    this.node.appendChild(subview.node)
    subview._onMounted();
    // this.subViews.add(subview)
  }

  removeChild(subview: any) {
    subview._onDestoryed();
    this.node.removeChild(subview.node)
    // this.subViews.delete(subview)
  }

  removeAll() {
    this.node.innerHTML = ''
    // this.subViews.clear()
  }

  insertBefore(subview: any, existingView: View) {
    this.node.insertBefore(subview.node, existingView.node)
    subview._onMounted();
    // this.subViews.add(subview)
  }

  /**
   * 用指定的节点替换当前节点的一个子节点，并返回被替换掉的节点
   */
  replaceChild(newSubview: View, oldSubview: View) {
    this.node.replaceChild(newSubview.node, oldSubview.node)
    // this.subViews.add(newSubview)
    // this.subViews.delete(oldSubview)
  }

  getElementById(viewID: string): View {
    for (let view of this.subViews) {
      if (view.viewID === viewID) {
        return view
      }
    }
    // @ts-ignore
    return null
  }

  addEventListener(key: EventType, listener: EventListener) {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    // 将事件callback加入到事件队列
    this.listeners[key].push(listener)
    // 注册事件监听
    if (!this.eventListeners[key]) {
      if (key === 'longPress') {
        const press = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new LongPressEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = LongPressState.BEGAN
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pressup = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new LongPressEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = LongPressState.ENDED
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
        hammer.on('press', press)
        hammer.on('pressup', pressup)
        this.eventListeners[key] = { hammer, press, pressup }
      } else if (key === 'pan') {
        let oldDeltaX = 0, oldDeltaY = 0;
        const panstart = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.BEGAN
          oldDeltaX = e.srcEvent.clientX
          oldDeltaY = e.srcEvent.clientY
          ev.translation = { deltaX: 0, deltaY: 0 }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const panmove = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.CHANGED
          ev.translation = { deltaX: e.srcEvent.clientX - oldDeltaX, deltaY: e.srcEvent.clientY - oldDeltaY }
          oldDeltaX = e.srcEvent.clientX
          oldDeltaY = e.srcEvent.clientY
          this.listeners[key].forEach(listener => listener(ev))
        }
        const panend = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.ENDED
          ev.translation = { deltaX: 0, deltaY: 0 }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pancancel = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.CANCELLED
          ev.translation = { deltaX: 0, deltaY: 0 }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
        hammer.get('pan').set({
          direction: Hammer.DIRECTION_ALL,
          threshold: 0.1
        });
        hammer.on('panstart', panstart)
        hammer.on('panmove', panmove)
        hammer.on('panend', panend)
        hammer.on('pancancel', pancancel)
        this.eventListeners[key] = {
          hammer,
          panstart,
          panmove,
          panend,
          pancancel
        }
      } else if (key === 'pinch') {
        const pinchstart = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.BEGAN
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pinchmove = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.CHANGED
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pinchend = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.ENDED
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pinchcancel = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return

          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.CANCELLED
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
        hammer.get('pinch').set({ enable: true });
        hammer.on('pinchstart', pinchstart)
        hammer.on('pinchmove', pinchmove)
        hammer.on('pinchend', pinchend)
        hammer.on('pinchcancel', pinchcancel)
        this.eventListeners[key] = {
          hammer,
          pinchstart,
          pinchmove,
          pinchend,
          pinchcancel
        }
      } else if (key === 'swipe') {
        const swipeleft = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 2
          this.listeners[key].forEach(listener => listener(ev))
        }
        const swiperight = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 1
          this.listeners[key].forEach(listener => listener(ev))
        }
        const swipeup = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 4
          this.listeners[key].forEach(listener => listener(ev))
        }
        const swipedown = (e: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 8
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
        hammer.get('swipe').set({
          direction: Hammer.DIRECTION_ALL
        });
        hammer.on('swipeleft', swipeleft)
        hammer.on('swiperight', swiperight)
        hammer.on('swipeup', swipeup)
        hammer.on('swipedown', swipedown)
        this.eventListeners[key] = {
          hammer,
          swipeleft,
          swiperight,
          swipeup,
          swipedown
        }
      } else if (key === 'tap') {
        const tap = (event: any) => {
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new TapEvent()
          ev.target = this
          ev.position = {
            x: event.center.x,
            y: event.center.y
          }
          ev.timestamp = event.timeStamp
          ev.state = TapState.BEGAN
          this.listeners[key].forEach(listener => listener(ev))
        }

        const hammer = new Hammer(this.node)
        hammer.on(key, tap)
        this.eventListeners[key] = { hammer, tap }
      } else if (key === 'input') {
        const input = (e: any) => {
          if (!this.enabled) return
          const ev = new InputEvent()
          ev.target = this
          ev.state = InputState.CHANGED
          ev.text = e.target.value
          this.listeners[key].forEach(listener => listener(ev))
        }
        const focus = (e: any) => {
          if (!this.enabled) return

          const ev = new InputEvent()
          ev.target = this
          ev.state = InputState.BEGAN
          ev.text = e.target.value
          this.listeners[key].forEach(listener => listener(ev))
        }
        const blur = (e: any) => {
          if (!this.enabled) return
          const ev = new InputEvent()
          ev.target = this
          ev.state = InputState.ENDED
          ev.text = e.target.value
          this.listeners[key].forEach(listener => listener(ev))
        }
        this.node.addEventListener('input', input)
        this.node.addEventListener('focus', focus)
        this.node.addEventListener('blur', blur)
        this.eventListeners[key] = { input, focus, blur }
      } else if (key === 'scroll') {
        const scroll = () => {
          if (!this.enabled) return
          const ev = new ScrollEvent()
          ev.target = this
          this.listeners[key].forEach(listener => listener(ev))
        }
        this.node.addEventListener(key, scroll)
        this.eventListeners[key] = { scroll }
      } else if (key === 'touch') {
        const touch = (e) => {
          e.stopPropagation && e.stopPropagation();
          e.preventDefault && e.preventDefault();
          if (!this.enabled) return
          if ((window as any).openElementMap) return
          const ev = new TouchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.position = {
            x: e.targetTouches[0]?.clientX - e.target?.getBoundingClientRect().left,
            y: e.targetTouches[0]?.clientY - e.target?.getBoundingClientRect().top,
          }
          switch (e.type) {
            case 'touchstart':
              ev.state = TouchState.BEGAN
              break;
            case 'touchmove':
              ev.state = TouchState.CHANGED
              break;
            case 'touchend':
              ev.position = {
                x: e.changedTouches[0]?.clientX - e.target?.getBoundingClientRect().left,
                y: e.changedTouches[0]?.clientY - e.target?.getBoundingClientRect().top,
              }
              ev.state = TouchState.ENDED
              break;
            case 'touchcancel':
              ev.state = TouchState.CANCELLED
              break;
          }
          this.listeners[key].forEach(listener => listener(ev))
        }
        this.node.addEventListener('touchstart', touch, false)
        this.node.addEventListener('touchmove', touch, false)
        this.node.addEventListener('touchend', touch, false)
        this.node.addEventListener('touchcancel', touch, false)
        this.eventListeners[key] = { touch }
      }
    }
  }

  removeEventListener(key: EventType, listener: EventListener) {
    if (this.listeners[key]) {
      // 将事件从事件队列中删除
      this.listeners[key] = this.listeners[key].filter(
        _listener => _listener !== listener
      )
      // 如果事件队列为空，取消事件监听
      if (this.listeners[key].length === 0) {
        if (key === 'longPress') {
          const { hammer, press, pressup } = this.eventListeners[key]
          hammer.off('press', press)
          hammer.off('pressup', pressup)
        } else if (key === 'pan') {
          const {
            hammer,
            panstart,
            panmove,
            panend,
            pancancel
          } = this.eventListeners[key]
          hammer.off('panstart', panstart)
          hammer.off('panmove', panmove)
          hammer.off('panend', panend)
          hammer.off('pancancel', pancancel)
        } else if (key === 'pinch') {
          const {
            hammer,
            pinchstart,
            pinchmove,
            pinchend,
            pinchcancel
          } = this.eventListeners[key]
          hammer.off('pinchstart', pinchstart)
          hammer.off('pinchmove', pinchmove)
          hammer.off('pinchend', pinchend)
          hammer.off('pinchcancel', pinchcancel)
        } else if (key === 'swipe') {
          const {
            hammer,
            swipeleft,
            swiperight,
            swipeup,
            swipedown
          } = this.eventListeners[key]
          hammer.off('swipeleft', swipeleft)
          hammer.off('swiperight', swiperight)
          hammer.off('swipeup', swipeup)
          hammer.off('swipedown', swipedown)
        } else if (key === 'tap') {
          const { hammer, tap } = this.eventListeners[key]
          hammer.off('tap', tap)
        } else if (key === 'input') {
          const { input, focus, blur } = this.eventListeners[key]
          this.node.removeEventListener('input', input)
          this.node.removeEventListener('focus', focus)
          this.node.removeEventListener('blur', blur)
        } else if (key === 'scroll') {
          const { scroll } = this.eventListeners[key]
          this.node.removeEventListener('scroll', scroll)
        } else if (key === 'touch') {
          const { touch } = this.eventListeners[key]
          this.node.removeEventListener('touchstart', touch, false)
          this.node.removeEventListener('touchmove', touch, false)
          this.node.removeEventListener('touchend', touch, false)
          this.node.removeEventListener('touchcancel', touch, false)
        }
        this.eventListeners[key] = void 0
      }
    }
  }

  addAnimation(animation: BasicAnimation | KeyframeAnimation, key: string) {
    if (animation instanceof BasicAnimation) {
      let a = {}
      a[`${key}`] = animation
      this.basicAnimationArray.push(a);
      this.formatBasicAnimation();
    } else if (animation instanceof KeyframeAnimation) {
      // 帧动画
      const { keyframes, options } = this.getKeyframeAnimationOptions(animation)
      const animate: Animation = this.node.animate(keyframes, options)
      this.animations[key] = animate
      animation.onstart && animation.onstart()
      animation.onend && (animate.onfinish = animation.onend as any)
      animate.play()
    }
  }

  // removeAllAnimation() {
  //   for (let key in this.animations) {
  //     const animate: Animation = this.animations[key]
  //     animate.pause()
  //     animate.finish()
  //   }
  //   this.animations = {}
  // }

  // removeAnimationForKey(key: string) {
  //   const animate: Animation = this.animations[key]
  //   if (animate) {
  //     animate.pause()
  //     animate.finish()
  //     // @ts-ignore
  //     this.animations[key] = null
  //   }
  // }

  getRect(callback: Function) {
    let rect = {
      width: this.node.offsetWidth,
      height: this.node.offsetHeight,
      left: this.node.offsetLeft,
      right: this.node.parentNode.offsetWidth - this.node.offsetLeft - this.node.offsetWidth,
      top: this.node.offsetTop,
      bottom: this.node.parentNode.offsetHeight - this.node.offsetTop - this.node.offsetHeight,
      windowLeft: this.node.getBoundingClientRect().left,
      windowRight: this.node.getBoundingClientRect().right,
      windowTop: this.node.getBoundingClientRect().top,
      windowBottom: this.node.getBoundingClientRect().bottom
    }
    callback(rect)
  }

  dbg_highlight(isHighlight: Boolean) {
    !!isHighlight ? this.node.classList.add('hm-high-light') : this.node.classList.remove('hm-high-light')
  }

  resetStyle() { }

  requestViewWidth(callback: Function) { }

  requestViewHeight(callback: Function) { }

  // /**
  //  * @deprecated
  //  */
  // private getTransitionProperties (ani: BasicAnimation) {
  //   return {
  //     [this.convertPath(ani.path)]: this.convertPathValue(ani.path, ani.value),
  //     'transitionProperty': '*',
  //     'transitionDuration': `${ani.duration}ms`,
  //     'transitionTimingFunction': ani.easing,
  //     'transitionDelay': ani.duration
  //   }
  // }

  /**
   * 获取属性动画的原始值(第一帧值)
   */
  private getBasicAnimationDefaultKeyframeAnimationOptions(
    ani: Array<BasicAnimation>
  ) {
    let playKeyframes = {}
    ani.forEach((item) => {
      switch (item.path) {
        case 'position':
        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'rotationX':
        case 'rotationY':
        case 'rotationZ':
          playKeyframes['transform'] = getComputedStyle(this.node)['transform']
          break;
        case 'opacity':
          playKeyframes['opacity'] = getComputedStyle(this.node)['opacity']
          break;
        case 'backgroundColor':
          playKeyframes['backgroundColor'] = getComputedStyle(this.node)['backgroundColor']
          break;
        default:
          // @ts-ignore
          playKeyframes[`${item.path}`] = getComputedStyle(this.node)[`${item.path}`]
          break;
      }
    })
    return playKeyframes
  }

  /**
   * 获取属性动画的结果值(最后一帧值)
   */
  private getBasicAnimationKeyFrameAnimationOptions(ani: Array<BasicAnimation>) {
    let keyframes, endKeyframes = {}
    ani.forEach(item => {
      if (this.convertPath(item.path) === 'transform') {
        if (endKeyframes['transform']) {
          endKeyframes['transform'] = `${this.convertPathValue(item.path, item.value)} ${endKeyframes['transform']}`
        } else {
          endKeyframes['transform'] = this.convertPathValue(item.path, item.value)
        }
      } else {
        endKeyframes[`${this.convertPath(item.path)}`] = this.convertPathValue(item.path, item.value)
      }
      endKeyframes['easing'] = item.easing
    })
    keyframes = [this.getBasicAnimationDefaultKeyframeAnimationOptions(ani), endKeyframes];
    return {
      keyframes: keyframes,
      options: {
        fill: 'forwards',
        easing: ani[0].easing,
        delay: ani[0].delay || 0,
        direction: 'normal',
        duration: ani[0].duration * 1000,
        iterations: ani[0].repeatCount < 0 ? 'Infinity' : (ani[0].repeatCount === 0 || ani[0].repeatCount === 1 ? 1 : ani[0].repeatCount)
      }
    }
  }

  private getKeyframeAnimationOptions(ani: KeyframeAnimation) {
    const keyframes = ani.keyframes.map(item => ({
      [this.convertPath(ani.path)]: this.convertPathValue(ani.path, item.value),
      offset: item.percent,
      easing: item.easing
    }))
    return {
      keyframes,
      options: {
        fill: 'forwards',
        easing: ani.easing,
        delay: ani.delay || 0,
        direction: 'normal',
        duration: ani.duration * 1000,
        iterations: ani.repeatCount < 0 ? 'Infinity' : (ani.repeatCount === 0 || ani.repeatCount === 1 ? 1 : ani.repeatCount)
      }
    }
  }

  private convertPath(path: string) {
    switch (path) {
      case 'position':
      case 'rotationX':
      case 'rotationY':
      case 'rotationZ':
      case 'scale':
      case 'scaleX':
      case 'scaleY':
        return 'transform'
      default:
        return path
    }
  }

  private convertPathValue(path: string, value: any) {
    switch (path) {
      case 'position':
        return `translate(${formatUnit(value.x)},${formatUnit(value.y)})`
      case 'rotationX':
        return `rotate3d(1,0,0,${value}deg)`
      case 'rotationY':
        return `rotate3d(0,1,0,${value}deg)`
      case 'rotationZ':
        return `rotate3d(0,0,1,${value}deg)`
      case 'scale':
        return `scale3d(${value},${value},1)`
      case 'scaleX':
        return `scale3d(${value},1,1)`
      case 'scaleY':
        return `scale3d(1,${value},1)`
      default:
        if (isNeedUnitTrasform(path)) {
          return formatUnit(value)
        }
        return value
    }
  }
}
