import {
    SphereGeometry,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector3,
    Color,
    Object3D,
    Raycaster
} from "three";
import type { DamageManager } from "../../Game/Managers/DamageManager";

interface Projectile {
    mesh: Mesh;
    direction: Vector3;
    lifeTime: number;
}

export class ProjectileManager {
    private scene: Scene;
    private projectiles: Projectile[] = [];
    private raycaster = new Raycaster();

    // Nueva propiedad para el DamageManager
    public damageManager?: DamageManager;

    private speed: number = 50;
    private maxLife: number = 2;

    private geometry = new SphereGeometry(0.05, 8, 8);
    private material = new MeshBasicMaterial({ color: new Color('yellow') });

    constructor(scene: Scene) {
        this.scene = scene;
    }

    /**
     * Permite al Engine inyectar el manager de daño
     */
    public setDamageManager(manager: DamageManager) {
        this.damageManager = manager;
    }

    public spawn(position: Vector3, direction: Vector3) {
        const mesh = new Mesh(this.geometry, this.material);
        mesh.position.copy(position);
        this.scene.add(mesh);

        this.projectiles.push({
            mesh: mesh,
            direction: direction.clone().normalize(),
            lifeTime: this.maxLife
        });
    }

    public update(delta: number, sceneObjects: Object3D[]) {
        if (!sceneObjects) {
            console.warn("ProjectileManager: sceneObjects es undefined.");
            return;
        }

        const dt = Math.min(delta, 0.1);

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];

            p.lifeTime -= dt;
            if (p.lifeTime <= 0) {
                this.removeProjectile(i);
                continue;
            }

            const distanceThisFrame = this.speed * dt;
            this.raycaster.set(p.mesh.position, p.direction);
            this.raycaster.far = distanceThisFrame + 0.1;

            const targets = sceneObjects || [];
            const intersects = this.raycaster.intersectObjects(targets, true);

            if (intersects.length > 0) {
                const hitPoint = intersects[0].point;
                const target = intersects[0].object as any;

                // Lógica de impacto contra Dummy
                if (target.isDummy && typeof target.takeDamage === 'function') {
                    target.takeDamage();
                    this.showHitmarker();

                    // --- GENERAR NÚMERO DE DAÑO ---
                    if (this.damageManager) {
                        this.damageManager.spawn(hitPoint, 10);
                    }
                }

                this.removeProjectile(i);
            } else {
                p.mesh.position.addScaledVector(p.direction, distanceThisFrame);
            }
        }
    }

    private removeProjectile(index: number) {
        const p = this.projectiles[index];
        if (p && p.mesh) {
            this.scene.remove(p.mesh);
            this.projectiles.splice(index, 1);
        }
    }

    private showHitmarker() {
        const hm = document.getElementById('hitmarker');
        if (hm) {
            hm.style.display = 'block';
            setTimeout(() => {
                if (hm) hm.style.display = 'none';
            }, 100);
        }
    }
}