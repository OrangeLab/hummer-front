export declare const Location: {
    getLastLocation(callback: Function): void;
    startLocation(callback: Function, intervalTime: number, intervalDistance: number): void;
    stopLocation(): void;
    onError(callback: Function): void;
};
