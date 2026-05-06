import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3, Object3D } from 'three'
import type { FPSScene } from '../../core/FPSScene'

export class Dummy extends Mesh {
	public isDummy = true
	public hp: number = 30
	private speed: number = 2
	private targetList: Object3D[]
	private scene: FPSScene

	private hitTimer: number = 0
	private readonly hitDuration: number = 0.1

	private static _direction = new Vector3()

	constructor(pos: Vector3, scene: FPSScene, targetList: Object3D[]) {
		const geo = new BoxGeometry(1, 2, 1)
		const mat = new MeshStandardMaterial({ color: 0xff4444 })
		super(geo, mat)

		this.position.copy(pos)
		this.scene = scene
		this.targetList = targetList

		this.scene.add(this)
		this.targetList.push(this)
	}

	public update(delta: number, playerPos: Vector3) {
		const direction = Dummy._direction.subVectors(playerPos, this.position)
		direction.y = 0

		if (direction.lengthSq() > 1) {
			direction.normalize()
			this.position.addScaledVector(direction, this.speed * delta)
			this.lookAt(playerPos.x, this.position.y, playerPos.z)
		}

		if (this.hitTimer > 0) {
			this.hitTimer -= delta
			if (this.hitTimer <= 0) {
				; (this.material as MeshStandardMaterial).color.set(0xff4444)
			}
		}
	}

	public takeDamage(amount: number) {
		this.hp -= amount

		const mat = this.material as MeshStandardMaterial
		mat.color.set(0xffffff)
		this.hitTimer = this.hitDuration

		if (this.hp <= 0) {
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
