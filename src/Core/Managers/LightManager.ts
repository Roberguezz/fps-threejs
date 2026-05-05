import { AmbientLight, DirectionalLight } from "three";
import type { FPSScene } from "./FPSScene";

export class LigthManager {
    public ambient: AmbientLight
    public sun: DirectionalLight

    constructor(sceneManager: FPSScene) {
        this.ambient = new AmbientLight(0xffffff, 0.4)
        sceneManager.add(this.ambient)

        this.sun = new DirectionalLight(0xffffff, 0.8)
        this.sun.position.set(5, 10, 7.5)
        sceneManager.add(this.sun)
    }
}