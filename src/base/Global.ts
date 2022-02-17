import { Environment } from './Environment'
import { NotifyCenter } from '../component/NotifyCenter'
import { getQueryVariable, inIframe, debounce,getBoxModelValue } from '../common/utils'

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
  private observer: any
  private targetNode: any
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
      this.isWebSimulator()
    })
  }
  private isWebSimulator() {
    if (inIframe()) {
      this.onScroll = debounce(this.onScroll, 200, false);
      this.elementhighlight = debounce(this.elementhighlight, 200, true);
      const ObserverFunc = window.MutationObserver || (window as any).WebkitMutationObserver;
      this.observer = new ObserverFunc((mutationsList, observer) => {
        this.elementhighlight()
      });
      window.onmessage = (e) => {
        (window as any).openElementMap = e.data
        if (e.data) {
          document.body.style.cursor = 'pointer'
          document.body.addEventListener("click", this.elementClick.bind(this), true);
          window.addEventListener("scroll", this.onScroll.bind(this))
        } else {
          this.observer.disconnect();
          document.body.style.cursor = 'default'
          document.body.removeEventListener("click", this.elementClick.bind(this), true);
          window.removeEventListener("scroll", this.onScroll.bind(this))
        }
      };
    }
  }
  private onScroll() {
    if (this.targetNode) {
      this.elementhighlight()
    }
  }
  private elementClick(e) {
    const config = { attributes: true, childList: true, subtree: true };
    e.preventDefault();
    e.stopImmediatePropagation();
    if (e.target?.__view_id && this.targetNode !== e.target) {
      let scroller = this.getScroller(e.target)
      this.observer.disconnect();
      this.targetNode = e.target
      this.elementhighlight()
      this.observer.observe(e.target, config);
      scroller&&this.observer.observe(scroller, config);
    }
  }
  private elementhighlight() {
    if (this.targetNode) {
      let nodeInfo = getBoxModelValue(this.targetNode)
      window.parent.postMessage(nodeInfo, "*");
    }
  }
  private getScroller(elem) {
    if (elem.parentNode?.className?.indexOf('hm-scroller-content') != -1 || elem.parentNode?.className?.indexOf('hm-list-content') != -1) {
      return elem.parentNode
    } else {
      return this.getScroller(elem.parentNode)
    }
  }
}
globalThis.Hummer = new HummerGlobal()
export const Hummer = new HummerGlobal()
