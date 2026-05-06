import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scene, Vector3, Object3D } from 'three'
import { ProjectileManager } from '../ProjectileManager'
import { eventBus, GameEvents } from '../../core/Events'

describe('ProjectileManager', () => {
	let scene: Scene
	let manager: ProjectileManager
	let targets: Object3D[]

	beforeEach(() => {
		scene = new Scene()
		manager = new ProjectileManager(scene)
		targets = []

		// Mockear el Raycaster de Three.js
		// @ts-ignore
		manager['raycaster'] = {
			set: vi.fn(),
			intersectObjects: vi.fn().mockReturnValue([])
		}
	})

	it('should spawn a projectile and react to PLAYER_SHOOT event', () => {
		const spy = vi.spyOn(manager, 'spawn')

		eventBus.emit(GameEvents.PLAYER_SHOOT, {
			position: new Vector3(0, 0, 0),
			direction: new Vector3(0, 0, -1)
		})

		expect(spy).toHaveBeenCalled()
		expect(manager['projectiles'].length).toBe(1)
		expect(scene.children.length).toBe(1)
	})

	it('should move projectiles when updating', () => {
		manager.spawn(new Vector3(0, 0, 0), new Vector3(0, 0, -1))
		manager.update(0.1, targets)

		const p = manager['projectiles'][0]
		expect(p.mesh.position.z).toBeLessThan(0) // Se movió hacia adelante (-Z)
	})

	it('should remove expired projectiles', () => {
		manager.spawn(new Vector3(0, 0, 0), new Vector3(0, 0, -1))

		// Simular pasar el maxLife (2.0s) en pasos de 0.1s para no saturar el clamp
		for(let i = 0; i < 21; i++) {
			manager.update(0.1, targets)
		}

		expect(manager['projectiles'].length).toBe(0)
		expect(scene.children.length).toBe(0)
	})
})
