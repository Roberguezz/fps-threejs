import {  Scene, WebGLRenderer } from "three";
import type { CameraManager } from "./CameraManager";

export class RenderManager extends WebGLRenderer {
    private cameraManager: CameraManager

    constructor(cameraManager: CameraManager) {
        // Paso necesario si no, no podemos asisgnar cosas en el super
        const canvas = document.querySelector('canvas') as HTMLCanvasElement // Preferencia de Three.js
        // Llamando al super creamos un tipo de webgl...
        super({
            canvas: canvas,
            antialias: true
        })

        // Parte info de la camara
        this.cameraManager = cameraManager

        // Parte renderer
        // Momento rezize
        // Primero una llamadita al principio para ajustar
        this.onResize()
        // Luego un listener bien atento a los cambios
        window.addEventListener('resize', () => this.onResize())
    
        // Capturar el ratón en pantalla al hacer click
        canvas.addEventListener('click', () => {
            canvas.requestPointerLock()
        })
    }

    private onResize() {
        // Las necesito 2 veces :)
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Actualizacion renderer
        this.setSize(w, h)
        // Bueno para que pantallas en alta ress no caiga en fps
        this.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        // Llamamos a la cam
        const cam = this.cameraManager.camera
        cam.aspect = w / h
        cam.updateProjectionMatrix()
    }

    public superRender(sceneManager: Scene) {
        this.render(sceneManager, this.cameraManager.camera)
    }
}