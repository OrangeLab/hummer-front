import { Event } from './Event'
import { EventType } from '../view/View'

export enum LongPressState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3,
  CANCELLED = 4
}

export class LongPressEvent extends Event {
  public state!: LongPressState
  public timestamp!: string

  get type(): EventType {
    return 'longPress'
  }
}
