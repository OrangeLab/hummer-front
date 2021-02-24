export declare class Environment {
    appName: string;
    safeAreaBottom: number;
    appVersion: string;
    deviceHeight: string;
    deviceWidth: string;
    availableHeight: string;
    statusBarHeight: number;
    availableWidth: string;
    osVersion: string;
    platform: string;
    scale: number;
    remUEWidthInPixel: number;
    remUEWidthInPixelRatio: number;
    model: string;
    extraParams: {
        [key: string]: string;
    };
    constructor();
}
