import { Sprite, SpriteMaterial, CanvasTexture, Scene, Vector3, Group } from "three";

export class DamageManager {
    private scene: Scene;
    private markers: { sprite: Sprite, velocity: Vector3, life: number }[] = [];
    private textureCache: Map<number, CanvasTexture> = new Map();

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public spawn(position: Vector3, amount: number) {
        let texture = this.textureCache.get(amount);

        if (!texture) {
            // Solo creamos el canvas y la textura si no existe ya para ese número
            const canvas = document.createElement('canvas');
            canvas.width = 128; // Reducido de 256 para ahorrar memoria, 128 suele bastar
            canvas.height = 128;
            const ctx = canvas.getContext('2d')!;

            ctx.font = 'Bold 60px Arial';
            ctx.fillStyle = 'yellow';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 6;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeText(amount.toString(), 64, 64);
            ctx.fillText(amount.toString(), 64, 64);

            texture = new CanvasTexture(canvas);
            this.textureCache.set(amount, texture);
        }

        const material = new SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false // Para que siempre se vea por encima si quieres
        });
        const sprite = new Sprite(material);

        // Posición inicial con un poco de aleatoriedad para que no se solapen
        sprite.position.copy(position);
        sprite.position.y += 1; // Un poco por encima del impacto
        sprite.scale.set(1.5, 1.5, 1);

        this.scene.add(sprite);

        // 4. Guardar para animar
        this.markers.push({
            sprite: sprite,
            velocity: new Vector3((Math.random() - 0.5) * 0.5, 2, (Math.random() - 0.5) * 0.5),
            life: 1.0 // 1 segundo de vida
        });
    }

    public update(delta: number) {
        for (let i = this.markers.length - 1; i >= 0; i--) {
            const m = this.markers[i];
            m.life -= delta;

            if (m.life <= 0) {
                this.scene.remove(m.sprite);
                // IMPORTANTE: No borramos la textura del cache, solo el material del sprite
                m.sprite.material.dispose();
                this.markers.splice(i, 1);
                continue;
            }

            // Mover hacia arriba y un poco a los lados
            m.sprite.position.addScaledVector(m.velocity, delta);
            // Hacer que desaparezca poco a poco (fade out)
            m.sprite.material.opacity = m.life;
        }
    }
}