import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scene, Vector3, BoxGeometry, Mesh, MeshStandardMaterial } from 'three'
import { ProjectileManager } from '../ProjectileManager'
import { eventBus, GameEvents } from '../../../core/Events'

describe('ProjectileManager', () => {
    let scene: Scene
    let manager: ProjectileManager

    beforeEach(() => {
        scene = new Scene()
        manager = new ProjectileManager(scene)
    })

    it('should spawn a projectile when PLAYER_SHOOT event is emitted', () => {
        const startPos = new Vector3(0, 0, 0)
        const dir = new Vector3(0, 0, -1)

        eventBus.emit(GameEvents.PLAYER_SHOOT, {
            position: startPos,
            direction: dir
        })

        expect(manager['projectiles'].length).toBe(1)
        expect(scene.children.length).toBe(1)
    })

    it('should remove projectile after lifetime expires', () => {
        manager.spawn(new Vector3(0, 0, 0), new Vector3(0, 0, -1))

        for (let i = 0; i < 25; i++) {
            manager.update(0.1, [])
        }

        expect(manager['projectiles'].length).toBe(0)
        expect(scene.children.length).toBe(0)
    })

    it('should detect collision and emit ENEMY_HIT', () => {
        const emitSpy = vi.spyOn(eventBus, 'emit')
        const target = new Mesh(new BoxGeometry(1, 1, 1), new MeshStandardMaterial())
        target.position.set(0, 0, -2)
        target.updateMatrixWorld()

        manager.spawn(new Vector3(0, 0, 0), new Vector3(0, 0, -1))

        manager.update(0.1, [target])

        expect(emitSpy).toHaveBeenCalledWith(
            GameEvents.ENEMY_HIT,
            expect.objectContaining({
                target: target,
                damage: 10
            })
        )
        expect(manager['projectiles'].length).toBe(0)
    })
})
