import {
    SphereGeometry,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector3,
    Color,
    Object3D,
    Raycaster
} from 'three'
import { eventBus, GameEvents } from '../../core/Events'

interface Projectile {
    mesh: Mesh
    direction: Vector3
    lifeTime: number
}

export class ProjectileManager {
    private scene: Scene
    private projectiles: Projectile[] = []
    private raycaster = new Raycaster()
    private speed: number = 50
    private maxLife: number = 2

    private geometry = new SphereGeometry(0.05, 8, 8)
    private material = new MeshBasicMaterial({ color: new Color('yellow') })

    constructor(scene: Scene) {
        this.scene = scene

        // Escuchar disparos del jugador
        this.onPlayerShoot = this.onPlayerShoot.bind(this)
        eventBus.on(GameEvents.PLAYER_SHOOT, this.onPlayerShoot)
    }

    private onPlayerShoot(data: { position: Vector3; direction: Vector3 }) {
        this.spawn(data.position, data.direction)
    }

    public spawn(position: Vector3, direction: Vector3) {
        const mesh = new Mesh(this.geometry, this.material)
        mesh.position.copy(position)
        this.scene.add(mesh)

        this.projectiles.push({
            mesh: mesh,
            direction: direction.clone().normalize(),
            lifeTime: this.maxLife
        })
    }

    public update(delta: number, sceneObjects: Object3D[]) {
        if (!sceneObjects) return

        const dt = Math.min(delta, 0.1)

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i]

            p.lifeTime -= dt
            if (p.lifeTime <= 0) {
                this.removeProjectile(i)
                continue
            }

            const distanceThisFrame = this.speed * dt
            this.raycaster.set(p.mesh.position, p.direction)
            this.raycaster.far = distanceThisFrame + 0.1

            const targets = sceneObjects || []
            const intersects = this.raycaster.intersectObjects(targets, false)

            if (intersects.length > 0) {
                const hitPoint = intersects[0].point
                const target = intersects[0].object as any

                // Emitimos el evento de impacto
                eventBus.emit(GameEvents.ENEMY_HIT, {
                    target: target,
                    damage: 10, // Podría ser dinámico en el futuro
                    position: hitPoint.clone()
                })

                this.removeProjectile(i)
            } else {
                p.mesh.position.addScaledVector(p.direction, distanceThisFrame)
            }
        }
    }

    private removeProjectile(index: number) {
        const p = this.projectiles[index]
        if (p && p.mesh) {
            this.scene.remove(p.mesh)
            this.projectiles.splice(index, 1)
        }
    }

    public dispose() {
        eventBus.off(GameEvents.PLAYER_SHOOT, this.onPlayerShoot)
    }
}
