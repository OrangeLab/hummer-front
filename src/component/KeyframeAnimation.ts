import { KeyPath, ValueType, EasingType } from './BasicAnimation'

/**
 * http://www.w3school.com.cn/css3/css3_animation.asp
 */
export class KeyframeAnimation {
  // 动画时间间隔（s）
  duration: number = 0
  // 重复次数
  repeatCount: number = 1
  // 关键路径positions
  keyframes: Array<{
    percent?: number
    value: ValueType
    easing?: EasingType
  }> = []
  easing?: EasingType
  onstart!: Function
  onend!: Function
  delay: number
  on(type: string, callback: Function) {
    callback()
  }

  removeAnimation!: Function

  constructor(public path: KeyPath) {}
}
