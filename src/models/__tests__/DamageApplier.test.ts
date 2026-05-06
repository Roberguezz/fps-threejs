import { describe, it, expect, vi } from 'vitest'
import { DamageApplier } from '../DamageApplier'
import { eventBus, GameEvents } from '../../core/Events'
import type { IHittable } from '../../shared/interfaces/IHittable'
import { Vector3 } from 'three'

describe('DamageApplier', () => {
	it('should react to ENEMY_HIT event and call takeDamage', () => {
		const applier = new DamageApplier()
		const mockTarget: IHittable = { takeDamage: vi.fn(), hp: 10 }

		eventBus.emit(GameEvents.ENEMY_HIT, {
			target: mockTarget,
			damage: 10,
			position: new Vector3(0, 0, 0)
		})

		expect(mockTarget.takeDamage).toHaveBeenCalledWith(10)
		applier.dispose()
	})

	it('should emit ENEMY_DEATH if hp reaches 0 after damage', () => {
		const applier = new DamageApplier()
		
		let targetHp = 10
		const mockTarget: IHittable = { 
			takeDamage: vi.fn((amount) => { targetHp -= amount }), 
			get hp() { return targetHp }
		}

		const deathSpy = vi.fn()
		eventBus.on(GameEvents.ENEMY_DEATH, deathSpy)

		eventBus.emit(GameEvents.ENEMY_HIT, {
			target: mockTarget,
			damage: 10,
			position: new Vector3(0, 0, 0)
		})

		expect(mockTarget.takeDamage).toHaveBeenCalledWith(10)
		expect(deathSpy).toHaveBeenCalledWith({ target: mockTarget })

		eventBus.off(GameEvents.ENEMY_DEATH, deathSpy)
		applier.dispose()
	})
})
