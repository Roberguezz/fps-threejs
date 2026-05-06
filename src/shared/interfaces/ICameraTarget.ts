import type { Vector3, Quaternion } from 'three'

/**
 * Lo mínimo que CameraManager necesita de la entidad que sigue.
 * Desacopla CameraManager de la clase concreta Player.
 */
export interface ICameraTarget {
	position: Vector3
	rotation: { y: number }
	quaternion: Quaternion
}
