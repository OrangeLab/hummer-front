import Hammer from 'hammerjs'
import { EventListener } from '../event/Event'
import { InputEvent, InputState } from '../event/InputEvent'
import { PanEvent, PanState } from '../event/PanEvent'
import { PinchEvent, PinchState } from '../event/PinchEvent'
import { SwipeEvent, SwipeState } from '../event/SwipeEvent'
import { TapEvent, TapState } from '../event/TapEvent'
import { LongPressEvent, LongPressState } from '../event/LongPressEvent'
import { ScrollEvent } from '../event/ScrollEvent'
import { BasicAnimation } from '../BasicAnimation'
import { KeyframeAnimation } from '../KeyframeAnimation'

import {styleTransformer} from '../../common/style'
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

  // 子类可访问属性
  protected _enabled: boolean // 是否响应交互
  protected subViews: Set<View>
  protected _style: ViewStyle
  protected listeners: { [key: string]: Array<EventListener> }
  protected eventListeners: {
    [key: string]: { hammer?: any; listener?: Function; [key: string]: any }
  }
  protected animations: { [key: string]: Animation }
  layout!: () => void

  constructor(public viewID?: string) {
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
          this.node.style[key] = value
          return true
        }
      }
    )
    this.defaultStyle()
    this.initialize()
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
    let standardStyle = styleTransformer.transformStyle(_style);
    this._style = Object.assign(this._style, standardStyle)
  }

  /**
   * 初始化生命周期函数，目前在前端SDK上没用，兼容端的代码
   */
  initialize() {}

  /**
   * 销毁时机
   */
  finalize() {}

  appendChild(subview: any) {
    this.node.appendChild(subview.node)
    // this.subViews.add(subview)
  }

  removeChild(subview: any) {
    this.node.removeChild(subview.node)
    // this.subViews.delete(subview)
  }

  removeAll() {
    this.node.innerHTML = ''
    // this.subViews.clear()
  }

  insertBefore(subview: any, existingView: View) {
    this.node.insertBefore(subview.node, existingView.node)
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
          const ev = new LongPressEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = LongPressState.BEGAN
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pressup = (e: any) => {
          if (!this.enabled) return
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
        const panstart = (e: any) => {
          if (!this.enabled) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.BEGAN
          ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const panmove = (e: any) => {
          if (!this.enabled) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.CHANGED
          ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const panend = (e: any) => {
          if (!this.enabled) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.ENDED
          ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pancancel = (e: any) => {
          if (!this.enabled) return
          const ev = new PanEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PanState.CANCELLED
          ev.translation = { deltaX: e.deltaX + 'dp', deltaY: e.deltaY + 'dp' }
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
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
          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.BEGAN
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pinchmove = (e: any) => {
          if (!this.enabled) return
          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.CHANGED
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pinchend = (e: any) => {
          if (!this.enabled) return
          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.ENDED
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const pinchcancel = (e: any) => {
          if (!this.enabled) return

          const ev = new PinchEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = PinchState.CANCELLED
          ev.scale = e.scale
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
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

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 'left'
          this.listeners[key].forEach(listener => listener(ev))
        }
        const swiperight = (e: any) => {
          if (!this.enabled) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 'right'
          this.listeners[key].forEach(listener => listener(ev))
        }
        const swipeup = (e: any) => {
          if (!this.enabled) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 'up'
          this.listeners[key].forEach(listener => listener(ev))
        }
        const swipedown = (e: any) => {
          if (!this.enabled) return

          const ev = new SwipeEvent()
          ev.target = this
          ev.timestamp = e.timeStamp
          ev.state = SwipeState.BEGAN
          ev.direction = 'down'
          this.listeners[key].forEach(listener => listener(ev))
        }
        const hammer = new Hammer(this.node)
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

          const ev = new TapEvent()
          ev.target = this
          ev.position = {
            x: event.center.x + 'dp',
            y: event.center.y + 'dp'
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
        }
        this.eventListeners[key] = void 0
      }
    }
  }

  addAnimation(animation: BasicAnimation | KeyframeAnimation, key: string) {
    if (animation instanceof BasicAnimation) {
      // setTimeout(() => {
      //   console.warn('trigger', animation.path)
      //   // 属性动画
      //   const properties = this.getTransitionProperties(animation)
      //   // https://www.jianshu.com/p/42e817f1c4bc
      //   for (let key in properties) {
      //     this.node.style[key] = properties[key]
      //   }
      //   const onTransitionStart = (e) => {
      //     if (e.propertyName === animation.path) {
      //       animation.onstart()
      //     }
      //   }
      //   const onTransitionEnd = (e) => {
      //     if (e.propertyName === animation.path) {
      //       animation.onend()
      //     }
      //   }
      //   animation.onstart && this.node.addEventListener('transitionstart', onTransitionStart, true)
      //   animation.onend && this.node.addEventListener('transitionend', onTransitionEnd, true)
      // }, animation.delay)

      const {
        keyframes,
        options
      } = this.getBasicAnimationKeyFrameAnimationOptions(animation)
      const that = this
      // window.addEventListener('render-ready', () =>  {

      const animate: Animation = that.node.animate(keyframes, options)
      this.animations[key] = animate
      animation.onstart && animation.onstart()
      animation.onend && (animate.oncancel = animation.onend as any)
      animate.play()
      // })
    } else if (animation instanceof KeyframeAnimation) {
      // 帧动画
      const { keyframes, options } = this.getKeyframeAnimationOptions(animation)
      const animate: Animation = this.node.animate(keyframes, options)
      this.animations[key] = animate
      animation.onstart && animation.onstart()
      animation.onend && (animate.oncancel = animation.onend as any)
      animate.play()
    }
  }

  removeAllAnimation() {
    for (let key in this.animations) {
      const animate: Animation = this.animations[key]
      animate.pause()
      animate.finish()
    }
    this.animations = {}
  }

  removeAnimationForKey(key: string) {
    const animate: Animation = this.animations[key]
    if (animate) {
      animate.pause()
      animate.finish()
      // @ts-ignore
      this.animations[key] = null
    }
  }

  getRect(callback: Function) {}

  resetStyle() {}

  requestViewWidth(callback: Function) {}

  requestViewHeight(callback: Function) {}

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
    ani: BasicAnimation
  ) {
    switch (ani.path) {
      case 'position':
      case 'scale':
      case 'scaleX':
      case 'scaleY':
      case 'rotationX':
      case 'rotationY':
      case 'rotationZ':
        return { transform: getComputedStyle(this.node)['transform'] }
      case 'opacity':
        return { opacity: getComputedStyle(this.node)['opacity'] }
      case 'backgroundColor':
        return {
          backgroundColor: getComputedStyle(this.node)['backgroundColor']
        }
    }
  }

  /**
   * 获取属性动画的结果值(最后一帧值)
   */
  private getBasicAnimationKeyFrameAnimationOptions(ani: BasicAnimation) {
    return {
      keyframes: [
        this.getBasicAnimationDefaultKeyframeAnimationOptions(ani),
        {
          [this.convertPath(ani.path)]: this.convertPathValue(
            ani.path,
            ani.value
          ),
          offset: 1,
          easing: ani.easing
        }
      ],
      options: {
        direction: 'normal',
        duration: ani.duration,
        iterations: ani.repeatCount
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
        direction: 'normal',
        duration: ani.duration,
        iterations: ani.repeatCount
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
        return `translate(${value.x},${value.y})`
      case 'rotationX':
        return `rotationX(${value}deg)`
      case 'rotationY':
        return `rotationY(${value}deg)`
      case 'rotationZ':
        return `rotationY(${value}deg)`
      case 'scale':
        return `scale(${value})`
      case 'scaleX':
        return `scaleX(${value})`
      case 'scaleY':
        return `scaleY(${value})`
      case 'opacity':
      case 'backgroundColor':
      default:
        return value
    }
  }
}
