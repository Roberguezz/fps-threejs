import { Sprite, SpriteMaterial, CanvasTexture, Scene, Vector3, Group } from "three";

export class DamageManager {
    private scene: Scene;
    private markers: { sprite: Sprite, velocity: Vector3, life: number }[] = [];

    constructor(scene: Scene) {
        this.scene = scene;
    }

    public spawn(position: Vector3, amount: number) {
        // 1. Crear un canvas para dibujar el número
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d')!;

        // 2. Estilo del texto
        ctx.font = 'Bold 80px Arial';
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        ctx.textAlign = 'center';
        ctx.strokeText(amount.toString(), 128, 128);
        ctx.fillText(amount.toString(), 128, 128);

        // 3. Crear textura y Sprite
        const texture = new CanvasTexture(canvas);
        const material = new SpriteMaterial({ map: texture, transparent: true });
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
                m.sprite.material.map?.dispose();
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