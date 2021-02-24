import { View } from './view/View';
export declare const Toast: {
    show: (msg: string, duration?: number) => void;
    custom: (view: View, duration?: number) => void;
};
export declare class Dialog {
    cancelable: boolean;
    alert(msg: string, btnText?: string, callback?: Function): void;
    confirm(title: string, msg: string, okBtnText: string, cancelBtnText: string, okCallback: Function, cancelCallback: Function): void;
    loading(msg: string): void;
    custom(view: View): void;
    dismiss(): void;
}
