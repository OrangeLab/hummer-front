export const Storage = {
  set(key: any, value: any): void {
    localStorage.setItem(key, value);
  },
  get(key: any): string {
    return localStorage.getItem(key);
  },
  getAll(): object {
    let storageKeys: Array<any> = Object.keys(localStorage)
    let storageAll: object = {}
    storageKeys.forEach((item) => {
      storageAll[item] = localStorage.getItem(item)
    })
    return storageAll;
  },
  remove(key: any): void {
    localStorage.removeItem(key)
  },
  removeAll(): void {
    localStorage.clear()
  },
  exist(key: any): boolean {
    return !(localStorage.getItem(key) == null);
  }
}