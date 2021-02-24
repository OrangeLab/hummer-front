import { Event } from './Event'
import { EventType } from '../view/View'

export enum ScrollState {
  NORMAL = 0,
  BEGAN = 1,
  SCROLL = 2,
  ENDED = 3,
  SCROLL_UP = 4
}

export class ScrollEvent extends Event {
  public state!: ScrollState
  public offsetX!: number
  public offsetY!: number
  public dx!: number
  public dy!: number
  public timestamp!: string

  get type(): EventType {
    return 'scroll'
  }
}
