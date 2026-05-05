import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scene, Vector3 } from 'three'
import { DamageManager } from '../Managers/DamageManager'

describe('DamageManager', () => {
    let scene: Scene
    let manager: DamageManager

    beforeEach(() => {
        // Mock Canvas context
        vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
            fillText: vi.fn(),
            strokeText: vi.fn(),
            measureText: vi.fn(() => ({ width: 0 })),
        } as any)

        scene = new Scene()
        manager = new DamageManager(scene)
    })

    it('should spawn a marker and cache the texture', () => {
        manager.spawn(new Vector3(0, 0, 0), 10)
        
        expect(manager['markers'].length).toBe(1)
        expect(manager['textureCache'].has(10)).toBe(true)
    })

    it('should reuse texture from cache for same damage amount', () => {
        manager.spawn(new Vector3(0, 0, 0), 10)
        const firstTexture = manager['textureCache'].get(10)
        
        manager.spawn(new Vector3(1, 1, 1), 10)
        const secondTexture = manager['textureCache'].get(10)
        
        expect(firstTexture).toBe(secondTexture)
        expect(manager['textureCache'].size).toBe(1)
    })

    it('should remove marker after life expires', () => {
        manager.spawn(new Vector3(0, 0, 0), 10)
        
        // Simular 1.1 segundos (vida es 1.0)
        manager.update(1.1)
        
        expect(manager['markers'].length).toBe(0)
        expect(scene.children.length).toBe(0)
    })
})
