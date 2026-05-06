import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Vector3, Object3D } from 'three'
import { Dummy } from '../Dummy'
import { FPSScene } from '../../views/FPSScene'

describe('Dummy', () => {
	let scene: FPSScene
	let targetList: Object3D[]
	let dummy: Dummy

	beforeEach(() => {
		scene = new FPSScene()
		targetList = []
		dummy = new Dummy(new Vector3(0, 0, 0), scene, targetList)
	})

	it('should initialize with correct HP', () => {
		expect(dummy.hp).toBe(30)
		expect(dummy.isDummy).toBe(true)
	})

	it('should be added to scene and targetList on creation', () => {
		expect(scene.children).toContain(dummy)
		expect(targetList).toContain(dummy)
	})

	it('should take damage correctly', () => {
		dummy.takeDamage(10)
		expect(dummy.hp).toBe(20)
	})

	it('should die when HP reaches 0', () => {
		const dieSpy = vi.spyOn(dummy as any, 'die')
		dummy.takeDamage(10) // 20
		dummy.takeDamage(10) // 10
		dummy.takeDamage(10) // 0
		expect(dieSpy).toHaveBeenCalled()
	})

	it('should be removed from scene and targetList when dead', () => {
		dummy.takeDamage(30)
		expect(scene.children).not.toContain(dummy)
		expect(targetList).not.toContain(dummy)
	})
})
