export const Memory = {
  set(key: any, value: any): void {
    sessionStorage.setItem(key, value);
  },
  get(key: any): string {
    return sessionStorage.getItem(key);
  },
  getAll(): object {
    let sessionKeys: Array<any> = Object.keys(sessionStorage)
    let sessionAll: object = {}
    sessionKeys.forEach((item) => {
      sessionAll[item] = sessionStorage.getItem(item)
    })
    return sessionAll;
  },
  remove(key: any): void {
    sessionStorage.removeItem(key)
  },
  removeAll(): void {
    sessionStorage.clear()
  },
  exist(key: any): boolean {
    return !(sessionStorage.getItem(key) == null);
  }
}
