import { Vector3 } from 'three'

export const GameEvents = {
    PLAYER_SHOOT: 'PLAYER_SHOOT',
    ENEMY_HIT: 'ENEMY_HIT',
    ENEMY_DEATH: 'ENEMY_DEATH'
} as const

export type GameEvents = (typeof GameEvents)[keyof typeof GameEvents]

export interface PlayerShootEvent {
    position: Vector3
    direction: Vector3
}

export interface EnemyHitEvent {
    target: any // Debería ser algo que tenga salud
    damage: number
    position: Vector3
}

export interface EnemyDeathEvent {
    target: any
}

type EventMap = {
    [GameEvents.PLAYER_SHOOT]: PlayerShootEvent
    [GameEvents.ENEMY_HIT]: EnemyHitEvent
    [GameEvents.ENEMY_DEATH]: EnemyDeathEvent
}

type Callback<T> = (data: T) => void

export class EventEmitter {
    private listeners: Map<keyof EventMap, Callback<any>[]> = new Map()

    public on<K extends keyof EventMap>(event: K, callback: Callback<EventMap[K]>) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, [])
        }
        this.listeners.get(event)!.push(callback)
    }

    public off<K extends keyof EventMap>(event: K, callback: Callback<EventMap[K]>) {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            this.listeners.set(
                event,
                eventListeners.filter((cb) => cb !== callback)
            )
        }
    }

    public emit<K extends keyof EventMap>(event: K, data: EventMap[K]) {
        const eventListeners = this.listeners.get(event)
        if (eventListeners) {
            eventListeners.forEach((callback) => callback(data))
        }
    }

    public clear() {
        this.listeners.clear()
    }
}

export const eventBus = new EventEmitter()
