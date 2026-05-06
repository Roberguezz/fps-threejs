import { Timer } from 'three'
import { CameraManager } from './managers/CameraManager'
import { RenderManager } from './managers/RenderManager'
import { FPSScene } from './FPSScene'
import { LightManager } from './managers/LightManager'
import { WorldBuilder } from './managers/WorldBuilder'
import { Player } from '../game/entities/Player'
import { InputManager } from './InputManager'
import { ProjectileManager } from '../game/managers/ProjectileManager'
import { EnemyManager } from '../game/managers/EnemyManager'
import { DamageApplier } from '../game/models/DamageApplier'
import { DamageNumbers } from '../game/views/DamageNumbers'
import { UI } from '../game/views/UI'

export class Engine {
	private scene: FPSScene
	private renderManager: RenderManager
	private cameraManager: CameraManager
	private lightManager: LightManager
	private input: InputManager
	private enemyManager: EnemyManager
	private projectileManager: ProjectileManager
	private damageApplier: DamageApplier
	private damageNumbers: DamageNumbers
	private ui: UI
	private player: Player
	private timer: Timer

	constructor() {
		// 1. Core Infrastructure
		this.scene = new FPSScene()
		this.cameraManager = new CameraManager()
		this.input = new InputManager()
		this.ui = new UI()

		// 2. Gameplay Managers
		this.projectileManager = new ProjectileManager(this.scene)
		this.damageApplier = new DamageApplier()
		this.damageNumbers = new DamageNumbers(this.scene)

		// 3. Entities
		this.player = new Player(this.scene, this.cameraManager)
		this.enemyManager = new EnemyManager(this.scene, this.scene.shootableObjects)

		// 4. Initialization
		WorldBuilder.buildFloor(this.scene) // Construir el suelo
		this.cameraManager.setPlayer(this.player)
		this.renderManager = new RenderManager(this.cameraManager)
		this.lightManager = new LightManager(this.scene)

		this.timer = new Timer()

		this.loop()
	}

	private loop() {
		this.timer.update()
		let delta = this.timer.getDelta()
		if (delta <= 0) delta = 1 / 60
		const cappedDelta = Math.min(delta, 0.05)

		// --- UPDATES ---
		this.player.update(cappedDelta, this.input)
		this.enemyManager.update(cappedDelta, this.player.position)
		this.projectileManager.update(cappedDelta, this.scene.shootableObjects)
		this.damageNumbers.update(cappedDelta)

		// --- RENDER ---
		this.renderManager.superRender(this.scene)

		requestAnimationFrame(() => this.loop())
	}
}
