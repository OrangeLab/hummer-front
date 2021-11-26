import { View } from './view/View'
import { Image } from './view/Image'
export class Toast {
  customView?: View
  toastTimer?:any
  constructor() {
    this.customView = new View
    this.customView.node.classList.add('hm-default-toast')
    document.body.appendChild(this.customView.node)
  }
  show(msg: string, duration?: number) {
    let that = this
    that.customView.removeAll()
    clearTimeout(that.toastTimer)
    that.customView.node.innerHTML = msg
    that.customView.style.display = 'flex'
    that.customView.style.opacity = 1
    that.toastTimer = setTimeout(() => {
      that.customView.node.addEventListener('transitionend',that.hide.bind(that))
      that.customView.style.opacity = 0
    }, duration || 2000)
  }
  custom(view: View, duration?: number) {
    let that = this
    that.customView.removeAll()
    clearTimeout(that.toastTimer)
    that.customView.node.innerHTML = view
    that.customView.style.display = 'flex'
    that.customView.style.opacity = 1
    that.toastTimer = setTimeout(() => {
      that.customView.node.addEventListener('transitionend',that.hide.bind(that))
      that.customView.style.opacity = 0
    }, duration || 2000)
  }
  private hide(){
    this.customView.style.display = 'none'
    this.customView.node.removeEventListener('transitionend',this.hide,false);
  }
}

export class Dialog {
  cancelable?: boolean = true
  customView?: View
  alertView?: View
  alertViewMsg?: View
  alertViewBtn?: View
  loadingView?: View
  loadingViewIcon?: Image
  loadingViewText?: View
  confirmView?: View
  confirmViewText?: View
  confirmViewOkBtn?: View
  confirmViewCancelBtn?: View
  constructor() {
    this.customView = new View

    this.alertView = new View
    this.alertViewMsg = new View
    this.alertViewBtn = new View

    this.loadingView = new View
    this.loadingViewIcon = new Image
    this.loadingViewText = new View

    this.confirmView = new View
    this.confirmViewText = new View
    this.confirmViewOkBtn = new View
    this.confirmViewCancelBtn = new View

    this.customView.node.classList.add('hm-default-dialog')

    this.alertView.node.classList.add('hm-default-alert-box')
    this.alertViewMsg.node.classList.add('hm-default-alert-msg')
    this.alertViewBtn.node.classList.add('hm-default-alert-btn')

    this.loadingView.node.classList.add('hm-default-loading')
    this.loadingViewIcon.node.classList.add('hm-default-loading-icon')
    this.loadingViewIcon.src = 'https://pt-starimg.didistatic.com/static/starimg/img/MQnSutHeKH1637821723847.png'
    this.loadingViewIcon.style.resize = 'cover'

    this.confirmView.node.classList.add('hm-default-alert-box')
    this.confirmViewText.node.classList.add('hm-default-confirm-view-text')
    this.confirmViewOkBtn.node.classList.add('hm-default-confirm-view-okBtn')
    this.confirmViewCancelBtn.node.classList.add('hm-default-confirm-view-cancelBtn')

    document.body.appendChild(this.customView.node)
    this.customView.node.ontouchend = (e) => {
      if (e.target === this.customView.node) {
        this.cancelable && this.dismiss()
      }
    }
  }
  alert(msg: string, btnText?: string, callback?: Function) {
    this.customView.removeAll()
    this.alertViewMsg.node.innerHTML = msg
    this.alertViewBtn.node.innerHTML = btnText || '确定'
    this.customView.node.children.length === 0 && this.customView.appendChild(this.alertView)
    this.alertView.node.children.length === 0 && (this.alertView.appendChild(this.alertViewMsg), this.alertView.appendChild(this.alertViewBtn))
    this.customView.style.display = 'block'
    this.alertViewBtn.node.onclick = () => {
      this.dismiss()
      callback()
    }
  }
  confirm(
    title: string,
    msg: string,
    okBtnText: string,
    cancelBtnText: string,
    okCallback: Function,
    cancelCallback: Function
  ) {
    this.customView.removeAll()
    this.alertViewMsg.node.innerHTML = title
    this.confirmViewText.node.innerHTML = msg
    this.confirmViewOkBtn.node.innerHTML = okBtnText || '确认'
    this.confirmViewCancelBtn.node.innerHTML = cancelBtnText || '取消'
    this.customView.node.children.length === 0 && this.customView.appendChild(this.confirmView)
    this.confirmView.node.children.length === 0 && (this.confirmView.appendChild(this.alertViewMsg), this.confirmView.appendChild(this.confirmViewText), this.confirmView.appendChild(this.alertViewBtn))
    this.alertViewBtn.node.children.length === 0 && (this.alertViewBtn.appendChild(this.confirmViewCancelBtn), this.alertViewBtn.appendChild(this.confirmViewOkBtn))
    this.customView.style.display = 'block'
    this.confirmViewOkBtn.node.onclick = () => {
      this.dismiss()
      okCallback()
    }
    this.confirmViewCancelBtn.node.onclick = () => {
      this.dismiss()
      cancelCallback()
    }
  }
  loading(msg: string) {
    this.customView.removeAll()
    this.loadingViewText.node.innerHTML = msg || 'loading...'
    this.customView.node.children.length === 0 && this.customView.appendChild(this.loadingView)
    this.loadingView.node.children.length === 0 && (this.loadingView.appendChild(this.loadingViewIcon), this.loadingView.appendChild(this.loadingViewText))
    this.customView.style.display = 'block'
  }
  custom(view: View) {
    this.customView.removeAll()
    this.customView.node.children.length === 0 && this.customView.appendChild(view)
    this.customView.style.display = 'block'
  }
  dismiss() {
    this.customView && (this.customView.style.display = 'none')
  }
}
globalThis.Dialog = Dialog
globalThis.Toast = new Toast()
