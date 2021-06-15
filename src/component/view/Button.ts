import Hammer from 'hammerjs'
import { View, ViewStyle } from './View'
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
  private _pressedStyle!: ButtonStyle

  constructor() {
    super()
    this.defaultStyle()
    this.init()
  }
  protected defaultStyle() {
    this.node.classList.add('hm-default-button')
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
        // console.warn('record _beforePressedStyle', this._beforePressedStyle)
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
      // Todo: 事件中断处理？可以通过代理全局对象进行代理来做样式兜底
    }
    hammer.on('press', pressEvent)
    debugger
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

  get enabled() {
    return this._enabled
  }

  set enabled(_enabled: boolean) {
    this._enabled = _enabled
    if (!_enabled) {
      // Todo: 原生标签的属性 disabled 的值是 ‘disabled’
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

  set disabled(value: ButtonStyle) {
    // console.log('_disabled style', value)
    // 设置样式
    this._disabled = value
    // 触发enabled的修改，更新样式s
    this.enabled = this._enabled
  }

  get pressed() {
    return this._pressedStyle
  }

  set pressed(value: ButtonStyle) {
    this._pressedStyle = value
  }
}
