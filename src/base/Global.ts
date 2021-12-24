import { Environment } from './Environment'
import { NotifyCenter } from '../component/NotifyCenter'
import { getQueryVariable } from '../common/utils'

export class HummerGlobal {
  setTitle(setTitle: string): any { }
  setNavigationBarMode(mode: number): any { }
  setNavigationBarColor(color: string): any { }
  setScrollTracker(view: any, options: any): any { }
  arWidgetDisplay(isDisplay: boolean): any { }
  notifyCenter: NotifyCenter
  env: Environment
  pageInfo: any
  params: any
  setBasicWidth(width: number): any { }

  constructor() {
    this.notifyCenter = new NotifyCenter()
    this.env = new Environment()
    getQueryVariable('pageInfo')
    this.pageInfo = JSON.parse(decodeURIComponent(getQueryVariable('pageInfo') || '{}'))
  }
  render(page: any) {
    window.addEventListener('load', () => {
      const body = document.getElementsByTagName('body')[0]
      body.appendChild(page.node)
      const event = new CustomEvent('render-ready', {})
      window.dispatchEvent(event)
    })
  }
}
globalThis.Hummer = new HummerGlobal()
export const Hummer = new HummerGlobal()
