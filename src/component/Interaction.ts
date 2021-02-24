import { View } from './view/View'

export const Toast = {
  show: (msg: string, duration?: number) => {},
  custom: (view: View, duration?: number) => {}
}

export class Dialog {
  cancelable!: boolean
  alert(msg: string, btnText?: string, callback?: Function) {}
  confirm(
    title: string,
    msg: string,
    okBtnText: string,
    cancelBtnText: string,
    okCallback: Function,
    cancelCallback: Function
  ) {}
  loading(msg: string) {}
  custom(view: View) {}
  dismiss() {}
}
