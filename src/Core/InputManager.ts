export class InputManager {
    private keys: Set<string> = new Set() // Parecido a un mapa, pero este es una especie de bolsa de elementos únicos, tambien va bien

    constructor() {
        window.addEventListener('keydown', (e) => this.keys.add(e.key.toLowerCase()))
        window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()))
    }

    public isPressed(key: string): boolean {
        return this.keys.has(key.toLowerCase())
    }
}
