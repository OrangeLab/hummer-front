import { Event } from './Event'
import { EventType } from '../view/View'

export interface SwitchEventListener {
  (event?: SwitchEvent): void
}

export class SwitchEvent extends Event {
  public state!: Boolean

  get type(): EventType {
    return 'switch'
  }
}
