import { Color, Object3D, Scene } from 'three'

export class FPSScene extends Scene {

	// 1. Necesitas este array para que el ProjectileManager sepa qué puede recibir daño
	public shootableObjects: Object3D[] = []

	constructor() {
		super()
		this.background = new Color(0x111111)
	}
}
