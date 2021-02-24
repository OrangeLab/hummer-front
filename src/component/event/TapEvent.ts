import { Event } from './Event'
import { EventType } from '../view/View'

export enum TapState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3,
  CANCELLED = 4
}

export class TapEvent extends Event {
  public position!: { x: number | string; y: number | string }
  public state!: TapState
  public timestamp!: string

  get type(): EventType {
    return 'tap'
  }
}
