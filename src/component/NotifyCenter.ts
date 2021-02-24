export interface NotifyListener {
  (target: any): void
}

export class NotifyCenter {
  private listeners: { [key: string]: Array<NotifyListener> } = {}

  addEventListener(key: string, listener: NotifyListener) {
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    this.listeners[key].push(listener)
  }

  removeEventListener(key: string, listener: NotifyListener) {
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key].filter(
        _listener => _listener !== listener
      )
    }
  }

  triggerEvent(key: string, args: any) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(listener => {
        listener({ target: args })
      })
    }
  }
}
