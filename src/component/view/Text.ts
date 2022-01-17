import { View, ViewStyle } from './View'
// import { Image } from './Image'
import { formatUnit } from '../../common/utils'
import { styleTransformer } from '../../common/style'
export interface TextStyle extends ViewStyle {
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  textDecoration?: 'none' | 'underline' | 'line-through'
  textVerticalAlign?: 'top' | 'center' | 'bottom'
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
          case 'textVerticalAlign':
            this.node.style.verticalAlign = value
            break
          case 'lineSpacingMulti':
            this.node.style.lineHeight = value
            break
          case 'textAlign':
            switch (value) {
              case 'left':
                this.node.style.justifyContent = 'flex-start'
                break;
              case 'center':
                this.node.style.justifyContent = 'center'
                break;
              case 'right':
                this.node.style.justifyContent = 'flex-end'
                break;
              default:
                break;
            }
            break
          case 'textLineClamp':
            if (value === 0) {
              this.node.style.display = 'flex'
            } else {
              this.node.style['-webkitLineClamp'] = value
              this.node.style.overflow = 'hidden'
              this.node.style.display = '-webkit-box'
              this.node.style['-webkitBoxOrient'] = 'vertical'
            }
            break
          case 'letterSpacing':
            this.node.style['letterSpacing'] = `${value}em`
            break
        }
        return true
      }
    })
  }

  protected defaultStyle() {
    this.node.classList.add('hm-default-text-box')
  }

  protected createNode() {
    this.node = document.createElement('span')
  }

  get style() {
    return this._style
  }

  set style(_style: TextStyle) {
    let deepStyle = JSON.parse(JSON.stringify(_style))
    let standardStyle = styleTransformer.transformStyle(deepStyle);
    this._style = Object.assign(this._style, standardStyle)
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
    // Todo: 解析富文本
    this.parseRichText(value)
  }

  get formattedText() {
    return this.node.innerHTML
  }

  set formattedText(value: string) {
    this.node.innerHTML = value
  }

  private parseRichText(value: any) {
    this.node.innerText = ''
    let image, text
    value.forEach(item => {
      if (item?.image) {
        image = document.createElement('img')
        image.src = item.image
        image.alt = "加载失败"
        image.style.alignSelf = 'baseline'
        switch (item.imageAlign) {
          case 'top':
            image.style.alignSelf = 'flex-start'
            break;
          case 'bottom':
            image.style.alignSelf = 'flex-end'
            break;
          default:
            image.style.alignSelf = item.imageAlign
            break;
        }
        image.style.width = formatUnit(item.imageWidth)
        image.style.height = formatUnit(item.imageHeight)
        this.node.appendChild(image)
      }
      if (item?.text) {
        text = document.createElement('span')
        text.className = 'hm-default-text'
        text.innerHTML = item?.text;
        (item?.color || item?.hrefColor) && (text.style.color = item?.color || item?.hrefColor)
        item?.fontSize && (text.style.fontSize = formatUnit(item?.fontSize))
        item?.backgroundColor && (text.style.backgroundColor = item?.backgroundColor)
        item?.fontFamily && (text.style.fontFamily = item?.fontFamily)
        item?.fontWeight && (text.style.fontWeight = item?.fontWeight)
        item?.textDecoration && (text.style.textDecoration = item?.textDecoration)
        if (item?.href) {
          text.style.textDecoration = 'underline'
          text.onclick = () => {
            window.open(item?.href)
          }
        }
        this.node.appendChild(text)
      }
    });
  }
}
