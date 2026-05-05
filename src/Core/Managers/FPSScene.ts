import { BoxGeometry, Color, Mesh, MeshStandardMaterial, Object3D, AmbientLight, DirectionalLight } from "three";
import { Scene } from "three"; // Importamos Scene para extenderla
import type { ProjectileManager } from "./ProjectileManager";

export class FPSScene extends Scene {
    public projectileManager!: ProjectileManager;

    // 1. Necesitas este array para que el ProjectileManager sepa qué puede recibir daño
    public shootableObjects: Object3D[] = [];

    constructor() {
        super();
        this.background = new Color(0x111111);

        // 2. IMPORTANTE: Añade luces, si no el Dummy se verá negro (o no se verá)
        this.addLights();

        this.createFloor();

    }

    private addLights() {
        const ambient = new AmbientLight(0xffffff, 0.5);
        this.add(ambient);

        const sun = new DirectionalLight(0xffffff, 1);
        sun.position.set(5, 10, 7);
        this.add(sun);
    }

    private createFloor() {
        const bGeometry = new BoxGeometry(100, 0.5, 100);
        const nMaterial = new MeshStandardMaterial({ color: 0x444444 }); // Gris oscuro mejor que rojo para ver al Dummy
        const floor = new Mesh(bGeometry, nMaterial);

        // El suelo suele estar a -0.25 si su grosor es 0.5 para que la superficie sea Y=0
        floor.position.y = -0.25;

        this.add(floor);
        console.log('suelo creado y añadido');
    }
}