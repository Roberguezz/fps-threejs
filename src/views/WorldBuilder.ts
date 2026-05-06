import { BoxGeometry, Mesh, MeshStandardMaterial, Scene } from 'three'

/**
 * Responsable de construir los elementos estáticos de la escena:
 * suelo, paredes, obstáculos, etc.
 * Extrae esta responsabilidad de FPSScene para mantenerla limpia.
 */
export class WorldBuilder {

	public static buildFloor(scene: Scene): void {
		const bGeometry = new BoxGeometry(100, 0.5, 100)
		const nMaterial = new MeshStandardMaterial({ color: 0x444444 }) // Gris oscuro mejor que rojo para ver al Dummy
		const floor = new Mesh(bGeometry, nMaterial)

		// El suelo suele estar a -0.25 si su grosor es 0.5 para que la superficie sea Y=0
		floor.position.y = -0.25

		scene.add(floor)
		console.log('suelo creado y añadido')
	}
}
