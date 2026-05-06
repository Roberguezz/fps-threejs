import { Vector3 } from 'three'
import type { IHittable } from '../shared/interfaces/IHittable'

/**
 * Estado y lógica pura del enemigo Dummy.
 * Sin imports de Three.js pesados (Mesh, Geometry, Material).
 * Esta clase no sabe nada de renderizado.
 */
export class DummyModel implements IHittable {
	public hp: number = 30
	private speed: number = 2

	private hitTimer: number = 0
	readonly hitDuration: number = 0.1

	private static _direction = new Vector3()

	/**
	 * Calcula el movimiento del Dummy hacia el jugador.
	 * @returns La dirección normalizada si debe moverse, null si ya está suficientemente cerca.
	 */
	public computeMovement(delta: number, currentPos: Vector3, playerPos: Vector3): Vector3 | null {
		const direction = DummyModel._direction.subVectors(playerPos, currentPos)
		direction.y = 0

		if (direction.lengthSq() > 1) {
			direction.normalize()
			return direction.clone().multiplyScalar(this.speed * delta)
		}

		return null
	}

	public takeDamage(amount: number): void {
		this.hp -= amount
		this.hitTimer = this.hitDuration
	}

	public isDead(): boolean {
		return this.hp <= 0
	}

	/**
	 * Decrementa el temporizador de impacto.
	 * @returns true cuando el timer acaba de llegar a 0 (momento de restaurar color)
	 */
	public decrementHitTimer(delta: number): boolean {
		if (this.hitTimer > 0) {
			this.hitTimer -= delta
			return this.hitTimer <= 0
		}
		return false
	}

	public isFlashing(): boolean {
		return this.hitTimer > 0
	}
}
