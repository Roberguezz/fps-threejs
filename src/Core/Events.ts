import mitt from 'mitt'
import { Vector3 } from 'three'
import type { IHittable } from '../shared/interfaces/IHittable'

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
	target: IHittable // Debería ser algo que tenga salud
	damage: number
	position: Vector3
}

export interface EnemyDeathEvent {
	target: IHittable
}

export type EventMap = {
	[GameEvents.PLAYER_SHOOT]: PlayerShootEvent
	[GameEvents.ENEMY_HIT]: EnemyHitEvent
	[GameEvents.ENEMY_DEATH]: EnemyDeathEvent
}

export const eventBus = mitt<EventMap>()
