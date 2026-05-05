import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Vector3, Scene, Object3D } from 'three'
import { Dummy } from '../Dummy'

describe('Dummy', () => {
    let scene: Scene
    let targetList: Object3D[]
    let dummy: Dummy

    beforeEach(() => {
        scene = new Scene()
        targetList = []
        dummy = new Dummy(new Vector3(0, 0, 0), scene, targetList)
    })

    it('should initialize with correct HP', () => {
        expect(dummy['hp']).toBe(3)
        expect(dummy.isDummy).toBe(true)
    })

    it('should be added to scene and targetList on creation', () => {
        expect(scene.children).toContain(dummy)
        expect(targetList).toContain(dummy)
    })

    it('should take damage correctly', () => {
        dummy.takeDamage()
        expect(dummy['hp']).toBe(2)
    })

    it('should die when HP reaches 0', () => {
        const dieSpy = vi.spyOn(dummy as any, 'die')
        dummy.takeDamage() // 2
        dummy.takeDamage() // 1
        dummy.takeDamage() // 0
        expect(dieSpy).toHaveBeenCalled()
    })

    it('should be removed from scene and targetList when dead', () => {
        dummy.takeDamage()
        dummy.takeDamage()
        dummy.takeDamage()
        expect(scene.children).not.toContain(dummy)
        expect(targetList).not.toContain(dummy)
    })
})
