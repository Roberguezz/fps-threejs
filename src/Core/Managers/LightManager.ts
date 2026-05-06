import { AmbientLight, DirectionalLight } from 'three'
import type { FPSScene } from '../FPSScene'

export class LightManager {
    public ambient: AmbientLight
    public sun: DirectionalLight

    constructor(scene: FPSScene) {
        this.ambient = new AmbientLight(0xffffff, 0.4)
        scene.add(this.ambient)

        this.sun = new DirectionalLight(0xffffff, 0.8)
        this.sun.position.set(5, 10, 7.5)
        scene.add(this.sun)
    }
}
