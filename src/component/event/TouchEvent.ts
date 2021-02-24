import { Event } from './Event'
import { EventType } from '../view/View'

export enum TouchState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3,
  CANCELLED = 4
}

export class TouchEvent extends Event {
  public position!: { x: number; y: number }
  public state!: TouchState
  public timestamp!: string

  get type(): EventType {
    return 'touchDown'
  }
}
