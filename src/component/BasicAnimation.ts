/**
 * Animatable CSS properties
 * https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties
 * https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions
 */
export type KeyPath =
  | 'position'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'rotationX'
  | 'rotationY'
  | 'rotationZ'
  | 'opacity'
  | 'backgroundColor'

export type EasingType =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'

export interface PointValue {
  x: string | number
  y: string | number
}

/** backgroundColor: '#fff'; position: {x: '1px', y: '1px'}; scale: 1; rotate: 45; opacity: 0.1  */
export type ValueType = string | number | PointValue

export class BasicAnimation {
  // 动画时间间隔（s）
  duration: number = 0
  // 动画延迟时间（s）
  delay: number = 0
  // 重复次数 < 0 :无数次
  repeatCount: number = 1
  value!: ValueType
  easing: EasingType = 'linear'

  onstart!: Function
  onend!: Function
  on(type: string, callback: Function) {
    callback()
  }

  removeAnimation!: Function

  constructor(public path: KeyPath) {}
}
