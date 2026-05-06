import { PerspectiveCamera } from 'three'
import type { ICameraTarget } from '../shared/interfaces/ICameraTarget'

export class CameraManager {
	public camera: PerspectiveCamera
	private player?: ICameraTarget
	private sensitivity: number = 0.002

	constructor() {
		this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
		// YXZ es sagrado para evitar que la cámara rote como un avión (Gimbal Lock)
		this.camera.rotation.order = 'YXZ'
		this.initEvents()
	}

	private initEvents() {
		window.addEventListener('mousemove', (e) => {
			// Solo rotamos si el ratón está bloqueado y tenemos un jugador
			if (document.pointerLockElement && this.player) {
				// 1. ROTACIÓN HORIZONTAL (Yaw)
				// Se aplica al CUERPO del jugador para que avance hacia donde mira
				this.player.rotation.y -= e.movementX * this.sensitivity

				// 2. ROTACIÓN VERTICAL (Pitch)
				// Se aplica solo a la CÁMARA
				this.camera.rotation.x -= e.movementY * this.sensitivity

				// 3. CLAMPING (Límites)
				// Esto evita que el jugador dé la vuelta completa verticalmente
				// 1.5 radianes son aproximadamente 85 grados
				this.camera.rotation.x = Math.max(-1.5, Math.min(1.5, this.camera.rotation.x))
			}
		})

		window.addEventListener('resize', () => {
			this.camera.aspect = window.innerWidth / window.innerHeight
			this.camera.updateProjectionMatrix()
		})
	}

	public setPlayer(player: ICameraTarget) {
		this.player = player
	}
}
