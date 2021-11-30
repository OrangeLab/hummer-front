/**
 * 单位处理中间件，将Css中的单位转换为Hummer中特有的单位
 * hm ==> px
 * @param style 待处理的Style
 */
import { makeMapByArrOfKebab } from "../../utils"

// 待转换单位的属性列表
export const unitAttrs = [
  'font-size', 'placeholder-font-size', 'transform',
  'flex-basis',
  'width', 'max-width', 'min-width', 'height', 'max-height', 'min-height',
  'padding', 'padding-left', 'padding-right', 'padding-bottom', 'padding-top',
  'margin', 'margin-left', 'margin-right', 'margin-bottom', 'margin-top',
  'left', 'right', 'top', 'bottom',
  'border-width', 'border-left-width', 'border-right-width', 'border-top-width', 'border-bottom-width',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'
]
export const isNeedUnitTrasform = makeMapByArrOfKebab(unitAttrs)
const isHmUnit = /[+-]?(\d+)?(\.)?\d+hm/
const isPecentUnit = /%$/
const isStaticNumber = /^\d+$/
export function transformUnit(style: Record<string, string>) {
  Object.keys(style).forEach(key => {
    if (key === 'transitionDuration') {
      style[key] = `${style[key]}s`
    }
    if (isNeedUnitTrasform(key)) {
      let value = transformUnitValue(style[key])
      style[key] = value
    }
  })
  return style
}

export function transformUnitValue(value: string): string {
  if (isHmUnit.test(value)) {
    return transfromHm(value)
  } else if (isPecentUnit.test(value)) {
    return value
  } else if (isStaticNumber.test(value)) {
    return value + 'rem'
  }
  if (value.match(/rotate3d|rotateX|rotateY|rotateZ|rotate/g)) {
    value = value.replace(/(rotate3d|rotateX|rotateY|rotateZ|rotate)\(([\d\D]*?)\)/g, function (word) {
      if (/rotate3d\(([\d\D]*?)\)/.test(word)) {
        return `${word.split(',')[0]},${word.split(',')[1]},${word.split(',')[2]},${parseFloat(word.split(',')[3])}deg)`
      } else {
        return `${word.split('(')[0]}(${parseFloat(word.split('(')[1])}deg)`
      }
    })
  }
  if (value.match(/skewY|skewX|skew/g)) {
    value = value.replace(/(skewY|skewX|skew)\(([\d\D]*?)\)/g, function (word) {
      if (/skew\(([\d\D]*?)\)/.test(word)) {
        return `${word.split('(')[0]}(${parseFloat(word.split('(')[1].split(',')[0])}deg,${parseFloat(word.split('(')[1].split(',')[1])}deg)`
      } else {
        return `${word.split('(')[0]}(${parseFloat(word.split('(')[1])}deg)`
      }
    })
  }
  return value
}


function transfromHm(value: string): string {
  return value.replace('hm', 'rem')
}

