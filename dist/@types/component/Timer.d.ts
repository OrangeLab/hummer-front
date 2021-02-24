export declare class Timer {
    private intervalTimer;
    private timeoutTimer;
    setInterval(callback: Function, time: number): void;
    clearInterval(): void;
    setTimeout(callback: Function, timeout: number): void;
    clearTimeout(): void;
}
