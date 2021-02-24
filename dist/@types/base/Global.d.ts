import { Environment } from './Environment';
import { NotifyCenter } from '../component/NotifyCenter';
export declare class HummerGlobal {
    setTitle(setTitle: string): any;
    setNavigationBarMode(mode: number): any;
    setNavigationBarColor(color: string): any;
    setScrollTracker(view: any, options: any): any;
    arWidgetDisplay(isDisplay: boolean): any;
    notifyCenter: NotifyCenter;
    env: Environment;
    pageInfo: {
        id?: string;
        url?: string;
        animated?: boolean;
        params?: any;
    };
    params: any;
    setBasicWidth(width: number): any;
    constructor();
    render(page: any): void;
}
export declare const Hummer: HummerGlobal;
