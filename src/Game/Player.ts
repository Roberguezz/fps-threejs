import { BoxGeometry, Mesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Raycaster, Vector3, Vector2 } from "three"
import type { FPSScene } from "../Core/Managers/FPSScene"
import type { InputManager } from "./Managers/InputManager"
import type { CameraManager } from "../Core/Managers/CameraManager"
import type { ProjectileManager } from "../Core/Managers/ProjectileManager"

export class Player extends Object3D {
    private speed: number = 10
    private sprintMultiplier: number = 2

    private playerBody: Mesh
    private weapon: Mesh
    private camera: PerspectiveCamera

    private verticalVelocity: number = 0
    private isGrounded: boolean = false
    private gravity: number = -25
    private jumpForce: number = 10

    private camWorldDir = new Vector3()
    private inputVector = new Vector3()

    private bobTimer: number = 0
    private recoilSpeed: number = 10
    private shootRaycaster = new Raycaster()
    private centerScreen = new Vector2(0, 0)

    private baseFOV: number = 75
    private sprintFOV: number = 85

    private muzzlePoint: Object3D

    constructor(sceneManager: FPSScene, cameraManager: CameraManager) {
        super()

        this.camera = cameraManager.camera
        this.add(this.camera)

        // --- ARMA (ViewModel) ---
        const weaponGeo = new BoxGeometry(0.1, 0.1, 0.5)
        const weaponMat = new MeshStandardMaterial({ color: 0x333333 })
        this.weapon = new Mesh(weaponGeo, weaponMat)
        this.camera.add(this.weapon)
        this.weapon.position.set(0.3, -0.3, -0.5)

        this.muzzlePoint = new Object3D()
        this.muzzlePoint.position.set(0, 0, -0.25) // Ajusta según el largo del modelo
        this.weapon.add(this.muzzlePoint)// Guárdalo como propiedad de la clase

        // --- CUERPO ---
        const pGeo = new BoxGeometry(1, 2, 1)
        const pMat = new MeshStandardMaterial({ color: 0x00ff00 })
        this.playerBody = new Mesh(pGeo, pMat)
        this.playerBody.position.y = 1
        this.playerBody.visible = false
        this.add(this.playerBody)

        this.camera.position.set(0, 1.7, 0)
        sceneManager.add(this)

        window.addEventListener('mousedown', (e) => {
            if (document.pointerLockElement && e.button === 0) {
                this.shoot(sceneManager.projectileManager, sceneManager.shootableObjects)
            }
        })
    }

    private shoot(projectileManager: ProjectileManager, targets: Object3D[]) {
        if (!projectileManager) return;

        // 1. Posición de la punta del arma (Muzzle)
        const barrelPosition = new Vector3();
        this.muzzlePoint.getWorldPosition(barrelPosition);

        // 2. ¿A qué estamos apuntando en el centro de la pantalla?
        const targetPoint = new Vector3();

        // Configuramos el rayo desde el centro de la cámara (0,0 es el centro en NDC)
        this.shootRaycaster.setFromCamera(this.centerScreen, this.camera);

        // Miramos si choca con algo de nuestra lista de objetivos
        const intersects = this.shootRaycaster.intersectObjects(targets);

        if (intersects.length > 0) {
            // Si hay impacto, apuntamos a ese punto exacto
            targetPoint.copy(intersects[0].point);
        } else {
            // Si no hay nada, proyectamos un punto a 500 metros en la dirección del rayo
            // Esto asegura que usamos la posición y dirección del mundo correctas
            this.shootRaycaster.ray.at(500, targetPoint);
        }

        // 3. Calculamos la dirección real: desde el cañón hacia el punto de impacto
        const finalDirection = new Vector3()
            .subVectors(targetPoint, barrelPosition)
            .normalize();

        // 4. Disparamos
        projectileManager.spawn(barrelPosition, finalDirection);

        // 5. Retroceso (Recoil)
        this.weapon.position.z += 0.15;
        this.weapon.rotation.x -= 0.2;
    }

    public update(delta: number, input: InputManager) {
        // --- 1. MOVIMIENTO ---
        this.inputVector.set(0, 0, 0)
        if (input.isPressed('w')) this.inputVector.z -= 1
        if (input.isPressed('s')) this.inputVector.z += 1
        if (input.isPressed('a')) this.inputVector.x -= 1
        if (input.isPressed('d')) this.inputVector.x += 1

        const isMoving = this.inputVector.lengthSq() > 0
        const isSprinting = input.isPressed('shift') && isMoving

        const currentSpeed = isSprinting ? this.speed * this.sprintMultiplier : this.speed
        const moveSpeed = currentSpeed * delta

        if (isMoving) {
            this.inputVector.normalize()
            this.inputVector.applyQuaternion(this.quaternion)
            this.inputVector.y = 0
            this.inputVector.normalize()
            this.position.add(this.inputVector.multiplyScalar(moveSpeed))
        }

        // --- 2. FOV ---
        const targetFOV = isSprinting ? this.sprintFOV : this.baseFOV
        this.camera.fov += (targetFOV - this.camera.fov) * delta * 5
        this.camera.updateProjectionMatrix()

        // --- 3. BAMBOLEO (BOBBING) ---
        if (isMoving && this.isGrounded) {
            this.bobTimer += delta * (isSprinting ? 15 : 10)
            const bobX = Math.cos(this.bobTimer * 0.5) * (isSprinting ? 0.05 : 0.02)
            const bobY = Math.sin(this.bobTimer) * (isSprinting ? 0.08 : 0.04)

            this.camera.position.y = 1.7 + bobY
            this.weapon.position.x = 0.3 + bobX
            this.weapon.position.y = -0.3 + bobY * 0.5
        } else {
            this.bobTimer = 0
            this.camera.position.y += (1.7 - this.camera.position.y) * delta * 5
            this.weapon.position.x += (0.3 - this.weapon.position.x) * delta * 5
            this.weapon.position.y += (-0.3 - this.weapon.position.y) * delta * 5
        }

        // --- 4. RECUPERACIÓN DE RETROCESO ---
        const lerpSpeed = delta * this.recoilSpeed

        // El arma vuelve a su sitio original (Z: -0.5, Rot: 0)
        this.weapon.position.z += (-0.5 - this.weapon.position.z) * lerpSpeed
        this.weapon.rotation.x += (0 - this.weapon.rotation.x) * lerpSpeed

        // NOTA: No toques this.camera.rotation aquí. 
        // Deja que el CameraManager se encargue de eso al 100%.

        // --- 5. GRAVEDAD Y SALTO ---
        this.verticalVelocity += this.gravity * delta
        this.position.y += this.verticalVelocity * delta

        if (this.position.y <= 0) {
            this.position.y = 0
            this.verticalVelocity = 0
            this.isGrounded = true
        } else {
            this.isGrounded = false
        }

        if (input.isPressed(' ') && this.isGrounded) {
            this.verticalVelocity = this.jumpForce
            this.isGrounded = false
        }
    }
}