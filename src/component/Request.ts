import { Response } from './Response'

/**
 * 参考
 * https://segmentfault.com/a/1190000004322487#articleHeader0
 * https://juejin.im/entry/5a4ea104518825733a307ed1
 */
export class Request {
  public url!: string
  public method!: 'GET' | 'POST'
  public timeout: number = 10 * 1000 // 10s
  public header: { [key: string]: any } = {}
  public param: { [key: string]: any } = {}
  public withCredentials: boolean = true

  send(callback: (response: Response) => void) {
    const xhr = new XMLHttpRequest()
    xhr.open(this.method, this.url)
    xhr.timeout = this.timeout
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.withCredentials = this.withCredentials
    for (let key in this.header) {
      xhr.setRequestHeader(key, this.header[key])
    }
    // xhr.onreadystatechange = () => {
    //   switch (xhr.readyState) {
    //     case 1://OPENED
    //       //do something
    //       break
    //     case 2://HEADERS_RECEIVED
    //       //do something
    //       break
    //     case 3://LOADING
    //       //do something
    //       break
    //     case 4://DONE
    //       //do something
    //       break
    //   }
    // }
    xhr.ontimeout = () => {
      const response = new Response()
      response.status = -1
      response.request = this
      callback(response)
    }
    xhr.onload = () => {
      let data = null
      switch (xhr.responseType) {
        case 'document':
          data = xhr.responseXML
          break
        case 'json':
        case 'text':
          data = xhr.responseText
          break
        case 'arraybuffer':
        case 'blob':
        default:
          data = xhr.response
          break
      }

      const response = new Response()
      response.status = xhr.status
      response.data = data
      response.request = this
      const headers = xhr.getAllResponseHeaders()
      const arr = headers.trim().split(/[\r\n]+/)
      const headerMap = {}
      arr.forEach(function(line) {
        const parts = line.split(': ')
        const header = parts.shift()
        // @ts-ignore
        headerMap[header] = parts.join(': ')
      })
      response.header = headerMap
      callback(response)
    }
    const data = Object.keys(this.param)
      .map(key => `${key}=${this.param[key]}`)
      .join('&')
    xhr.send(data)
  }
}
