import { toKebabCase } from './cases'
import { Hummer } from '../base/Global'
/**
 * TODO Format Unit 实现
 * @param size 
 * @returns 
 */
export function formatUnit(size: number | string) {
  let reg = /^[+-]?(\d|[1-9]\d+)(\.\d+)?$/;
  size = size + ''
  if (reg.test(size)) {
    size = parseFloat(size);
    return `${size}px`
  } else {
    if (size.indexOf('dp') !== -1 || size.indexOf('pt') !== -1) {
      size = parseFloat(size);
      return `${size}px`
    } else if (size.indexOf('rem') !== -1) {
      return `${parseFloat(size) * 100}rem`
    } else if (size.indexOf('hm') !== -1) {
      return size.replace('hm', 'rem')
    } else if (size.indexOf('calc') !== -1) {
      return size
    } else if (size.indexOf('px') !== -1) {
      size = parseFloat(size) / Hummer.env.scale;
      return `${size}px`
    } else {
      if (size.match(/rotate3d|rotateX|rotateY|rotateZ|rotate/g)) {
        size = size.replace(/(rotate3d|rotateX|rotateY|rotateZ|rotate)\(([\d\D]*?)\)/g, function (word) {
          if (/rotate3d\(([\d\D]*?)\)/.test(word)) {
            return `${word.split(',')[0]},${word.split(',')[1]},${word.split(',')[2]},${parseFloat(word.split(',')[3])}deg)`
          } else {
            return `${word.split('(')[0]}(${parseFloat(word.split('(')[1])}deg)`
          }
        })
      }
      if (size.match(/skewY|skewX|skew/g)) {
        size = size.replace(/(skewY|skewX|skew)\(([\d\D]*?)\)/g, function (word) {
          if (/skew\(([\d\D]*?)\)/.test(word)) {
            return `${word.split('(')[0]}(${parseFloat(word.split('(')[1].split(',')[0])}deg,${parseFloat(word.split('(')[1].split(',')[1])}deg)`
          } else {
            return `${word.split('(')[0]}(${parseFloat(word.split('(')[1])}deg)`
          }
        })
      }
      return size
    }
  }
}
/**
 * tenon样式格式化纯数字px单位
 * @param size 
 * @returns 
 */
export function formatPureNumberPxUnit(size: number | string): number {
  let formatUnitResult = formatUnit(size)
  if (formatUnitResult.indexOf('rem') !== -1) {
    return (parseFloat(formatUnitResult) / 750 * (inIframe() ? document.body.offsetWidth : window.screen.width));
  } else if (formatUnitResult.indexOf('px') !== -1) {
    return parseFloat(formatUnitResult.replace('px', ''))
  }
}

/**
 * web样式格式化纯数字px单位
 * @param size 
 * @returns 
 */
export function formatWebPureNumberPxUnit(size: string): number {
  let formatUnitResult = size || '0'
  if (formatUnitResult.indexOf('rem') !== -1) {
    return (parseFloat(formatUnitResult) / 750 * (inIframe() ? document.body.offsetWidth : window.screen.width));
  } else if (formatUnitResult.indexOf('px') !== -1) {
    return parseFloat(formatUnitResult.replace('px', ''))
  } else {
    return parseFloat(formatUnitResult)
  }
}


/**
 * 将字符串转换为判断是否存在对象中的字符串，空间换时间
 * @param str 待判断的字符串 a,b
 * @param expectedLowerCase 是否要转换为小写
 * @returns 
 */
export function makeMap(str: string, expectedLowerCase: Boolean = false) {
  const map = Object.create(null)
  const list: Array<string> = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectedLowerCase ? (val: any) => !!map[val.toLowerCase()] : (val: any) => !!map[val]
}

/**
 * 将数组转换为判断是否存在对象中的字符串，空间换时间
 * @param str 待判断的数组 [a,b]
 * @param expectedLowerCase 是否要转换为小写
 * @returns 
 */
export function makeMapByArr(list: any, expectedLowerCase: Boolean = false) {
  const map = Object.create(null)
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectedLowerCase ? (val: any) => !!map[val.toLowerCase()] : (val: any) => !!map[val]
}

/**
 * 将数组转换为判断是否存在对象中的字符串，空间换时间
 * @param str 待判断的数组 [a,b]
 * @param expectedLowerCase 是否要转换为小写
 * @returns 
 */
export function makeMapByArrOfKebab(list: any) {
  const map = Object.create(null)
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return (val: any) => !!map[toKebabCase(val)]
}

/**
 * 监听元素尺寸变化，用于判断元素渲染
 * @param node dom元素
 */
export const nodeObserver = (node: | HTMLElement
  | HTMLImageElement
  | HTMLButtonElement
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSpanElement
  | any, callback: Function) => {
  const nodeObserver = new ResizeObserver(mutations => {
    callback(mutations)
  })
  nodeObserver.observe(node)
  return nodeObserver
}

/**
 * 获取url参数
 * @param key 参数的key
 */
export const getQueryVariable = (key: string, url?: string) => {
  var query = url ? url.split('?')[1] : window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == key) { return pair[1]; }
  }
  return (false);
}

/**
 * 添加或者修改url参数
 * @param url 需要添加的url
 * @param key 参数的key
 * @param value 参数的value
 */
export const updateQueryStringParameter = (url: string, key: string, value: any) => {
  if (!value) {
    return url;
  }
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = url.indexOf('?') !== -1 ? "&" : "?";
  if (url.match(re)) {
    return url.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return url + separator + key + "=" + value;
  }
}
/**
 * 判断当前页面是否在iframe里
 * @returns 
 */
export const inIframe = () => {
  if (self != top) {
    return true;
  } else {
    return false;
  }
}
/**
 * 节流
 * @param fn 需要节流的函数
 * @param wait 节流的时间
 */
export const throttle = (fn: Function, wait: number = 200) => {
  var timeout;
  return function () {
    var ctx = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      fn.apply(ctx, args);
    }, wait);
  };
}
/**
 * 防抖
 * @param func 需要防抖的函数
 * @param wait 防抖的时间
 * @param flag (布尔值):是否需要第一次触发事件立即执行(不传入flag则默认为false,不会立即执行第一次)
 */
export const debounce = (func: Function, wait: number, flag: boolean) => {
  let timer, args, that;
  return function () {
    //args包含了func的事件对象,that为func的this指向(应当指向事件源)
    args = arguments;
    that = this;
    let callnow = flag && !timer;
    if (callnow) func.apply(that, args); //不传入参数flag这段行代码不执行
    clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      if (!flag) func.apply(that, args);
    }, wait);
  };
}

export const getBoxModelValue = (elem: any):object => {
  return {
    display: getStyle(elem, "display"),
    position: getStyle(elem, "position"),
    top: getStyle(elem, "top"),
    right: getStyle(elem, "right"),
    bottom: getStyle(elem, "bottom"),
    left: getStyle(elem, "left"),
    marginTop: getStyle(elem, "marginTop"),
    marginRight: getStyle(elem, "marginRight"),
    marginBottom: getStyle(elem, "marginBottom"),
    marginLeft: getStyle(elem, "marginLeft"),
    borderTopWidth: getStyle(elem, "borderTopWidth"),
    borderRightWidth: getStyle(elem, "borderRightWidth"),
    borderBottomWidth: getStyle(elem, "borderBottomWidth"),
    borderLeftWidth: getStyle(elem, "borderLeftWidth"),
    paddingTop: getStyle(elem, "paddingTop"),
    paddingRight: getStyle(elem, "paddingRight"),
    paddingBottom: getStyle(elem, "paddingBottom"),
    paddingLeft: getStyle(elem, "paddingLeft"),
    contentWidth:
      elem.offsetWidth -
      parseInt(getStyle(elem, "paddingLeft")) -
      parseInt(getStyle(elem, "paddingRight")) -
      parseInt(getStyle(elem, "borderLeftWidth")) -
      parseInt(getStyle(elem, "borderRightWidth")),
    contentHeight:
      elem.offsetHeight -
      parseInt(getStyle(elem, "paddingTop")) -
      parseInt(getStyle(elem, "paddingBottom")) -
      parseInt(getStyle(elem, "borderTopWidth")) -
      parseInt(getStyle(elem, "borderBottomWidth")),
    windowTop: elem.getBoundingClientRect().top,
    windowLeft: elem.getBoundingClientRect().left,
    offsetWidth: elem.offsetWidth,
    offsetHeight: elem.offsetHeight,
    nodeName: elem.nodeName.toLowerCase(),
    id: elem.id,
    className: elem.className,
    __view_id: elem.__view_id,
    nodeType: elem.nodeType,
    tagName: elem.tagName,
  };
}
const getStyle = (elem: any, attr: string) => {
  let attrStyle = null;
  if (elem?.currentStyle) {
    attrStyle = elem.currentStyle[attr];
  } else {
    attrStyle = document.defaultView.getComputedStyle(elem, null)[attr];
  }
  if (attrStyle.indexOf("px") !== -1) {
    return /\d+/.exec(attrStyle)[0];
  } else {
    return attrStyle;
  }
}
