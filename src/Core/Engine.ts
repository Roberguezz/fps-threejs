import { Timer } from "three";
import { CameraManager } from "./Managers/CameraManager";
import { RenderManager } from "./Managers/RenderManager";
import { FPSScene } from "./Managers/FPSScene";
import { LigthManager } from "./Managers/LightManager";
import { Player } from "../Game/Player";
import { InputManager } from "../Game/Managers/InputManager";
import { ProjectileManager } from "./Managers/ProjectileManager";
import { EnemyManager } from "../Game/Managers/EnemyManager";
import { DamageManager } from "../Game/Managers/DamageManager";

export class Engine {
    private fpsScene: FPSScene
    private renderManager: RenderManager
    private cameraManager: CameraManager
    private lightManager: LigthManager
    private inputManager: InputManager
    private enemyManager: EnemyManager
    private projectileManager: ProjectileManager
    private damageManager: DamageManager // <--- Manager de números
    private player: Player
    private timer: Timer

    constructor() {
        this.fpsScene = new FPSScene()
        this.cameraManager = new CameraManager()

        this.projectileManager = new ProjectileManager(this.fpsScene)
        this.fpsScene.projectileManager = this.projectileManager

        this.damageManager = new DamageManager(this.fpsScene);
        // Inyectamos el manager en el sistema de proyectiles
        this.projectileManager.setDamageManager(this.damageManager);

        this.player = new Player(this.fpsScene, this.cameraManager)
        this.enemyManager = new EnemyManager(this.fpsScene, this.fpsScene.shootableObjects);

        this.cameraManager.setPlayer(this.player)

        this.renderManager = new RenderManager(this.cameraManager)
        this.lightManager = new LigthManager(this.fpsScene)
        this.inputManager = new InputManager()

        this.timer = new Timer()

        this.loop()
    }

    private loop() {
        this.timer.update();
        let delta = this.timer.getDelta();
        if (delta <= 0) delta = 1 / 60;
        const cappedDelta = Math.min(delta, 0.05);

        // --- UPDATES ---
        this.player.update(cappedDelta, this.inputManager);
        this.enemyManager.update(cappedDelta, this.player.position);
        this.projectileManager.update(cappedDelta, this.fpsScene.shootableObjects);

        // ¡IMPORTANTE! Si no actualizas el damageManager, los números no flotan ni mueren
        this.damageManager.update(cappedDelta);

        // --- RENDER ---
        this.renderManager.superRender(this.fpsScene);

        requestAnimationFrame(() => this.loop());
    }
}