import { Event } from './Event'
import { EventType } from '../view/View'

export enum PanState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3,
  CANCELLED = 4
}

export class PanEvent extends Event {
  public state!: PanState
  public translation!: { deltaX: number | string; deltaY: number | string }
  public timestamp!: string

  get type(): EventType {
    return 'pan'
  }
}
