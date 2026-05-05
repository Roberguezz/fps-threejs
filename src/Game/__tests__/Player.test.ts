import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Scene, Vector3, PerspectiveCamera } from 'three'
import { Player } from '../Player'
import { FPSScene } from '../../Core/Managers/FPSScene'
import { CameraManager } from '../../Core/Managers/CameraManager'
import { InputManager } from '../Managers/InputManager'

describe('Player', () => {
    let player: Player
    let fpsScene: FPSScene
    let cameraManager: CameraManager
    let inputManager: InputManager

    beforeEach(() => {
        fpsScene = new FPSScene()
        cameraManager = new CameraManager()
        inputManager = new InputManager()
        player = new Player(fpsScene, cameraManager)
    })

    it('should initialize at eye height', () => {
        expect(player.position.y).toBe(0)
        expect(player['camera'].position.y).toBe(player['eyeHeight'])
    })

    it('should move forward when W is pressed', () => {
        const initialZ = player.position.z

        // Mock input
        vi.spyOn(inputManager, 'isPressed').mockImplementation((key) => key === 'w')

        player.update(0.1, inputManager)

        expect(player.position.z).toBeLessThan(initialZ)
    })

    it('should jump when Space is pressed and grounded', () => {
        player.position.y = 0
        player['isGrounded'] = true

        vi.spyOn(inputManager, 'isPressed').mockImplementation((key) => key === ' ')

        player.update(0.1, inputManager)

        expect(player['verticalVelocity']).toBe(player['jumpForce'])
    })
})
