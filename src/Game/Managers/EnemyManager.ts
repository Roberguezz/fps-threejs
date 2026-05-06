import { Object3D, Vector3 } from 'three'
import type { FPSScene } from '../../core/FPSScene'
import { Dummy } from '../entities/Dummy'

export class EnemyManager {
	private enemies: Dummy[] = []
	private spawnTimer: number = 0
	private spawnRate: number = 3
	private scene: FPSScene
	private targetList: Object3D[]

	constructor(scene: FPSScene, targetList: Object3D[]) {
		this.scene = scene
		this.targetList = targetList
	}

	public update(delta: number, playerPos: Vector3) {
		// 1. Spawn de enemigos
		this.spawnTimer += delta
		if (this.spawnTimer >= this.spawnRate) {
			this.spawnEnemy()
			this.spawnTimer = 0
		}

		// 2. Actualizar cada enemigo vivo
		for (let i = this.enemies.length - 1; i >= 0; i--) {
			const enemy = this.enemies[i]

			// Si el enemigo ha muerto (ya no tiene padre en la escena)
			if (!enemy.parent) {
				this.enemies.splice(i, 1)
				continue
			}

			enemy.update(delta, playerPos)
		}
	}

	private spawnEnemy() {
		// Aparecer en un radio aleatorio lejos del jugador
		const angle = Math.random() * Math.PI * 2
		const radius = 20 // Aparecen a 20 metros
		const x = Math.cos(angle) * radius
		const z = Math.sin(angle) * radius

		const pos = new Vector3(x, 1, z)
		const newEnemy = new Dummy(pos, this.scene, this.targetList)
		this.enemies.push(newEnemy)
	}
}
