import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3, Object3D } from 'three'
import type { FPSScene } from '../../core/FPSScene'
import type { IEnemy } from '../../shared/interfaces/IEnemy'
import { DummyModel } from './DummyModel'

/**
 * Vista del enemigo Dummy.
 * Extiende Mesh para ser el objeto colisionable de la escena.
 * Delega toda la lógica de juego a DummyModel.
 */
export class Dummy extends Mesh implements IEnemy {
	public isDummy = true
	private model: DummyModel
	private targetList: Object3D[]
	private scene: FPSScene

	constructor(pos: Vector3, scene: FPSScene, targetList: Object3D[]) {
		const geo = new BoxGeometry(1, 2, 1)
		const mat = new MeshStandardMaterial({ color: 0xff4444 })
		super(geo, mat)

		this.model = new DummyModel()
		this.position.copy(pos)
		this.scene = scene
		this.targetList = targetList

		this.scene.add(this)
		this.targetList.push(this)
	}

	// Delegado a DummyModel para cumplir IHittable
	public get hp(): number {
		return this.model.hp
	}

	public update(delta: number, playerPos: Vector3) {
		// Delegar cálculo de movimiento al modelo
		const movement = this.model.computeMovement(delta, this.position, playerPos)
		if (movement) {
			this.position.add(movement)
			this.lookAt(playerPos.x, this.position.y, playerPos.z)
		}

		// Vista: restaurar color cuando el timer de impacto expira
		const hitExpired = this.model.decrementHitTimer(delta)
		if (hitExpired) {
			; (this.material as MeshStandardMaterial).color.set(0xff4444)
		}
	}

	public takeDamage(amount: number) {
		this.model.takeDamage(amount)

		// Vista: feedback visual de impacto (color blanco)
		const mat = this.material as MeshStandardMaterial
		mat.color.set(0xffffff)

		if (this.model.isDead()) {
			this.die()
		}
	}

	private die() {
		this.scene.remove(this)
		const index = this.targetList.indexOf(this)
		if (index > -1) {
			this.targetList.splice(index, 1)
		}
	}
}
