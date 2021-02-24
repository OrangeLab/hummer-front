import { View, ViewStyle } from './View'
import { formatUnit } from '../../common/utils'

export interface TextStyle extends ViewStyle {
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  textDecoration?: 'none' | 'underline' | 'line-through'
  fontFamily?: string
  fontSize?: string | number
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  textOverflow?: 'clip' | 'ellipsis'
  textLineClamp?: number
  letterSpacing?: number
  lineSpacingMulti?: number
}

export class Text extends View {
  protected _style: TextStyle

  constructor() {
    super()
    this.node.classList.add('hm-text')
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
          case 'textLineClamp':
            target[key] = value
            break
          case 'fontSize':
            // @ts-ignore
            target[key] = formatUnit(value)
            this.node.style[key] = formatUnit(value)
        }
        return true
      }
    })
  }

  protected createNode() {
    this.node = document.createElement('span')
  }

  get text() {
    return this.node.innerText
  }

  set text(value: string) {
    this.node.innerText = value
  }

  get richText() {
    return this.node.innerText
  }

  set richText(value: any) {
    this.node.innerText = value
  }

  get formattedText() {
    return this.node.innerHTML
  }

  set formattedText(value: string) {
    this.node.innerHTML = value
  }

  get style() {
    return this._style
  }

  set style(_style: TextStyle) {
    this._style = Object.assign(this._style, _style)
  }
}
