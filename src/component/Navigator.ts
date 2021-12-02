interface Ioptions {
  url: string;
  params: object;
  animated: boolean;
  id: string;
  closeSelf: boolean;
}
export const Navigator = {
  openPage: (options: Ioptions, callback?: Function) => {
    let url = ''
    let cloneOptions = JSON.parse(JSON.stringify(options))
    if (cloneOptions.url.match(/^(hummer:\/\/||http||.\/).*.js$/g)) {
      cloneOptions.url = `http://${window.location.host}${cloneOptions.url.match(/\/.[a-zA-Z]*.js$/g)[0].split('.')[0]}`
      url = `${cloneOptions.url}?pageInfo=${encodeURIComponent(JSON.stringify(cloneOptions))}`
    } else if (cloneOptions.url.match(/^http.*/g)) {
      url = cloneOptions.url
    }
    if (cloneOptions.closeSelf) {
      location.replace(url)
    } else {
      location.assign(url)
    }
    callback();
  },
  popPage: (options?: any) => {
    history.go(-1);
  },
  popToPage: (options?: any) => { 
    // 暂不支持
  },
  popToRootPage: (options?: any) => {
    var historyLen = history.length;
    history.go(-(historyLen - 1));
  },
  popBack: (count: number, options?: any) => {
    history.go(-`${count}`);
  }
}
// @ts-ignore
globalThis.Navigator = Navigator