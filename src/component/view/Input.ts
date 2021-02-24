import { View, ViewStyle, SIZE_STYLE } from './View'
import { formatUnit } from '../../common/utils'

export const INPUT_SIZE_STYLE: Array<any> = ['fontSize'].concat(SIZE_STYLE)
export interface InputStyle extends ViewStyle {
  type?: 'default' | 'number' | 'tel' | 'email' | 'password'
  color?: string
  placeholderColor?: string
  cursorColor?: string
  textAlign?: 'left' | 'center' | 'right'
  fontFamily?: string
  // placeholderFontSize?: string
  maxLength?: number
  fontSize?: string | number
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send'
}

export class Input extends View {
  protected _style: InputStyle

  protected _randomPlaceholderClass!: string
  protected _placeholderCssIndex: number = 0

  constructor() {
    super()
    this._style = new Proxy(
      {},
      {
        get: (target, key) => {
          switch (key) {
            case 'type':
              // @ts-ignore
              return target[key] || this.node.type
            case 'maxLength':
              // @ts-ignore
              return target[key] || this.node.maxLength
            case 'placeholderColor':
            case 'placeholderFontSize':
            case 'returnKeyType':
              // @ts-ignore
              return target[key]
            case 'cursorColor':
              // @ts-ignore
              return target[key] || this.node.style['caretColor']
            case 'color':
            case 'fontSize':
            default:
              // @ts-ignore
              return target[key] || this.node.style[key]
          }
          // 获取style
        },
        set: (target, key, value) => {
          // 设置style
          if (SIZE_STYLE.includes(key)) {
            // @ts-ignore
            target[key] = formatUnit(value)
          } else {
            // @ts-ignore
            target[key] = value
          }
          switch (key) {
            case 'type':
              this.node.type = value
              break
            case 'placeholderColor':
              this.changePlaceholder({
                color: value,
                fontSize: this.style.fontSize
              })
              break
            case 'placeholderFontSize':
              this.changePlaceholder({
                color: this.style.placeholderColor,
                fontSize: value
              })
              break
            case 'cursorColor':
              this.node.style.caretColor = value
              break
            case 'maxLength':
              this.node.maxLength = value
              break
            case 'returnKeyType':
              break
            case 'color':
            case 'fontSize':
            default:
              if (INPUT_SIZE_STYLE.includes(key)) {
                this.node.style[key] = formatUnit(value)
              } else {
                this.node.style[key] = value
              }
          }
          return true
        }
      }
    )
    this.defaultStyle()
  }
  protected defaultStyle() {
    this.node.classList.add('hm-default-inline')
  }
  /**
   * 通过添加伪类::placeholder来修改placeholder
   */
  // @ts-ignore
  protected changePlaceholder({ fontSize, color }) {
    this.node.classList.remove(this._randomPlaceholderClass)
    this._randomPlaceholderClass = `hm-placeholder-${++this
      ._placeholderCssIndex}`
    this.node.classList.add(this._randomPlaceholderClass)
    if (document.styleSheets.item(0)) {
      const item: any = document.styleSheets.item(0)
      if (item.addRule) {
        item.addRule(
          `.${this._randomPlaceholderClass}::placeholder`,
          `font-size: ${formatUnit(fontSize)}; color: ${color};`
        )
      }
    }
  }

  protected createNode() {
    this.node = document.createElement('input')
  }

  get text() {
    return this.node.value
  }

  set text(value) {
    this.node.value = value
  }

  get focused() {
    return document.activeElement === this.node
  }

  set focused(focused: boolean) {
    if (focused) {
      this.node.focus()
    } else {
      this.node.blur()
    }
  }

  get placeholder() {
    return this.node.placeholder
  }

  set placeholder(value) {
    this.node.placeholder = value
  }

  get style() {
    return this._style
  }

  set style(_style: InputStyle) {
    this._style = Object.assign(this._style, _style)
  }

  clear() {
    this.text = ''
  }
}
