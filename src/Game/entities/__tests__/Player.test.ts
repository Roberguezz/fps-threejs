import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Player } from '../Player'
import { FPSScene } from '../../../core/FPSScene'
import { CameraManager } from '../../../core/managers/CameraManager'
import { InputManager } from '../../../core/InputManager'
import { eventBus, GameEvents } from '../../../core/Events'

describe('Player', () => {
	let player: Player
	let scene: FPSScene
	let cameraManager: CameraManager
	let input: InputManager

	beforeEach(() => {
		scene = new FPSScene()
		cameraManager = new CameraManager()
		input = new InputManager()
		player = new Player(scene, cameraManager)
	})

	it('should initialize at eye height', () => {
		expect(player.position.y).toBe(0)
		expect(player['camera'].position.y).toBe(player['eyeHeight'])
	})

	it('should move forward when W is pressed', () => {
		const initialZ = player.position.z

		// Mock input
		vi.spyOn(input, 'isPressed').mockImplementation((key) => key === 'w')

		player.update(0.1, input)

		expect(player.position.z).toBeLessThan(initialZ)
	})

	it('should jump when Space is pressed and grounded', () => {
		player.position.y = 0
		player['isGrounded'] = true

		vi.spyOn(input, 'isPressed').mockImplementation((key) => key === ' ')

		player.update(0.1, input)

		expect(player['verticalVelocity']).toBe(player['jumpForce'])
	})

	it('should emit PLAYER_SHOOT event when shoot is called', () => {
		const emitSpy = vi.spyOn(eventBus, 'emit')

		// Llamar a shoot directamente
		player['shoot']([])

		expect(emitSpy).toHaveBeenCalledWith(GameEvents.PLAYER_SHOOT, expect.any(Object))
	})
})
