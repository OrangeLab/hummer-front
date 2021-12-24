import { Input, InputStyle } from './Input'

export interface TextAreaStyle extends InputStyle {
  textLineClamp?: number
}

export class TextArea extends Input {
  protected _style: TextAreaStyle
  

  constructor() {
    super()
    // @ts-ignore
    this._style = new Proxy(this._style, {
      get: (target, key) => {
        switch (key) {
          case 'textLineClamp':
            // @ts-ignore
            return target[key] || this.node.rows
          default:
            // @ts-ignore
            return target[key]
        }
        // 获取style
      },
      set: (target, key, value) => {
        // 设置style
        // @ts-ignore
        target[key] = value
        switch (key) {
          case 'textLineClamp':
            this.node.rows = value
            break
        }
        return true
      }
    })
  }
  get focused() {
    return document.activeElement === this.node
  }

  set focused(focused: boolean) {
    console.log(focused)
    if (focused) {
      this.node.focus()
    } else {
      this.node.blur()
    }
  }
  
  protected defaultStyle() {
    this.node.classList.add('hm-default-textarea')
  }
  protected createNode() {
    this.node = document.createElement('textarea')
  }

  get style() {
    return this._style
  }

  set style(_style: TextAreaStyle) {
    this._style = Object.assign(this._style, _style)
  }
}
