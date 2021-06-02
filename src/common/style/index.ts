import {transformUnit} from './transformer/unit'

/**
 * Style Transformer
 * 1. Unit
 * 2. Box shadow
 * 3. Background linear-gradient
 * 4. 
 */
class StyleTransformer{

  private middlewares: Array<Function> = []
  constructor() {
    this.registerMiddleware()
  }

  registerMiddleware() {
    this.use(transformUnit)
  }

  use(middleware: Function) {
    if(typeof middleware !== 'function'){
      throw "middleware must be a function"
    }
    this.middlewares.push(middleware)
    return this
  }

  transformStyle(style:any = {}, view?:any):Record<string, string>|null{
    let tempStyle = style
    this.middlewares.forEach(middleware => {
      let result = middleware(tempStyle, view)
      tempStyle = result? result: tempStyle
    })
    return tempStyle
  }

}

export const styleTransformer = new StyleTransformer()

export {transformUnitValue} from './transformer/unit'
export {getColor} from './common/color'