import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scene, Vector3 } from 'three'
import { DamageNumberView } from '../DamageNumberView'
import { eventBus, GameEvents } from '../../../core/Events'
import type { IHittable } from '../../../shared/interfaces/IHittable'

describe('DamageNumberView', () => {
	let scene: Scene
	let view: DamageNumberView

	beforeEach(() => {
		// Mock Canvas context
		vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
			fillText: vi.fn(),
			strokeText: vi.fn(),
			measureText: vi.fn(() => ({ width: 0 }))
		} as any)

		scene = new Scene()
		view = new DamageNumberView(scene)
	})

	it('should spawn a marker and cache the texture', () => {
		view.spawn(new Vector3(0, 0, 0), 10)

		expect(view.markers.length).toBe(1)
		expect(view.textureCache.has(10)).toBe(true)
	})

	it('should reuse texture from cache for same damage amount', () => {
		view.spawn(new Vector3(0, 0, 0), 10)
		const firstTexture = view.textureCache.get(10)

		view.spawn(new Vector3(1, 1, 1), 10)
		const secondTexture = view.textureCache.get(10)

		expect(firstTexture).toBe(secondTexture)
		expect(view.textureCache.size).toBe(1)
	})

	it('should remove marker after life expires', () => {
		view.spawn(new Vector3(0, 0, 0), 10)

		// Simular 1.1 segundos (vida es 1.0)
		view.update(1.1)

		expect(view.markers.length).toBe(0)
		expect(scene.children.length).toBe(0)
	})

	it('should react to ENEMY_HIT event and spawn visual markers', () => {
		const spy = vi.spyOn(view, 'spawn')
		const mockTarget: IHittable = { takeDamage: vi.fn(), hp: 10 }

		eventBus.emit(GameEvents.ENEMY_HIT, {
			target: mockTarget,
			damage: 15,
			position: new Vector3(0, 0, 0)
		})

		expect(spy).toHaveBeenCalledWith(new Vector3(0, 0, 0), 15)
	})
})
