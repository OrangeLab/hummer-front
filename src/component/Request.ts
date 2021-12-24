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
  public withCredentials: boolean = false

  send(callback: (response: Response) => void) {
    const xhr = new XMLHttpRequest()
    if(this.method === 'GET') {
      let getData = ''
      for(var str in this.param){ 
        getData +=str+'='+this.param[str] + '&'
      }
      getData = getData.substring(0, getData.length - 1);
      if(this.url.indexOf('?')>=0){
        this.url = `${this.url}&${getData}`
      } else {
        this.url = `${this.url}?${getData}`
      }
    }
    xhr.open(this.method, this.url)
    xhr.timeout = this.timeout
    if (this.method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    }
    xhr.withCredentials = this.withCredentials
    for (let key in this.header) {
      xhr.setRequestHeader(key, this.header[key])
    }
    xhr.ontimeout = () => {
      const response = new Response()
      response.status = -1
      response.request = this
      callback(response)
    }
    xhr.onerror = (e)=>{ 

     };
    xhr.onload = (e) => {
      console.log(e)
      let data = null
      switch (xhr.responseType) {
        case 'document':
          data = xhr.responseXML
          break
        case 'json':
        case 'text':
          try {
            data = JSON.parse(xhr.responseText)
          } catch (e) {
            data = xhr.response
          }
          break
        case 'arraybuffer':
        case 'blob':
        default:
          try {
            data = JSON.parse(xhr.response)
          } catch (e) {
            data = xhr.response
          }
          break
      }
      const response = new Response()
      response.status = xhr.status
      response.data = data
      response.message = xhr.statusText
      response.error = {
        code: 0
      }
      if (xhr.status !== 200) {
        response.error = {
          code: xhr.status,
          msg: xhr.statusText,
        }
        response.message = xhr.statusText
      }
      response.request = this
      const headers = xhr.getAllResponseHeaders()
      const arr = headers.trim().split(/[\r\n]+/)
      const headerMap = {}
      arr.forEach(function (line) {
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
// @ts-ignore
globalThis.Request = Request

