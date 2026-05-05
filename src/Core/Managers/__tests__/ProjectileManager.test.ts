import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scene, Vector3, BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { ProjectileManager } from '../ProjectileManager'

describe('ProjectileManager', () => {
    let scene: Scene
    let manager: ProjectileManager

    beforeEach(() => {
        // Mock DOM element for hitmarker
        document.body.innerHTML = '<div id="hitmarker"></div>'
        scene = new Scene()
        manager = new ProjectileManager(scene)
    })

    it('should spawn a projectile', () => {
        const startPos = new Vector3(0, 0, 0)
        const dir = new Vector3(0, 0, -1)
        manager.spawn(startPos, dir)

        expect(manager['projectiles'].length).toBe(1)
        expect(scene.children.length).toBe(1)
    })

    it('should remove projectile after lifetime expires', () => {
        manager.spawn(new Vector3(0, 0, 0), new Vector3(0, 0, -1))

        // Simular el paso del tiempo. Como hay un cap de 0.1 en ProjectileManager,
        // necesitamos llamar a update varias veces o simplemente pasar muchos deltas pequeños.
        for (let i = 0; i < 25; i++) {
            manager.update(0.1, [])
        }

        expect(manager['projectiles'].length).toBe(0)
        expect(scene.children.length).toBe(0)
    })

    it('should detect collision and trigger damage', () => {
        // Usar un Mesh con geometría para que el Raycaster pueda detectarlo
        const target = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
        target.position.set(0, 0, -2)
        scene.add(target) // Añadir a la escena es buena práctica
        target.updateMatrixWorld() // Necesario para que el Raycaster lo vea sin esperar al render
            ; (target as any).isDummy = true
            ; (target as any).takeDamage = vi.fn()

        manager.spawn(new Vector3(0, 0, 0), new Vector3(0, 0, -1))

        // Actualizamos. Con delta 0.1 y speed 50, recorre 5 unidades.
        // Debe chocar con el objeto en z=-2.
        manager.update(0.1, [target])

        expect((target as any).takeDamage).toHaveBeenCalled()
        expect(manager['projectiles'].length).toBe(0)
    })
})
