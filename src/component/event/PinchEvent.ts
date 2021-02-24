import { Event } from './Event'
import { EventType } from '../view/View'

export enum PinchState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3,
  CANCELLED = 4
}

export class PinchEvent extends Event {
  public state!: PinchState
  public scale!: number
  public timestamp!: string

  get type(): EventType {
    return 'pinch'
  }
}
