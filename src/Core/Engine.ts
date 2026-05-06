import { Timer } from 'three'
import { CameraManager } from '../views/CameraManager'
import { RenderManager } from '../views/RenderManager'
import { FPSScene } from '../views/FPSScene'
import { LightManager } from '../views/LightManager'
import { WorldBuilder } from '../views/WorldBuilder'
import { Player } from '../entities/Player'
import { InputManager } from './InputManager'
import { ProjectileManager } from '../managers/ProjectileManager'
import { EnemyManager } from '../managers/EnemyManager'
import { DamageApplier } from '../models/DamageApplier'
import { DamageNumbers } from '../views/DamageNumbers'
import { UI } from '../views/UI'

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
