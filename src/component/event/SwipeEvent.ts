import { Event } from './Event'
import { EventType } from '../view/View'

export enum SwipeState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3,
  CANCELLED = 4
}

export class SwipeEvent extends Event {
  public state!: SwipeState
  public direction!: 'left' | 'right' | 'up' | 'down'
  public timestamp!: string

  get type(): EventType {
    return 'swipe'
  }
}
