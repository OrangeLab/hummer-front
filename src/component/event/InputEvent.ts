import { Event } from './Event'
import { EventType } from '../view/View'

export enum InputState {
  NORMAL = 0,
  BEGAN = 1,
  CHANGED = 2,
  ENDED = 3
}

export class InputEvent extends Event {
  public text!: string
  public state!: InputState

  get type(): EventType {
    return 'input'
  }
}
