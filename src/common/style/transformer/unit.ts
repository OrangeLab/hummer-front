/**
 * 单位处理中间件，将Css中的单位转换为Hummer中特有的单位
 * hm ==> px
 * @param style 待处理的Style
 */
import { makeMapByArrOfKebab } from "../../utils"

// 待转换单位的属性列表
export const unitAttrs = [
  'font-size', 'placeholder-font-size',
  'flex-basis',
  'width', 'max-width','min-width', 'height','max-height','min-height',
  'padding', 'padding-left', 'padding-right', 'padding-bottom', 'padding-top',
  'margin', 'margin-left', 'margin-right', 'margin-bottom', 'margin-top',
  'left', 'right', 'top', 'bottom',
  'border-width', 'border-left-width','border-right-width', 'border-top-width', 'border-bottom-width',
  'border-radius', 'border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'
]
export const isNeedUnitTrasform = makeMapByArrOfKebab(unitAttrs)
const isHmUnit = /hm$/
const isPecentUnit = /%$/
const isStaticNumber = /^\d+$/
export function transformUnit(style: Record<string, string>) {
  Object.keys(style).forEach(key => {
    if(isNeedUnitTrasform(key)){
      let value = transformUnitValue(style[key])
      style[key] = value
    }
  })
  return style
}

export function transformUnitValue(value:string):string{
  if(isHmUnit.test(value)){
    return transfromHm(value)
  }else if(isPecentUnit.test(value)){
    return value
  }else if(isStaticNumber.test(value)){
    return value + 'rem'
  }
  return value
}


function transfromHm(value: string):string{
  return value.replace('hm', 'rem')
}

