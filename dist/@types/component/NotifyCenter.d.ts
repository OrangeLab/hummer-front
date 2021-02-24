export interface NotifyListener {
    (target: any): void;
}
export declare class NotifyCenter {
    private listeners;
    addEventListener(key: string, listener: NotifyListener): void;
    removeEventListener(key: string, listener: NotifyListener): void;
    triggerEvent(key: string, args: any): void;
}
