export class Environment {
  appName: string
  safeAreaBottom: number
  appVersion: string
  deviceHeight: string
  deviceWidth: string
  availableHeight: string
  statusBarHeight: number
  availableWidth: string
  osVersion: string
  platform: string
  scale: number
  remUEWidthInPixel: number
  remUEWidthInPixelRatio: number
  model: string
  extraParams: {
    [key: string]: string
  }

  constructor() {
    this.appName = ''
    this.safeAreaBottom = 0
    this.appVersion = ''
    this.deviceHeight = ((self != top)?document.body.offsetHeight:window.screen.height) + 'dp'
    this.deviceWidth = ((self != top)?document.body.offsetWidth:window.screen.width) + 'dp'
    this.availableHeight = ((self != top)?document.body.offsetHeight:window.screen.availHeight) + 'dp'
    this.availableWidth = ((self != top)?document.body.offsetHeight:window.screen.availWidth) + 'dp'
    this.statusBarHeight = 0
    this.osVersion = ''
    this.platform = 'web'
    this.scale = window.devicePixelRatio
    this.remUEWidthInPixel = 750
    this.remUEWidthInPixelRatio = 2
    this.model = ''
    this.extraParams = {
      system: 'iOS',
      brand: 'apple'
    }
  }
}
