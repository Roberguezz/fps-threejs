import { Sprite, SpriteMaterial, CanvasTexture, Scene, Vector3 } from 'three'
import { eventBus, GameEvents } from '../core/Events'
import type { EnemyHitEvent } from '../core/Events'

/**
 * Responsable exclusivamente de renderizar los números de daño flotantes.
 * Sin lógica de juego. Pura vista Three.js.
 */
export class DamageNumbers {
	private scene: Scene
	public markers: { sprite: Sprite; velocity: Vector3; life: number }[] = []
	public textureCache: Map<number, CanvasTexture> = new Map()

	constructor(scene: Scene) {
		this.scene = scene

		// Escuchar impactos para spawnear número de daño
		this.onEnemyHit = this.onEnemyHit.bind(this)
		eventBus.on(GameEvents.ENEMY_HIT, this.onEnemyHit)
	}

	private onEnemyHit(data: EnemyHitEvent) {
		const { damage, position } = data

		// 2. Lógica visual: Spawnear número de daño
		this.spawn(position, damage)
	}

	public spawn(position: Vector3, amount: number) {
		let texture = this.textureCache.get(amount)

		if (!texture) {
			const canvas = document.createElement('canvas')
			canvas.width = 128
			canvas.height = 128
			const ctx = canvas.getContext('2d')!

			ctx.font = 'Bold 60px Arial'
			ctx.fillStyle = 'yellow'
			ctx.strokeStyle = 'black'
			ctx.lineWidth = 6
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.strokeText(amount.toString(), 64, 64)
			ctx.fillText(amount.toString(), 64, 64)

			texture = new CanvasTexture(canvas)
			this.textureCache.set(amount, texture)
		}

		const material = new SpriteMaterial({
			map: texture,
			transparent: true,
			depthTest: false
		})
		const sprite = new Sprite(material)

		sprite.position.copy(position)
		sprite.position.y += 1
		sprite.scale.set(1.5, 1.5, 1)

		this.scene.add(sprite)

		this.markers.push({
			sprite: sprite,
			velocity: new Vector3((Math.random() - 0.5) * 0.5, 2, (Math.random() - 0.5) * 0.5),
			life: 1.0
		})
	}

	public update(delta: number) {
		for (let i = this.markers.length - 1; i >= 0; i--) {
			const m = this.markers[i]
			m.life -= delta

			if (m.life <= 0) {
				this.scene.remove(m.sprite)
				m.sprite.material.dispose()
				this.markers.splice(i, 1)
				continue
			}

			m.sprite.position.addScaledVector(m.velocity, delta)
			m.sprite.material.opacity = m.life
		}
	}

	public dispose() {
		eventBus.off(GameEvents.ENEMY_HIT, this.onEnemyHit)
	}
}
