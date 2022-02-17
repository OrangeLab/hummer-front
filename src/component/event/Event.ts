import { EventType, View } from '../view/View'

export abstract class Event {
  public target!: View | any

  abstract get type(): EventType
}

export interface EventListener {
  (event?: Event): void
}
