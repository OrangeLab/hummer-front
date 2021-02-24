export declare const WebSocket: {
    connect(url: string): void;
    close(code: any, reason: any): void;
    send(data: any): void;
    onopen(callback: Function): void;
    onOpen(callback: Function): void;
    onclose(callback: Function): void;
    onClose(callback: Function): void;
    onerror(callback: Function): void;
    onError(callback: Function): void;
    onmessage(callback: Function): void;
    onMessage(callback: Function): void;
};
