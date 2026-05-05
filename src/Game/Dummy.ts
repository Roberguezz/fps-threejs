import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3, Color, Scene, Object3D } from "three";

export class Dummy extends Mesh {
    public isDummy = true;
    private hp: number = 3;
    private speed: number = 2; // Velocidad de persecución
    private targetList: Object3D[];
    private scene: Scene;

    // Feedback de daño
    private hitTimer: number = 0;
    private readonly hitDuration: number = 0.1;

    // Vector auxiliar estático (compartido por todos los Dummies para ahorrar memoria)
    private static _direction = new Vector3();

    constructor(pos: Vector3, scene: Scene, targetList: Object3D[]) {
        const geo = new BoxGeometry(1, 2, 1);
        const mat = new MeshStandardMaterial({ color: 0xff4444 });
        super(geo, mat);

        this.position.copy(pos);
        this.scene = scene;
        this.targetList = targetList;

        this.scene.add(this);
        this.targetList.push(this);
    }

    public update(delta: number, playerPos: Vector3) {
        // 1. Mirar hacia el jugador (solo en el eje Y para que no rote raro)
        const direction = Dummy._direction.subVectors(playerPos, this.position);
        direction.y = 0; // Mantener los pies en el suelo

        if (direction.lengthSq() > 1) { // 1^2 = 1. Más rápido que length()
            direction.normalize();
            this.position.addScaledVector(direction, this.speed * delta);
            this.lookAt(playerPos.x, this.position.y, playerPos.z);
        }

        // 2. Gestionar feedback visual
        if (this.hitTimer > 0) {
            this.hitTimer -= delta;
            if (this.hitTimer <= 0) {
                (this.material as MeshStandardMaterial).color.set(0xff4444);
            }
        }
    }

    public takeDamage() {
        this.hp--;

        // Feedback visual de impacto
        const mat = this.material as MeshStandardMaterial;
        mat.color.set(0xffffff);
        this.hitTimer = this.hitDuration;

        console.log(`HP restante: ${this.hp}`);

        if (this.hp <= 0) {
            this.die();
        }
    }

    private die() {
        // Eliminar de la escena
        this.scene.remove(this);

        // Eliminar de la lista de objetivos para que las balas no le den más
        const index = this.targetList.indexOf(this);
        if (index > -1) {
            this.targetList.splice(index, 1);
        }
    }
}

// meter eventos para controlar el game mejor accion -> evento 