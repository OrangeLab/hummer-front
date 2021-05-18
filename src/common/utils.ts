import {toKebabCase} from './cases'
/**
 * TODO Format Unit 实现
 * @param size 
 * @returns 
 */
export function formatUnit(size: number | string) {
  // const deviceWidth = +Hummer.env.deviceWidth.replace('dp', '')
  // if (typeof size === 'number') {
  //   return deviceWidth * (size / Hummer.env.remUEWidthInPixel) + 'px'
  // } else if (typeof size === 'string') {
  //   return size.replace('dp', 'px')
  // }
  console.log('size', size)
  return `${size}px`
}


/**
 * 将字符串转换为判断是否存在对象中的字符串，空间换时间
 * @param str 待判断的字符串 a,b
 * @param expectedLowerCase 是否要转换为小写
 */
 export function makeMap(str:string, expectedLowerCase:Boolean =false){
  const map = Object.create(null)
  const list:Array<string> = str.split(',')
  for(let i = 0; i< list.length; i++){
    map[list[i]] = true
  }
  return expectedLowerCase ? (val:any) => !!map[val.toLowerCase()] : (val:any) => !!map[val]
}

/**
 * 将数组转换为判断是否存在对象中的字符串，空间换时间
 * @param str 待判断的数组 [a,b]
 * @param expectedLowerCase 是否要转换为小写
 */
export function makeMapByArr(list:any, expectedLowerCase:Boolean =false){
  const map = Object.create(null)
  for(let i = 0; i< list.length; i++){
    map[list[i]] = true
  }
  return expectedLowerCase ? (val:any) => !!map[val.toLowerCase()] : (val:any) => !!map[val]
}

/**
 * 将数组转换为判断是否存在对象中的字符串，空间换时间
 * @param str 待判断的数组 [a,b]
 * @param expectedLowerCase 是否要转换为小写
 */
 export function makeMapByArrOfKebab(list:any){
  const map = Object.create(null)
  for(let i = 0; i< list.length; i++){
    map[list[i]] = true
  }
  return (val:any) => !!map[toKebabCase(val)] 
}