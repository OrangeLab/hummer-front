import { View, ViewStyle } from './View'

export interface CanvasStyle extends ViewStyle {}

export class Canvas extends View {
  protected _style: CanvasStyle

  constructor() {
    super()
  }

  protected createNode() {
    this.node = document.createElement('canvas')
  }
}
