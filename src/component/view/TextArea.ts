import { Input, InputStyle } from './Input'
import { styleTransformer } from '../../common/style'
export interface TextAreaStyle extends InputStyle {
  textLineClamp?: number
}

export class TextArea extends Input {
  protected _style: TextAreaStyle
  private changeHandler:any

  constructor() {
    super()
    // @ts-ignore
    this._style = new Proxy(this._style, {
      get: (target, key) => {
        switch (key) {
          case 'textLineClamp':
            // @ts-ignore
            return target[key] || this.node.rows
          default:
            // @ts-ignore
            return target[key]
        }
        // 获取style
      },
      set: (target, key, value) => {
        // 设置style
        // @ts-ignore
        target[key] = value
        switch (key) {
          case 'textLineClamp':
            if (value === 0) {
              this.node.rows = 1
              this.autoTextarea();
            } else {
              this.removeAutoTextarea()
              this.node.rows = value
            }
            break
        }
        return true
      }
    })
    this.node.rows = 1
    this.autoTextarea();
  }
  get focused() {
    return document.activeElement === this.node
  }

  set focused(focused: boolean) {
    console.log(focused)
    if (focused) {
      this.node.focus()
    } else {
      this.node.blur()
    }
  }

  protected defaultStyle() {
    this.node.classList.add('hm-default-textarea')
  }
  protected createNode() {
    this.node = document.createElement('textarea')
  }

  get style() {
    return this._style
  }

  set style(_style: TextAreaStyle) {
    let deepStyle = JSON.parse(JSON.stringify(_style))
    let standardStyle = styleTransformer.transformStyle(deepStyle);
    this._style = Object.assign(this._style, standardStyle)
  }
  /**
  * 文本框根据输入内容自适应高度
  * @param                {HTMLElement}        输入框元素
  * @param                {Number}                设置光标与输入框保持的距离(默认0)
  * @param                {Number}                设置最大高度(可选)
  */
  autoTextarea() {
    this.node.style.resize = 'none';
    this.changeHandler = this.change.bind(this);
    this.removeAutoTextarea();
    this.node.addEventListener('propertychange', this.changeHandler);
    this.node.addEventListener('input', this.changeHandler);
    this.node.addEventListener('focus', this.changeHandler);
    this.change();
  }
  removeAutoTextarea() {
    this.node.removeEventListener('propertychange', this.changeHandler);
    this.node.removeEventListener('input', this.changeHandler);
    this.node.removeEventListener('focus', this.changeHandler);
  }
  change() {
    let elem = this.node
    let isFirefox = !!(document as any)?.getBoxObjectFor || 'mozInnerScreenX' in window,
      isOpera = !!(window as any)?.opera && !!(window as any)?.opera.toString().indexOf('Opera'),
      minHeight = parseFloat(this.getStyle('height'));
    let scrollTop, height,
      padding = 0,
      style = elem.style;
    if (elem._length === elem.value.length) return;
    elem._length = elem.value.length;
    if (!isFirefox && !isOpera) {
      padding = parseInt(this.getStyle('paddingTop')) + parseInt(this.getStyle('paddingBottom'));
    };
    scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    elem.style.height = `${minHeight}px`;
    if (elem.scrollHeight > minHeight) {
      height = elem.scrollHeight - padding;
      style.overflowY = 'hidden';
      style.height = `${height}px`;
      scrollTop += parseInt(style.height) - elem.currHeight;
      document.body.scrollTop = scrollTop;
      document.documentElement.scrollTop = scrollTop;
      elem.currHeight = parseInt(style.height);
    };
  }
  getStyle(name) {
    if (this.node.currentStyle) {
      let val
      val = this.node.currentStyle[name];
      if (name === 'height' && val.search(/px/i) !== 1) {
        let rect = this.node.getBoundingClientRect();
        return rect.bottom - rect.top -
          parseFloat(this.getStyle('paddingTop')) -
          parseFloat(this.getStyle('paddingBottom')) + 'px';
      };
      return val;
    } else {
      return getComputedStyle(this.node, null)[name];
    }
  }
}
