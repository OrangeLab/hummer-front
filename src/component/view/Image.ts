import { View, ViewStyle } from './View'

// TODO Image Component 对接
export interface ImageStyle extends ViewStyle {
  // 图片拉伸模式
  resize?: 'origin' | 'contain' | 'cover' | 'stretch'
}

export class Image extends View {
  protected _style: ImageStyle
  protected _src!: string
  protected _gifSrc!: string

  constructor() {
    super()
    // @ts-ignore
    this._style = new Proxy(this._style, {
      get: (target, key) => {
        // 获取style
        switch (key) {
          case 'resize':
            // @ts-ignore
            return target[key] || this.node.style.backgroundSize
          default:
            // @ts-ignore
            return target[key] || this.node.style[key]
        }
      },
      set: (target, key, value) => {
        // 设置style
        // @ts-ignore
        target[key] = value
        switch (key) {
          case 'resize':
            this.setImageResizeMode(value)
            break
          default:
            this.node.style[key] = value
        }
        return true
      }
    })
  }

  protected createNode() {
    this.node = document.createElement('div')
  }

  // Todo: 仅为测试
  protected defaultStyle() {
    this.node.classList.add('hm-image')
  }

  private setImageResizeMode(value: string) {
    console.log('setImageResizeMode', value)
    switch (value) {
      case 'origin':
        this.node.style.backgroundSize = 'initial'
        this.node.style.backgroundRepeat = 'no-repeat'
        this.node.style.backgroundPosition = 'center center'
        break
      case 'contain':
        this.node.style.backgroundSize = 'contain'
        this.node.style.backgroundRepeat = 'no-repeat'
        this.node.style.backgroundPosition = 'center center'
        break
      case 'cover':
        this.node.style.backgroundSize = 'cover'
        this.node.style.backgroundRepeat = 'no-repeat'
        this.node.style.backgroundPosition = 'center center'
        break
      case 'stretch':
        this.node.style.backgroundSize = '100% 100%'
        this.node.style.backgroundRepeat = 'no-repeat'
        this.node.style.backgroundPosition = '0 0'
        break
    }
  }

  get src() {
    return this._src
  }

  set src(src) {
    this._src = src
    this.node.style.backgroundImage = `url(${src})`
  }

  get gifSrc() {
    return this._gifSrc
  }

  set gifSrc(gifSrc) {
    this._gifSrc = gifSrc
    this.node.style.backgroundImage = `url(${gifSrc})`
  }

  get gifRepeatCount(): number {
    return 0
  }

  set gifRepeatCount(gifRepeatCount: number) {}

  set onload(onload: Function) {
    this.node.onload = onload
  }

  get onload() {
    return this.node.onload
  }

  get style() {
    return this._style
  }

  set style(_style: ImageStyle) {
    this._style = Object.assign(this._style, _style)
  }
}
