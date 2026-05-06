import type { Vector3 } from 'three'
import type { IHittable } from './IHittable'

/**
 * Contrato para cualquier entidad enemiga del juego.
 * EnemyManager opera sobre IEnemy, no sobre Dummy directamente.
 */
export interface IEnemy extends IHittable {
	update(delta: number, playerPos: Vector3): void
}
