export class Timer {
  private intervalTimer!: any
  private timeoutTimer!: any

  // 轮询间隔
  setInterval(callback: Function, time: number) {
    this.intervalTimer = setInterval(callback, time)
  }

  // 取消轮询
  clearInterval() {
    if (this.intervalTimer) {
      clearInterval(this.intervalTimer)
      this.intervalTimer = null
    }
  }

  // 设置超时
  setTimeout(callback: Function, timeout: number) {
    this.timeoutTimer = setTimeout(() => {
      callback()
      this.timeoutTimer = null
    }, timeout)
  }

  // 取消超时
  clearTimeout() {
    if (this.timeoutTimer) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = null
    }
  }
}
