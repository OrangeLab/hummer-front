import * as Hammer from 'hammerjs'
import { View, ViewStyle } from './View'
import { formatUnit } from '../../common/utils'
export interface ButtonStyle extends ViewStyle {
  textAlign?: 'left' | 'center' | 'right'
  fontFamily?: string
  fontSize?: string | number
  color?: string
}

export class Button extends View {
  private _beforeDisabledStyle!: ButtonStyle
  // 禁止状态下的样式
  private _disabled!: ButtonStyle
  private _beforePressedStyle!: ButtonStyle
  // 按下态的样式
  pressed!: ButtonStyle

  protected _style: ButtonStyle

  constructor() {
    super()
    this._enabled = true
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
          case 'fontSize':
            target[key] = formatUnit(value)
            this.node.style[key] = formatUnit(value)
          case 'textAlign':
            target[key] = value
            this.node.style[key] = value
          default:
            this.node.style[key] = value
        }
        return true
      }
    })
    this.defaultStyle()
    this.init()
  }
  protected defaultStyle() {
    this.node.classList.add('hm-default-inline')
  }

  private init() {
    const hammer = new Hammer(this.node)
    const pressEvent = () => {
      if (!this.enabled) return

      if (this.pressed) {
        // 记录press之前的样式
        this._beforePressedStyle = Object.keys(this.pressed).reduce(
          (pre, curr) => {
            // @ts-ignore
            pre[curr] = this.style[curr]
            return pre
          },
          {}
        )
        console.warn('record _beforePressedStyle', this._beforePressedStyle)
        // 设置pressed样式
        this.style = this.pressed
      }
    }
    const pressUpEvent = () => {
      if (!this.enabled) return

      if (this._beforePressedStyle) {
        // 恢复pressed之前的样式
        this.style = this._beforePressedStyle
        console.warn('reset _beforePressedStyle', this._beforePressedStyle)
      }
    }
    hammer.on('press', pressEvent)
    hammer.on('pressup', pressUpEvent)
  }

  protected createNode() {
    this.node = document.createElement('button')
  }

  get text() {
    return this.node.innerText
  }

  set text(text: string) {
    this.node.innerText = text
  }

  get style() {
    return this._style
  }

  set style(_style: ButtonStyle) {
    this._style = Object.assign(this._style, _style)
  }

  get enabled() {
    return this._enabled
  }

  set enabled(_enabled: boolean) {
    this._enabled = _enabled
    if (!_enabled) {
      this.node.disabled = true
      // 设置disabled样式
      if (this.disabled) {
        // 记录之前的原始的样式
        this._beforeDisabledStyle = Object.keys(this.disabled).reduce(
          (pre, curr) => {
            // @ts-ignore
            pre[curr] = this.style[curr]
            return pre
          },
          {}
        )
        // console.warn('record _beforeDisabledStyle', this._beforeDisabledStyle)
        // 设置样式
        this.style = this.disabled
      }
    } else {
      this.node.disabled = false
      // 恢复disabled之前的样式
      if (this._beforeDisabledStyle) {
        this.style = this._beforeDisabledStyle
        // console.warn('reset _beforeDisabledStyle', this._beforeDisabledStyle)
      }
    }
  }

  get disabled() {
    return this._disabled
  }

  set disabled(_disabled) {
    // 设置样式
    this._disabled = _disabled
    // 触发enabled的修改，更新样式
    this.enabled = this._enabled
  }
}
