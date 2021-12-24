import { Request } from './Request'

export class Response {
  public status!: number
  public header!: { [key: string]: any }
  public data!: any
  public error!:any
  public message!: any
  public request!: Request
}
