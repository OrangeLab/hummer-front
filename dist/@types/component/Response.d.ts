import { Request } from './Request';
export declare class Response {
    status: number;
    header: {
        [key: string]: any;
    };
    data: any;
    request: Request;
}
