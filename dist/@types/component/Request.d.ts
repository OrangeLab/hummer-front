import { Response } from './Response';
export declare class Request {
    url: string;
    method: 'GET' | 'POST';
    timeout: number;
    header: {
        [key: string]: any;
    };
    param: {
        [key: string]: any;
    };
    withCredentials: boolean;
    send(callback: (response: Response) => void): void;
}
