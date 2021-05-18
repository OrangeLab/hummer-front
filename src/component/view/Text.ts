import { View, ViewStyle } from './View'

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
  }

  protected defaultStyle() {
    this.node.classList.add('hm-default-text')
  }

  protected createNode() {
    this.node = document.createElement('text')
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
}
