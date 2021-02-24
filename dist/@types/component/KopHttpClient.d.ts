interface Request {
    apiName: string;
    params: {
        [key: string]: any;
    };
}
export declare const KopHttpClient: {
    post(req: Request, suc: Function, fail: Function): void;
    download(req: Request, suc: Function, fail: Function): void;
    upload(req: Request, suc: Function, fail: Function): void;
};
export {};
