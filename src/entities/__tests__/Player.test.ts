import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Player } from '../Player'
import { FPSScene } from '../../views/FPSScene'
import { CameraManager } from '../../views/CameraManager'
import { InputManager } from '../../core/InputManager'

describe('Player', () => {
	let scene: FPSScene
	let cameraManager: CameraManager
	let player: Player
	let input: InputManager

	beforeEach(() => {
		scene = new FPSScene()
		cameraManager = new CameraManager()
		player = new Player(scene, cameraManager)
		input = new InputManager()

		// Mockear DOM element para el puntero
		Object.defineProperty(document, 'pointerLockElement', {
			value: document.body,
			writable: true
		})
	})

	it('should initialize correctly', () => {
		expect(player.position.y).toBe(0)
		expect(scene.children).toContain(player)
	})

	it('should move according to input', () => {
		// Mockear 'w' pulsada
		vi.spyOn(input, 'isPressed').mockImplementation((key) => key === 'w')

		player.update(0.1, input)
		expect(player.position.z).toBeLessThan(0) // 'w' mueve hacia -Z
	})

	it('should sprint when shift is pressed', () => {
		vi.spyOn(input, 'isPressed').mockImplementation((key) => key === 'w' || key === 'shift')

		player.update(0.1, input)
		// Debería haberse movido el doble de rápido (sprintMultiplier = 2)
		// Velocidad normal = 10, sprint = 20. En 0.1s mueve 2
		expect(player.position.z).toBeCloseTo(-2)
	})

	it('should handle gravity and jumping', () => {
		// Poner al jugador en el aire
		player.position.y = 5
		player.update(0.1, input)

		// Debería haber caído por gravedad
		expect(player.position.y).toBeLessThan(5)

		// Simular tocar suelo
		player.position.y = -1
		player.update(0.1, input)
		expect(player.position.y).toBe(0) // Clamping al suelo
		expect(player['isGrounded']).toBe(true)

		// Saltar
		vi.spyOn(input, 'isPressed').mockImplementation((key) => key === ' ')
		player.update(0.1, input)
		expect(player['verticalVelocity']).toBeGreaterThan(0)
	})
})
